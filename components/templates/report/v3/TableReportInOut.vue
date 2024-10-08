<script>
import { in_out_types } from "~/constants/v3.report";
import { BatchReport } from '../../../../plugins/batch-report';

const batchReport = new BatchReport()

export default {
  components: {
    ContentTableView: () => import("@utilities/molecules/content-view/ContentTableView"),
    ContentSpan: () => import("@utilities/atoms/utility/ContentSpan"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
  },
  props: {
    is_searching: { default: false },
    month: { default: "" },
    vehicle: { default: () => ([]) }, // selected vehicles at filter
    type: { default: "" },
    column: { default: () => ([]) }, // selected columns at filter
    parking_access: { default: () => ([]) },
    get_report: { type: Function, required: true }
  },
  data: () => ({
    id: "table-report-in-out",
    data: { rows: [], total: {}, last_sync: "" },
    helper: {
      is_init: false
    },
    version: "v4",
    vehicles: [],
    in_out_cols: in_out_types(),
    batchReport
  }),
  watch: {
    is_searching: async function (value) {
      if (value) {
        this.helper.is_init = false
        this.batchReport.setMonth(this.month)
        if (this.type === "shift") this.batchReport.batchSize = 1
        else this.batchReport.batchSize = 3
        await this.batchReport.gatherData()
      }
    },
    'batchReport.loadingBatch': function (value) {
      this.$emit("loadingBatch", value)
    }
  },
  async mounted() {
    this.helper.is_init = true
    this.setVersion()
    this.setBatchReport()
    this.vehicles = await this.$utility.getFormattedVehicle()
  },
  methods: {
    setPayloadGetBatch(dateRange) {
      return {
        filter: [
          { key: "spot_id", value: this.$utility.getSpotId() },
          { key: "date_range", value: dateRange },
          { key: "type", value: this.type ? this.type : "daily" },
        ],
        version: this.version
      }
    },

    setBatchReport() {
      this.batchReport.getReport = this.processGetReport
      this.batchReport.concatRows = this.processConcatData
    },

    setVersion() {
      if (this.$route.query.version) {
        this.version = this.$route.query.version
      }
    },

    passFormatDownloadReport() {
      try {
        let payload = { header: {}, content: [] }
        if (this.data.rows.length > 0) {
          const rows = this.formatContentReport()
          payload = { header: this.formatHeaderReport(), content: rows }
        }
        this.$emit("ready", payload)
      } catch (error) {
        this.$emit("ready", { header: {}, content: [] })
      }
    },

    formatColumnClass(col_idx, io_idx, vhc_idx) {
      const number = vhc_idx + (this.vehicle.length * io_idx) + (this.vehicle.length * this.column.length * col_idx)
      return number % 2 ? 'odd' : 'even'
    },

    formatHeaderReport() {
      try {
        let header = {
          "Tanggal": "date",
          "Hari": "days"
        }
        if (this.type === 'shift') header["Shift"] = "shift"
        if (this.type === 'pos') header["Pintu"] = "gate"
        this.parking_access.forEach(col => {
          this.in_out_cols.forEach(in_out_col => {
            this.vehicles.forEach(vehicle => {
              header[`${col.text} ${in_out_col.text} ${vehicle.text}`] = `${col.value}_${in_out_col.value}_${vehicle.value}`
            })
          })
        })
        this.parking_access.forEach(col => {
          this.in_out_cols.forEach(in_out_col => {
            header[`Total ${col.text} ${in_out_col.text}`] = `total_${col.value}_${in_out_col.value}`
          })
        })
        this.parking_access.forEach(col => {
          header[`Selisih ${col.text}`] = `difference_${col.value}`
        })
        this.in_out_cols.forEach(col => {
          header[`Grand Total ${col.text}`] = `grand_total_${col.value}`
        })
        return header
      } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatHeaderReport in TableReportInOut`)
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
        this.data.rows.forEach((row) => {
          // skip for dummy row
          if (row.dummy) return

          data.push(this.formatRowReport(row.days, row));
        });

        // add total row
        if (this.data?.total?.total) data.push(this.formatRowReport("Total", this.data.total));

        return data
      } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatContentReport in TableReportInOut`)
        this.$utility.fireToast(
          "Gagal memformat data",
          "primary",
          "Kamu tidak bisa melakukan download laporan dikarenakan sistem gagal memformat data, anda dapat memuat kembali halaman ini"
        )
        return []
      }
    },

    formatRowReport(days, row) {
      try {
        let row_data = {
          days,
          date: row.date,
        }

        if (this.type === 'shift') row_data.shift = row.shift
        if (this.type === 'pos') row_data.gate = row.gate

        this.parking_access.forEach(col => {
          this.in_out_cols.forEach(in_out_col => {
            this.vehicles.forEach(vehicle => {
              row_data[`${col.value}_${in_out_col.value}_${vehicle.value}`] =
                row.empty ? 0 : row[col.value][in_out_col.value][vehicle.value]
            })
            row_data[`total_${col.value}_${in_out_col.value}`] =
              row.empty ? 0 : row.total[col.value][in_out_col.value]
          })
          row_data[`difference_${col.value}`] =
            row.empty ? 0 : row.difference[col.value]
        })

        this.in_out_cols.forEach(in_out_col => {
          row_data[`grand_total_${in_out_col.value}`] =
            row.empty ? 0 : row.grand_total[in_out_col.value]
        })

        return row_data
      } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatRowReport in TableReportInOut`)
        this.$utility.fireToast(
          "Gagal memformat data",
          "primary",
          "Kamu tidak bisa melakukan download laporan dikarenakan sistem gagal memformat data, anda dapat memuat kembali halaman ini"
        )
        return {}
      }
    },

    processCalculateTotal(total) {
      this.parking_access.forEach(col => {
        this.in_out_cols.forEach(in_out_col => {
          this.vehicles.forEach(vehicle => {
            this.data.total[col.value][in_out_col.value][vehicle.value] += total[col.value][in_out_col.value][vehicle.value]
          })
          this.data.total.total[col.value][in_out_col.value] += total.total[col.value][in_out_col.value]
        })
        const diff = this.data.total.total[col.value].in - this.data.total.total[col.value].out
        this.data.total.difference[col.value] = Math.abs(diff)
      })

      this.in_out_cols.forEach(in_out_col => {
        this.data.total.grand_total[in_out_col.value] += total.grand_total[in_out_col.value]
      })
    },

    processConcatData(data, dummyIndex) {
      const reload = isFinite(dummyIndex)

      if (this.batchReport.isFirstBatch()) {
        this.data.rows = []
        this.data.total = {}
        this.data.last_sync = ""
      }

      if (!data.error) {
        // set last_sync
        this.data.last_sync = data.last_sync

        // set data.total
        if (this.data.total.total) this.processCalculateTotal(data.total)
        else if (data.total.total) this.data.total = data.total
      }

      // fill data.rows
      if (data.rows && data.rows.length) {
        if (reload) this.data.rows.splice(dummyIndex, 1, ...data.rows)
        else this.data.rows = [...data.rows, ...this.data.rows]
      }

      if (reload || this.batchReport.isLastBatch()) {
        this.passFormatDownloadReport()
      }
    },

    async processGetReport(dateRange) {
      let payload = this.setPayloadGetBatch(dateRange)
      return await this.get_report(payload)
    },
  }
}
</script>

<template>
  <div>
    <content-table-view :length="data.rows.length" :is_loading="batchReport.isLoadingInit()" :is_init="helper.is_init"
      :loading-caption="(batchReport.isWarningBusy()) ? 'Mohon menunggu, sepertinya server kami sedang sibuk' : 'Loading ...'"
      :test_id="`report-in-out__wrapper`" :ref="`report-in-out__wrapper`">
      <div class="table-responsive rounded-top mb-0">
        <table class="d-block table table-striped table-sticky-header report-table" data-testid="table-report-in-out">
          <thead class="thead-primary">
            <tr>
              <th v-if="type !== 'shift'" rowspan="3" class="cell-sticky" data-testid="head-field__date"
                style="top: 1px; min-height: 44.5px; left: 0px; min-width: 67px; z-index: 30;">Tanggal
              </th>
              <th v-if="type !== 'shift'" rowspan="3" class="cell-sticky" data-testid="head-field__day"
                style="top: 1px; min-height: 44.5px; left: 67px; min-width: 67px; z-index: 30;">Hari
              </th>
              <th v-if="type === 'pos'" rowspan="3" class="cell-sticky" data-testid="head-field__gate"
                style="top: 1px; min-height: 44.5px; left: 134px; min-width: 67px; z-index: 30;">Pintu
              </th>
              <th v-if="type === 'shift'" rowspan="3" class="cell-sticky" data-testid="head-field__shift"
                style="top: 1px; min-height: 44.5px; left: 0px; min-width: 201px; z-index: 30;">Shift
              </th>

              <!-- loop: casual, member -->
              <template v-for="col in column">
                <!-- adjust colspan with in_out_cols and vehicle length -->
                <th v-if="vehicle.length && in_out_cols.length" class="cell-sticky"
                  style="top: 1px; min-height: 44.5px;" :key="`h1-${col.value}`"
                  :colspan="in_out_cols.length * vehicle.length" :data-testid="`head-field__col-${col.value}`">
                  {{ col.text }}
                </th>
              </template>

              <!-- loop: casual, member -->

              <template v-for="col in column">
                <th v-if="in_out_cols.length" class="cell-sticky" style="top: 1px; min-height: 44.5px;"
                  :key="`h1-total-${col.value}`" :colspan="in_out_cols.length"
                  :data-testid="`head-field__total-${col.value}`">>
                  Total {{ col.text }}
                </th>
              </template>

              <!-- adjust colspan with column length -->
              <th v-if="column.length" class="cell-sticky" style="top: 1px; min-height: 44.5px;"
                :colspan="column.length" data-testid="head-field__difference">
                Selisih
              </th>

              <!-- adjust colspan with in_out_cols length -->
              <th v-if="in_out_cols.length" class="cell-sticky" style="top: 1px; min-height: 44.5px;"
                :colspan="in_out_cols.length" data-testid="head-field__grand-total">
                Grand Total
              </th>
            </tr>
            <tr>
              <!-- loop: casual, member -->

              <template v-for="col in column">
                <!-- loop: in, out -->
                <th v-for="in_out_col in in_out_cols" v-show="vehicle.length" :colspan="vehicle.length"
                  class="cell-sticky" style="top: 45.5px; min-height: 44.5px;"
                  :key="`h2-${col.value}-${in_out_col.value}`"
                  :data-testid="`head-field__${col.value}-${in_out_col.value}`">
                  {{ in_out_col.text }}
                </th>
              </template>

              <!-- loop: casual, member -->

              <template v-for="col in column">
                <!-- loop: in, out -->
                <th v-for="in_out_col in in_out_cols" rowspan="2" class="cell-sticky" style="top: 45.5px;"
                  :key="`h2-total-${col.value}-${in_out_col.value}`"
                  :data-testid="`head-field__total-${col.value}-${in_out_col.value}`">
                  {{ in_out_col.text }}
                </th>
              </template>

              <!-- loop: casual, member -->
              <th v-for="col in column" rowspan="2" class="cell-sticky" style="top: 45.5px;"
                :key="`h2-difference-${col.value}`" :data-testid="`head-field__difference-${col.value}`">
                {{ col.text }}
              </th>

              <!-- loop: in, out -->
              <th v-for="in_out_col in in_out_cols" rowspan="2" class="cell-sticky" style="top: 45.5px;"
                :key="`h2-grand-total-${in_out_col.value}`"
                :data-testid="`head-field__grand-total-${in_out_col.value}`">
                {{ in_out_col.text }}
              </th>
            </tr>
            <tr>
              <!-- loop: casual, member -->

              <template v-for="(col_val, col_idx) in column">
                <!-- loop: in, out -->
                <template v-for="(io_val, io_idx) in in_out_cols">
                  <!-- loop vehicle -->
                  <th v-for="(vhc, vhc_idx) in vehicle" :key="`vehicle-${col_idx}-${io_idx}-${vhc_idx}`"
                    :class="formatColumnClass(col_idx, io_idx, vhc_idx)" class="cell-sticky"
                    :data-testid="`head-cell__${col_val.value}-${io_val.value}-${vhc.value}`" style="top: 90px;">
                    {{ vhc.text }}
                  </th>
                </template>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr v-if="batchReport.isLoadingBatch() && !batchReport.isReloadingBatch()" data-testid="row-loading">
              <td class="text-left font-weight-bold" colspan="1000">
                <b-spinner small class="text-primary mr-2"></b-spinner>
                Memuat data tanggal {{ batchReport.getWorkingBatch() }}
              </td>
            </tr>
            <tr v-for="(row, index) in data.rows" :key="`row-${index}`">
              <td v-if="type !== 'shift'" class="cell-sticky" :data-testid="`cell-field__date`"
                style="left: 0px; min-width: 67px; z-index: 20">
                {{ row.date }}
              </td>
              <td v-if="type !== 'shift'" class="cell-sticky" :data-testid="`cell-field__day`"
                style="left: 67px; min-width: 67px; z-index: 20">
                {{ row.days }}
              </td>
              <td v-if="type === 'pos'" class="cell-sticky" :data-testid="`cell-field__pos`"
                style="left: 134px; min-width: 67px; z-index: 20">
                {{ row.empty ? row.date : row.gate }}
              </td>
              <td v-if="type === 'shift'" class="cell-sticky" :data-testid="`cell-field__shift`"
                style="left: 0px; min-width: 201px; z-index: 20">
                {{ row.empty ? row.date : row.shift }}
              </td>

              <!-- Placeholder Failed Data -->

              <template v-if="row.dummy">
                <td v-if="batchReport.isLoadingBatch() && batchReport.isWorkingBatch(row.start)"
                  class="text-left font-weight-bold" colspan="1000" :data-testid="`row-${index}__reload`">
                  <b-spinner small class="text-primary mr-2"></b-spinner>
                  Memuat data
                </td>
                <td v-else class="text-left font-weight-bold" colspan="1000" :data-testid="`row-${index}__failed`">
                  Data gagal dimuat
                  <active-button variant="primary" text="Muat Ulang" size="sm" text_color="text-light"
                    @click="batchReport.getBatchData(row.start, row.end, index)" :id="`btn-reload_${index}`"
                    :is_disabled="batchReport.isLoadingBatch()" />
                </td>
              </template>

              <!-- Success Data -->

              <template v-else>
                <template v-for="col in column">
                  <template v-for="io in in_out_cols">
                    <td v-for="vhc in vehicle" :key="`data-${index}-${col.value}-${io.value}-${vhc.value}`"
                      :data-testid="`cell-field__${index}-${col.value}-${io.value}-${vhc.value}`">
                      {{ row.empty ? 0 : $utility.convertToRupiah(row[col.value][io.value][vhc.value]) }}
                    </td>
                  </template>
                </template>

                <template v-for="col in column">
                  <td v-for="io in in_out_cols" :key="`data-total-${index}-${col.value}-${io.value}`"
                    :data-testid="`cell-field__total-${index}-${col.value}-${io.value}`">
                    {{ row.empty ? 0 : $utility.convertToRupiah(row.total[col.value][io.value]) }}
                  </td>
                </template>
                <td v-for="col in column" :key="`data-difference-${index}-${col.value}`"
                  :data-testid="`cell-field__difference-${index}-${col.value}`">
                  {{ row.empty ? 0 : $utility.convertToRupiah(row.difference[col.value]) }}
                </td>
                <td v-for="io in in_out_cols" :key="`data-${index}-${io.value}`"
                  :data-testid="`cell-field__grand-total-${index}-${io.value}`">
                  {{ row.empty ? 0 : $utility.convertToRupiah(row.grand_total[io.value]) }}
                </td>
              </template>
            </tr>
          </tbody>
          <tfoot v-if="data.total.total">
            <tr class="border-0" data-testid="row-total">
              <th :colspan="type === 'pos' ? 3 : type === 'shift' ? 1 : 2" class="bg-primary cell-sticky"
                style="left: 0px;">
                Total
              </th>

              <template v-for="col in column">
                <template v-for="io in in_out_cols">
                  <td v-for="vhc in vehicle" :key="`total-total-${col.value}-${io.value}-${vhc.value}`"
                    :data-testid="`total-field__total-${col.value}-${io.value}-${vhc.value}`">
                    {{ $utility.convertToRupiah(data.total[col.value][io.value][vhc.value]) }}
                  </td>
                </template>
              </template>

              <template v-for="col in column">
                <td v-for="io in in_out_cols" :key="`total-total-${col.value}-${io.value}`"
                  :data-testid="`total-field__total-${col.value}-${io.value}`">
                  {{ $utility.convertToRupiah(data.total.total[col.value][io.value]) }}
                </td>
              </template>
              <td v-for="col in column" :key="`total-difference-${col.value}`"
                :data-testid="`total-field__difference-${col.value}`">
                {{ $utility.convertToRupiah(data.total.difference[col.value]) }}
              </td>
              <td v-for="io in in_out_cols" :key="`total-${io.value}`" :data-testid="`total-field__grand-${io.value}`">
                {{ $utility.convertToRupiah(data.total.grand_total[io.value]) }}
              </td>
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
