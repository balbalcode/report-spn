<script>
import {reportMethods} from "~/store/helperActions";
export default {
  components: {
    ContentTableView: () => import("@utilities/molecules/content-view/ContentTableView"),
    ContentSpan: () => import("@utilities/atoms/utility/ContentSpan"),
  },
  props: {
    is_searching: {default: false},
    month: {default: ""},
    vehicle: {
      default: () => {
        return []
      }
    },
    column: {default: ""},
    type: {default: ""},
  },
  data: () => ({
    data: {
      rows: [],
      total: {}
    },
    table: {
      dynamic_column: 2,
      static_column: 3,
      length_dynamic_column: 0,
      additional_dynamic_column: 1,
      dynamic_count: 0,
      total_column: 0
    },
    helper: {
      is_loading: false,
      is_error: false
    },
    vehicle_map: {}
  }),
  watch: {
    is_searching: function (value) {
      if (value) this.processGetData()
    },
  },
  async mounted() {
    this.vehicle_map = await this.$utility.getVehicleMap()
  },
  methods: {
    ...reportMethods,
    passErrorToParent(error) {
      this.$emit("error", {state: true, message: error})
    },
    passFormatDownloadReport() {
      try {
        let payload = {header: {}, content: []}
        if (this.data.rows.length > 0) {
          const rows = this.formatContentReport()
          const total = this.formatTotalReport()
          payload = {header: this.formatHeaderReport(), content: rows.concat(total)}
        }
        this.$emit("ready", payload)
      } catch (error) {
        this.$emit("ready", {header: {}, content: []})
      }
    },
    setPayloadGet() {
      return {
        month: this.month,
        spot_id: this.$utility.getSpotId(),
        vehicle_codes: this.$utility.formatListParameterPayload(this.vehicle, 'value'),
        opener: this.$route.path
      }
    },
    formatTableColumn() {
      this.table.length_dynamic_column = this.vehicle.length
      this.table.dynamic_count = this.table.dynamic_column * this.table.length_dynamic_column
      this.table.total_column = this.table.dynamic_count + this.table.static_column
    },
    formatHeaderReport() {
      try {
        let sampling = this.data.rows[0]
        if (!sampling) return {}
        var fields = {
          "Tanggal": "date",
          "Hari": "days",
        }
        sampling.income.forEach((item) => {
          let total = {};
          total[`Pendapatan ${this.vehicle_map[item.code]}`] = `income_${item.alias}`
          Object.assign(fields, total)
        })
        sampling.count.forEach((item) => {
          let total = {};
          total[`Kuantitas ${this.vehicle_map[item.code]}`] = `count_${item.alias}`
          Object.assign(fields, total)
        })

        return fields
      } catch (error) {
        this.$utility.fireToast(
            "Gagal memformat data",
            "primary",
            "Kamu tidak bisa melakukan download laporan dikarenakan sistem gagal memformat data, anda dapat memuat kembali halaman ini"
        )
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatHeaderReport in TableCounterReport`)
        throw error
      }
    },
    formatContentReport() {
      try {
        let data = this.data.rows
        let report = []
        data.forEach(item => {
          let rows = {
            date: item.date,
            days: item.days,
          }
          const income_by_vehicle = this.$utility.formatReportField("income", item['income'])
          const counter_by_vehicle = this.$utility.formatReportField("count", item['count'])
          Object.assign(rows, income_by_vehicle)
          Object.assign(rows, counter_by_vehicle)
          report.push(rows)
        })
        return report
      } catch (error) {
        this.$utility.fireToast(
            "Gagal memformat data",
            "primary",
            "Kamu tidak bisa melakukan download laporan dikarenakan sistem gagal memformat data, anda dapat memuat kembali halaman ini"
        )
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatContentReport in TableCounterReport`)
        throw error
      }
    },
    formatTotalReport() {
      try {
        let sampling = this.data.total
        if (!sampling) return {}
        var fields = {
          "Tanggal": "-",
          "Hari": "-",
        }
        const income_by_vehicle = this.$utility.formatReportField("income", sampling['income'])
        const counter_by_vehicle = this.$utility.formatReportField("count", sampling['count'])
        Object.assign(fields, income_by_vehicle)
        Object.assign(fields, counter_by_vehicle)
        return fields
      } catch (error) {
        this.$utility.fireToast(
            "Gagal memformat data",
            "primary",
            "Kamu tidak bisa melakukan download laporan dikarenakan sistem gagal memformat data, anda dapat memuat kembali halaman ini"
        )
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatContentReport in TableCounterReport`)
        throw error
      }
    },
    formatColumnClass(root, index) {
      let number = index + (this.table.length_dynamic_column * root - 1)
      if ((number % 2) === 0) {
        return "odd"
      } else {
        return "even"
      }
    },
    processGetCounterVehicle(data, vehicle_code) {
      try {
        if (data.length > 0) {
          var counter = 0
          data.map((opt, index) => {
            if (opt.code === vehicle_code) counter = data[index].values
          })
          return this.$utility.convertToRupiah(counter)
        } else {
          return 0
        }
      } catch (error) {
        this.$utility.fireToast(
            "Gagal memformat data",
            "primary",
            "Kamu tidak bisa melakukan download laporan dikarenakan sistem gagal memformat data, anda dapat memuat kembali halaman ini"
        )
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatContentReport in TableCounterReport`)
        return 0
      }
    },
    async processGetData() {
      this.helper.is_loading = true
      this.helper.is_error = false
      try {
        await this.formatTableColumn()
        let payload = this.setPayloadGet()
        this.data = await this.getCounterReportByDate(payload)
        this.passFormatDownloadReport()
        this.helper.is_loading = false
      } catch (error) {
        this.helper.is_error = true
        this.helper.is_loading = false
        this.passErrorToParent(error)
        this.$emit("ready", {header: {}, content: []})
      }
    },
  }
}
</script>
<template>
  <div>
    <div class="row py-1 px-3">
      <!-- Show when it's loading -->
      <content-span v-if="helper.is_loading"/>

      <!-- Show when error was found -->
      <content-span v-else-if="helper.is_error" has_reload_button image="error.png" size="xl"
                    :has_animation="false" caption="Gagal memuat data" @reload="processGetData"/>

      <!-- Show when it's empty -->
      <content-span v-else-if="data.rows.length < 1" image="empty.png" size="xl"
                    :has_animation="false" caption="Laporan belum tersedia"/>

      <!-- Show if data exist after loading without error -->
      <div v-else class="col-12 p-0 rounded">
        <table class="d-block table table-striped table-sticky-header report-table">
          <thead class="thead-primary">
          <tr>
            <th rowspan="2" class="cell-sticky"
                style="top: .1px; left: 0px; min-width: 67px; z-index: 3;">Tanggal
            </th>
            <th rowspan="2" class="cell-sticky"
                style="top: .1px; left: 67px; min-width: 67px; z-index: 3;">Hari
            </th>
            <th width="45%" :colspan="table.length_dynamic_column" class="cell-sticky"
                style="top: .1px;">
              Pendapatan
            </th>
            <th width="45%" :colspan="table.length_dynamic_column" class="cell-sticky"
                style="top: .1px;">
              Kuantitas
            </th>

          </tr>
          <tr>
            <template v-for="(root, idx) in (table.dynamic_column)">
              <th v-for="(type, index) in vehicle" :key="`vehicle-${idx}-${index}`" style="top:44px" class="cell-sticky"
                  :class="formatColumnClass(root,index)">
                {{ type.text }}
              </th>
            </template>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(rows, idx) in data.rows" :key="`rows-${idx}`">
            <td class="cell-sticky" style="left: 0px; min-width: 67px; z-index: 2;">{{ rows.date }}</td>
            <td class="cell-sticky" style="left: 67px; min-width: 67px; z-index: 2;">{{ rows.days }}</td>
            <td v-for="index in table.length_dynamic_column" :key="`counter-income-${index}`">
              {{ $utility.convertToRupiah(rows['income'] ? rows['income'][(index - 1)].values : 0) }}
            </td>
            <td v-for="index in table.length_dynamic_column" :key="`counter-qty-${index}`">
              {{ $utility.convertToRupiah(rows['count'] ? rows['count'][(index - 1)].values : 0) }}
            </td>
          </tr>
          </tbody>
          <tfoot>
          <tr>
            <td class="bg-primary" colspan="2">Total</td>
            <td v-for="index in table.length_dynamic_column" :key="`counter-income-${index}`">
              {{ $utility.convertToRupiah(data.total['income'] ? data.total['income'][(index - 1)].values : 0) }}
            </td>
            <td v-for="index in table.length_dynamic_column" :key="`counter-qty-${index}`">
              {{ $utility.convertToRupiah(data.total['count'] ? data.total['count'][(index - 1)].values : 0) }}
            </td>
          </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>