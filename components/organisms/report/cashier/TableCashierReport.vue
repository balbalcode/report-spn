<script>
import {reportMethods} from "~/store/helperActions";

export default {
  components: {
    ContentTableView: () => import("@utilities/molecules/content-view/ContentTableView"),
    ContentSpan: () => import("@utilities/atoms/utility/ContentSpan"),
    PriceLabel: () => import("@utilities/atoms/label/PriceLabel"),
  },
  props: {
    is_searching: {default: false},
    month: {default: ""},
  },
  data: () => ({
    data: {
      vehicle: [],
      field: [],
      rows: [],
      total: {}
    },
    table: {
      dynamic_column: 0,
      static_column: 3,
      length_dynamic_column: 0,
      additional_dynamic_column: 0,
      dynamic_count: 0,
      total_column: 0
    },
    helper: {
      is_loading: false,
      is_error: false
    }
  }),
  watch: {
    is_searching: function (value) {
      if (value) this.processGetData()
    },
  },
  computed: {
    column_list: function () {
      if (Array.isArray(this.column)) {
        let result = []
        this.column.forEach((item) => {
          result.push(item.value)
        })
        return result
      } else return []
    },
  },
  async mounted() {
    if (this.is_searching) await this.processGetData()
  },
  methods: {
    ...reportMethods,

    passErrorToParent(error) {
      this.$emit("error", {state: true, message: error})
    },

    passFormatDownloadReport() {
      let payload = {header: this.formatHeaderReport(), content: this.formatContentReport()}
      this.$emit("ready", payload)
    },

    setPayloadGet() {
      return {
        month: (this.month) ? this.month : this.formatDefaultDate(),
        spot_id: this.$utility.getSpotId(),
        opener: this.$route.path
      }
    },

    formatDefaultDate() {
      return this.$utility.formatDateMoment(new Date(), "YYYY-MM")
    },

    formatHeaderReport() {
      // define base object
      try {
        let header = {
          "Tanggal": "date",
          "Shift": "shift",
          "Petugas": "officer_name",
          "Tanggal Pelaporan": "reported_at",
          "Jenis Kendaraan": "jenis kendaraan",
        }

        // create sampling
        if (this.data.rows[0]) {
          let sampling = this.$utility.copyObject(this.data.rows[0])
          delete sampling.date
          delete sampling.shift
          delete sampling.officer_name
          delete sampling.reported_at
          delete sampling['jenis kendaraan']

          // looping sampling and assign to header object
          Object.entries(sampling).forEach(([key]) => {
            let fields = {}
            fields[`Unit ${key}`] = `qty_${key}`
            fields[`Jumlah ${key}`] = `values_${key}`
            Object.assign(header, fields)
          });
        }

        return header
      } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatHeaderReport TableCashierReport`)
        return {}
      }
    },

    formatContentReport() {
      try {
        let report = []
        this.data.rows.map((item) => {
          let rows = {
            "date": item.date,
            "shift": item.shift,
            "officer_name": item.officer_name,
            "reported_at": item.reported_at,
            "jenis kendaraan": item['jenis kendaraan'],
          }

          let sampling = this.$utility.copyObject(item)
          delete sampling.date
          delete sampling.shift
          delete sampling.officer_name
          delete sampling.reported_at
          delete sampling['jenis kendaraan']

          Object.entries(sampling).forEach(([key, value]) => {
            let fields = {}
            fields[`qty_${key}`] = value.quantity
            fields[`values_${key}`] = value.amount
            Object.assign(rows, fields)
          });

          report.push(rows)
        })
        return report
      } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatContentReport TableCashierReport`)
        return []
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

    formatColumnLabel(root, index) {
      let number = index + (this.table.length_dynamic_column * root - 1)
      if ((number % 2) === 0) {
        return "Nilai"
      } else {
        return "Jumlah"
      }
    },

    formatReportOfficerStat(data) {
      if (data) {
        // CLONE OBJECT FOR SAMPLING,
        let sampling = this.$utility.copyObject(data)

        // mapping based on json contract
        delete sampling.date
        delete sampling.shift
        delete sampling.officer_name
        delete sampling.reported_at
        delete sampling['jenis kendaraan']
        this.processMappingTable(sampling)
      }
      this.table.length_dynamic_column = this.table.dynamic_column * 2
    },

    processMappingTable(data) {
      try {
        this.data.field = []
        this.table.dynamic_column = 0
        Object.entries(data).forEach(([key]) => {
          this.data.field.push(key)
          this.table.dynamic_column += 1
        });
      } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at processMappingTable TableCashierReport`)
      }
    },

    async processGetData() {
      this.helper.is_loading = true
      this.helper.is_error = false
      try {
        let payload = this.setPayloadGet()
        let data = await this.getOfficerStatReport(payload)
        this.data.rows = data.rows
        if (this.data.rows.length > 0) {
          this.formatReportOfficerStat(this.data.rows[0])
        }
        this.passFormatDownloadReport()
      } catch (error) {
        this.data.rows = []
        this.helper.is_error = true
      }
      this.helper.is_loading = false
    },
  }
}
</script>
<template>
  <div>
    <div class="row" v-if="helper.is_loading">
      <content-span/>
    </div>

    <div class="row" v-else-if="helper.is_error">
      <content-span :has_animation="false" image="error.png" size="xl" caption="Gagal memuat data" has_reload_button @reload="processGetData"/>
    </div>

    <div class="row" v-else-if="data.rows.length < 1">
      <content-span :has_animation="false" image="empty.png" size="xl" caption="Laporan belum tersedia"/>
    </div>
    <div class="row py-1 px-3" v-else>
      <div class="col-12 p-0 rounded">
        <table class="d-block table table-striped table-sticky-header report-table">
          <thead class="thead-primary">
          <tr>
            <th rowspan="3" class="cell-sticky" style="top: 1px; left: 0px; min-width: 67px; z-index: 3;">Tanggal</th>
            <th rowspan="3" class="cell-sticky" style="top: 1px; left: 67px; min-width: 67px; z-index: 3;">Shift</th>
            <template v-for="(root, index) in (table.dynamic_column)">
              <th colspan="2" :key="`dc1-${index}`" class="cell-sticky" style="top: 1px; min-height: 44.5px;">
                {{ data.field[index] }}
              </th>
            </template>
            <th rowspan="2" class="cell-sticky" style="top: 1px;">Jenis Kendaraan</th>
            <th rowspan="2" class="cell-sticky" style="top: 1px;">Petugas</th>
            <th rowspan="2" class="cell-sticky" style="top: 1px;">Waktu Pembuatan</th>
          </tr>
          <tr>
            <template v-for="(root, index) in (table.length_dynamic_column)">
              <th :key="`dc2-${index}`" :class="formatColumnClass(root, index)" class="cell-sticky"
                  style="top: 45.5px;">{{ formatColumnLabel(root, index) }}
              </th>
            </template>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(report, index) in data.rows" :key="index">
            <td class="cell-sticky" style="left: 0px; min-width: 67px; z-index: 2;">{{ report.date }}</td>
            <td class="cell-sticky" style="left: 67px; min-width: 67px; z-index: 2;">{{ report.shift }}</td>
            <template v-for="root in (data.field)">
              <td :key="`${index}-${root}-qty`">
                {{ report[root] ? $utility.convertToRupiah(report[root].quantity) : '-' }}
              </td>
              <td :key="`${index}-${root}-amount`">
                {{ report[root] ? $utility.convertToRupiah(report[root].values) : '-' }}
              </td>
            </template>
            <td>{{ report['jenis kendaraan'] ? report['jenis kendaraan'] : "-" }}</td>
            <td>{{ report.officer_name }}</td>
            <td>{{ report.reported_at }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
