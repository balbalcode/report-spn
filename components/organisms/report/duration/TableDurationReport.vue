<script>
import { reportMethods } from "~/store/helperActions";
import { BatchReport } from "../../../../plugins/batch-report"

const batchReport = new BatchReport()

export default {
  components: {
    ContentTableView: () => import("@utilities/molecules/content-view/ContentTableView"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
  },
  props: {
    is_searching: { default: false },
    date_range: { default: () => ([]) },
    vehicle: { default: () => ([]) }, // selected vehicles at filter
    product: { default: () => ([]) }
  },
  data: () => ({
    data: { rows: [], total: {}, average: {}, last_sync: "" },
    helper: {
      is_init: false,
      n_real_data: 0,
    },
    column: ["0-1", "1-2", "2-3", "3-6", "6-12", ">12"],
    vehicles: [],
    batchReport
  }),
  watch: {
    is_searching: async function (value) {
      this.helper.is_init = false
      if (value) {
        if (this.date_range.length === 2) {
          this.batchReport.setDateRange(this.date_range)
          await this.batchReport.gatherData()
        } else this.passFormatDownloadReport()
      }
    },
    'batchReport.loadingBatch': function (value) {
      this.$emit("loadingBatch", value)
    }
  },
  async mounted() {
    this.helper.is_init = true
    this.setBatchReport()
    this.vehicles = await this.$utility.getFormattedVehicle()
  },
  methods: {
    getQuantityDurationReport: reportMethods.getQuantityDurationReport,

    setPayloadGetBatch(dateRange) {
      const payload = {
        filter: [
          { key: "spot_id", value: this.$utility.getSpotId() },
          { key: "date_range", value: dateRange },
        ],
      }
      if (this.product && this.product.value) {
        payload.filter.push({ key: "product", value: this.product.value })
      }
      return payload
    },

    setBatchReport() {
      this.batchReport.batchSize = 3
      this.batchReport.getReport = this.processGetReport
      this.batchReport.concatRows = this.processConcatData
    },

    passFormatDownloadReport() {
      try {
        let payload = { header: {}, content: [] }
        if (this.data.rows.length > 0) {
          payload.content = this.formatContentReport()
          payload.header = this.formatHeaderReport()
        }
        this.$emit("ready", payload)
      } catch (error) {
        this.$emit("ready", { header: {}, content: [] })
      }
    },

    formatColumnClass(col_idx, vhc_idx) {
      const number = vhc_idx + (this.vehicle.length * col_idx)
      return number % 2 ? 'odd' : 'even'
    },

    formatHeaderReport() {
      try {
        let header = { "Tanggal": "date" }
        this.column.forEach(col => {
          this.vehicles.forEach(vehicle => {
            header[`${col} Jam ${vehicle.text}`] = `${col}_${vehicle.value}`
          })
        })
        this.column.forEach(col => {
          header[`Total ${col} Jam`] = `total_${col}`
        })
        header['Grand Total'] = 'grand_total'
        return header
      } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatHeaderReport in TableDurationReport`)
        this.$utility.fireToast(
          "Gagal memformat data",
          "primary",
          "Kamu tidak bisa melakukan download laporan dikarenakan sistem gagal memformat data, anda dapat memuat kembali halaman ini"
        )
        return {}
      }
    },

    formatContentReport() {
      try {
        let data = []
        this.data.rows.forEach(row => {
          if (!row.dummy) {
            data.push(this.formatRowReport(row.date, row))
          }
        })
        if (this.data?.total?.total) data.push(this.formatRowReport("Total", this.data.total))
        if (this.data?.average?.total) data.push(this.formatRowReport("Rata-rata", this.data.average))
        return data
      } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatContentReport in TableDurationReport`)
        this.$utility.fireToast(
          "Gagal memformat data",
          "primary",
          "Kamu tidak bisa melakukan download laporan dikarenakan sistem gagal memformat data, anda dapat memuat kembali halaman ini"
        )
        return []
      }
    },

    formatRowReport(date, data) {
      try {
        let row_data = { date }

        if (data) {
          this.column.forEach(col => {
            this.vehicles.forEach(vehicle => {
              row_data[`${col}_${vehicle.value}`] = data.empty ? 0 : data[col][vehicle.value]
            })
            row_data[`total_${col}`] = data.empty ? 0 : data.total[col]
          })
          row_data.grand_total = data.empty ? 0 : data.grand_total
        }

        return row_data
      } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatRowReport in TableDurationReport`)
        this.$utility.fireToast(
          "Gagal memformat data",
          "primary",
          "Kamu tidak bisa melakukan download laporan dikarenakan sistem gagal memformat data, anda dapat memuat kembali halaman ini"
        )
        return {}
      }
    },

    processCalculateAverage() {
      try {
        if (this.data.total && Object.keys(this.data.total).length > 0) {
          this.data.average = { total: {} }
          this.column.forEach(col => {
            this.data.average[col] = {}
            this.vehicles.forEach(vehicle => {
              this.data.average[col][vehicle.value] =
                parseInt(this.data.total[col][vehicle.value] / this.helper.n_real_data)
            })
            this.data.average.total[col] = parseInt(this.data.total.total[col] / this.helper.n_real_data)
          })
          this.data.average.grand_total = parseInt(this.data.total.grand_total / this.helper.n_real_data)
        }
      } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at processCalculateAverage in TableDurationReport`)
      }
    },

    processCalculateTotal(total) {
      try {
        this.column.forEach(col => {
          this.vehicles.forEach(vehicle => {
            this.data.total[col][vehicle.value] += total[col][vehicle.value]
          })
          this.data.total.total[col] += total.total[col]
        })
        this.data.total.grand_total += total.grand_total
      } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at processCalculateTotal in TableDurationReport`)
      }
    },

    processConcatData(data, dummyIndex) {
      const reload = isFinite(dummyIndex)

      if (this.batchReport.isFirstBatch()) {
        this.data.rows = []
        this.data.total = {}
        this.data.average = {}
        this.data.last_sync = ""
      }

      if (!data.error) {
        // set last_sync
        this.data.last_sync = data.last_sync

        // set data.total
        if (data?.total?.total) {
          if (this.data.total.total) this.processCalculateTotal(data.total)
          else if (data.total && data.total.total) this.data.total = data.total
        }
        if (data.rows.length) this.helper.n_real_data += data.rows.length
      }

      // fill data.rows
      if (data.rows && data.rows.length) {
        if (reload) this.data.rows.splice(dummyIndex, 1, ...data.rows)
        else this.data.rows = [...data.rows, ...this.data.rows]
      }

      if (reload || this.batchReport.isLastBatch()) {
        this.processCalculateAverage()
        this.passFormatDownloadReport()
      }
    },

    async processGetReport(dateRange) {
      let payload = this.setPayloadGetBatch(dateRange)
      return await this.getQuantityDurationReport(payload)
    },
  }
}
</script>

<template>
  <div>
    <content-table-view :length="data.rows.length" :is_loading="batchReport.isLoadingInit()" :is_init="helper.is_init"
      :loading-caption="(batchReport.isWarningBusy()) ? 'Mohon menunggu, sepertinya server kami sedang sibuk' : 'Loading ...'"
      :test_id="`report-duration__wrapper`" :ref="`report-duration__wrapper`">
      <div class="table-responsive rounded-top mb-0">
        <table class="d-block table table-striped table-sticky-header report-table" id="table-duration-report">
          <thead class="thead-primary">
            <tr>
              <th rowspan="2" class="cell-sticky"
                style="top: 1px; min-height: 44.5px; left: 0px; min-width: 67px; z-index: 30;">Tanggal
              </th>
              <template v-for="col in column">
                <th v-if="vehicle.length" class="cell-sticky" style="top: 1px; min-height: 44.5px;" :key="`h1-${col}`"
                  :colspan="vehicle.length">
                  {{ col }} Jam
                </th>
              </template>
            </tr>
            <tr>

              <template v-for="(_, col_idx) in column">
                <th v-for="(vhc, vhc_idx) in vehicle" :key="`vehicle-${col_idx}-${vhc_idx}`"
                  :class="formatColumnClass(col_idx, vhc_idx)" class="cell-sticky" style="top: 45.5px;">
                  {{ vhc.text }}
                </th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr v-if="batchReport.isLoadingBatch() && !batchReport.isReloadingBatch()"
              id="table-duration-report__row-loading">
              <td class="text-left font-weight-bold" colspan="1000">
                <b-spinner small class="text-primary mr-2"></b-spinner>
                Memuat data tanggal {{ batchReport.getWorkingBatch() }}
              </td>
            </tr>
            <tr v-for="(row, index) in data.rows" :key="`table-duration-report__row-${index}`">
              <td class="cell-sticky" style="left: 0px; min-width: 67px; z-index: 20;">{{ row.date }}</td>

              <!-- Placeholder Failed Data -->

              <template v-if="row.dummy">
                <td v-if="batchReport.isLoadingBatch() && batchReport.isWorkingBatch(row.start)"
                  class="text-left font-weight-bold" :id="`table-duration-report__row-${index}__reload`" colspan="1000">
                  <b-spinner small class="text-primary mr-2"></b-spinner>
                  Memuat data
                </td>
                <td v-else class="text-left font-weight-bold" :id="`table-duration-report__row-${index}__failed`"
                  colspan="1000">
                  Data gagal dimuat
                  <active-button variant="primary" text="Muat Ulang" size="sm" text_color="text-light"
                    @click="batchReport.getBatchData(row.start, row.end, index)" :id="`btn-reload_${index}`"
                    :is_disabled="batchReport.isLoadingBatch()" />
                </td>
              </template>

              <!-- Success Data -->

              <template v-else>
                <template v-for="col in column">
                  <td v-for="vhc in vehicle" :key="`data-${index}-${col}-${vhc.value}`">
                    {{ row.empty ? 0 : $utility.convertToRupiah(row[col][vhc.value]) }}
                  </td>
                </template>
              </template>
            </tr>
          </tbody>
          <tfoot>
            <tr class="border-0" v-if="data.total.total" id="table-duration-report__row-total">
              <th class="bg-primary cell-sticky" style="left: 0px;">Total</th>

              <template v-for="col in column">
                <td v-for="vhc in vehicle" :key="`total-total-${col}-${vhc.value}`">
                  {{ $utility.convertToRupiah(data.total[col][vhc.value]) }}
                </td>
              </template>
            </tr>
            <tr class="border-0" v-if="data.average.total" id="table-duration-report__row-average">
              <th class="bg-primary cell-sticky" style="left: 0px;">Rata-rata</th>

              <template v-for="col in column">
                <td v-for="vhc in vehicle" :key="`average-total-${col}-${vhc.value}`">
                  {{ $utility.convertToRupiah(data.average[col][vhc.value]) }}
                </td>
              </template>
            </tr>
          </tfoot>
        </table>
      </div>
    </content-table-view>

    <b-toast no-auto-hide :visible="!!data.last_sync" id="toast_last_sync" toaster="b-toaster-bottom-right"
      header-class="d-none" variant="dark">

      <template slot="default">
        <div class="d-flex flex-row">
          <div class="text-dark">
            <span class="rounded-circle bg-primary font-weight-bold" style="padding: .2em .7em">
              !
            </span>
          </div>
          <div class="align-self-lg-center align-middle text-white flex-grow-1 ml-1 font-size-12">
            Terakhir diperbarui {{ $utility.formatLocalTimezone(data.last_sync, 'DD/MM/YYYY HH:mm:ss') }}
          </div>
          <div class="align-self-lg-center align-middle text-white float-right">
            <i class="bx bx-x cursor-pointer" @click="$bvToast.hide('toast_last_sync')"></i>
          </div>
        </div>
      </template>
    </b-toast>
  </div>
</template>
