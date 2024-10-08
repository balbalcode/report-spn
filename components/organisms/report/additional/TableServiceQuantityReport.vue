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
    service: {default: () => ([])},
  },
  data: () => ({
    data: {
      field: [],
      rows: [],
      total: {}
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
  mounted() {
    if (this.is_searching) this.processGetData()
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
          const total =  this.formatTotalReport()
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
        service: this.formatServiceList(),
        opener: this.$route.path
      }
    },

    formatServiceList() {
      return this.service.map(item => item.value).join(',');
    },

    formatHeaderReport() {
      try {
        let header = {
          "Tanggal": "days",
          "Hari": "date",
          "Total Layanan": "total_amount",
          "Total Pendapatan": "total_income"
        }

        let sampling = this.$utility.copyObject(this.data.rows[0])
        delete sampling.days
        delete sampling.date
        delete sampling.total_amount
        delete sampling.total_income

        Object.entries(sampling).forEach(([key, values]) => {
          let head = {}
          head[`Jumlah ${values.name}`] = `qty_${key}`
          head[`Pendapatan ${values.name}`] = `values_${key}`
          Object.assign(header, head)
        });
        return header
      } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatHeaderReport in TableServiceQuantityReport`)
        this.passErrorToParent(error)
        throw error
      }
    },

    formatContentReport() {
      try {
        let data = this.data.rows
        let report = []
        data.map((item) => {
          let rows = {
            date: item.date,
            days: item.days,
            total_amount: item.total_amount,
            total_income: item.total_income
          }

          this.data.field.map((detail) => {
            let row = {}
            row[`qty_${detail.values}`] = item[detail.values].qty
            row[`values_${detail.values}`] = item[detail.values].values
            Object.assign(rows, row)
          })

          report.push(rows)
        })
        return report
      } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatContentReport in TableServiceQuantityReport`)
        this.passErrorToParent(error)
      }
    },

    formatTotalReport() {
      try {
        let total = {
          date: "-",
          days: "-",
          total_amount: this.data.total.total_amount,
          total_income: this.data.total.total_income
        }

        this.data.field.map((detail) => {
          let row = {}
          row[`qty_${detail.values}`] = this.data.total[detail.values].qty
          row[`values_${detail.values}`] = this.data.total[detail.values].values
          Object.assign(total, row)
        })

        return total
      } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatTotalReport in TableServiceQuantityReport`)
        throw error
      }
    },

    formatServiceQuantityReport(data) {
      if (data.length > 0) {
        let sampling = this.$utility.copyObject(data[0])
        delete sampling.date
        delete sampling.days
        delete sampling.total_amount
        delete sampling.total_income
        this.processMappingTable(sampling)
      }
    },

    processMappingTable(data) {
      this.data.field = []
      Object.entries(data).forEach(([key, values]) => {
        this.data.field.push({"values": key, "text": values.name})
      });
    },

    async processGetData() {
      this.helper.is_loading = true
      this.helper.is_error = false
      try {
        let payload = this.setPayloadGet()
        this.data = await this.getAdditionalReportByDate(payload)
        this.formatServiceQuantityReport(this.data.rows)
        this.passFormatDownloadReport()
      } catch (error) {
        this.data = { field: [], rows: [], total: {} }
        this.helper.is_error = true
        this.passErrorToParent(error)
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
      <content-span image="error.png" size="xl" :has_animation="false" caption="Gagal memuat data" has_reload_button
                    @reload="processGetData"/>
    </div>

    <div class="row" v-else-if="data.rows.length < 1">
      <content-span image="empty.png" size="xl" :has_animation="false" caption="Laporan belum tersedia"/>
    </div>
    <div class="row py-1 px-3" v-else>
      <div class="col-12 p-0 rounded overflow-scroll-x">
        <table class="table table-striped report-table min-vw-100">
          <thead class="thead-primary">
          <tr>
            <th rowspan="2">Tanggal</th>
            <th rowspan="2">Hari</th>
            <template v-for="(root, index) in data.field">
              <th colspan="2" :key="index">
                {{ root.text }}
              </th>
            </template>
            <th rowspan="2">Total Layanan</th>
            <th rowspan="2">Total Pendapatan</th>
          </tr>
          <tr>
            <template v-for="index in data.field">
              <th class="odd">Jumlah</th>
              <th class="even">Pendapatan</th>
            </template>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(rows) in data.rows">
            <td>{{ rows.date }}</td>
            <td>{{ rows.days }}</td>
            <template v-for="(field, idx) in data.field">
              <td :key="`qty-${idx}`">{{ $utility.convertToRupiah(rows[field.values].qty) }}</td>
              <td :key="`values-${idx}`">{{ $utility.convertToRupiah(rows[field.values].values) }}</td>
            </template>
            <td>{{ $utility.convertToRupiah(rows.total_amount) }}</td>
            <td>{{ $utility.convertToRupiah(rows.total_income) }}</td>
          </tr>
          </tbody>
          <tfoot>
          <tr>
            <th colspan="2" class="bg-primary">Total</th>
            <template v-for="(field, idx) in data.field">
              <td :key="`qty-${idx}`">{{ $utility.convertToRupiah(data.total[field.values].qty) }}</td>
              <td :key="`values-${idx}`">{{ $utility.convertToRupiah(data.total[field.values].values) }}</td>
            </template>
            <td>{{ $utility.convertToRupiah(data.total.total_amount) }}</td>
            <td>{{ $utility.convertToRupiah(data.total.total_income) }}</td>
          </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>
