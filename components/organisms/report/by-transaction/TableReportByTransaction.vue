<script>
import { BatchReport } from '@/plugins/batch-report';

const batchReport = new BatchReport()

export default {
  components: {
    ContentTableView: () => import("@utilities/molecules/content-view/ContentTableView"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
  },
  props: {
    is_searching: { default: false },
    month: { default: "" },
    vehicle: { default: () => [] }, // selected vehicles at filter
    column: { default: () => [] },
    type: { default: "" },
    timezone: { default: "" },
    transaction_types: { default: () => [] },
    get_report: { type: Function, required: true },
  },
  data: () => ({
    data: { rows: [], total: {}, last_sync: "" },
    batchReport,
    helper: {
      is_init: false,
    },
    vehicles: [],
  }),
  watch: {
    is_searching: async function (value) {
      if (value) {
        this.helper.is_init = false;
        this.batchReport.setMonth(this.month)
        this.batchReport.batchSize = 1

        await this.batchReport.gatherData()
      }
    },
    'batchReport.loadingBatch': function (value) {
      this.$emit("loadingBatch", value)
    }
  },
  async mounted() {
    this.helper.is_init = true;
    this.setBatchReport()
    this.vehicles = await this.$utility.getFormattedVehicle();
  },
  methods: {
    setPayloadGet(range) {
      const payload = {
        filter: [
          { key: "spot_id", value: this.$utility.getSpotId() },
          { key: "date_range", value: range },
          { key: "month", value: this.month },
          { key: "type", value: this.type ? this.type : "daily" },
        ],
      };

      if (this.timezone) {
        payload.filter.push({ key: "timezone", value: this.timezone });
      }

      return payload;
    },

    setBatchReport() {
      this.batchReport.getReport = this.processGetReport
      this.batchReport.concatRows = this.processConcatData
    },

    passFormatDownloadReport() {
      let payload = { header: {}, content: [] };
      if (this.data.rows.length > 0) {
        payload.content = this.formatContentReport();
        payload.header = this.formatHeaderReport()
      }
      this.$emit("ready", payload);
    },

    formatColumnClass(col_idx, vhc_idx) {
      const number = vhc_idx + this.vehicle.length * col_idx;
      return number % 2 ? "odd" : "even";
    },

    formatHeaderReport() {
      try {
        let header = {
          Tanggal: "date",
          Hari: "days",
        };
        if (this.type === "shift") header["Shift"] = "shift";
        if (this.type === "pos") header["Pintu"] = "gate";
        this.transaction_types.forEach((col) => {
          this.vehicles.forEach((vehicle) => {
            header[
              `${col.text} ${vehicle.text}`
            ] = `${col.value}_${vehicle.value}`;
          });
        });
        this.transaction_types.forEach((col) => {
          header[`Total ${col.text}`] = `total_${col.value}`;
        });
        header["Grand Total"] = "grand_total";
        return header;
      } catch (error) {
        this.$utility.setErrorContextSentry(error);
        this.$sentry.captureMessage(
          `${error.message} at formatHeaderReport in TableReportByTransaction`
        );
        this.$utility.fireToast(
          "Gagal memformat data",
          "primary",
          "Kamu tidak bisa melakukan download laporan dikarenakan sistem gagal memformat data, anda dapat memuat kembali halaman ini"
        );
        return {}
      }
    },

    formatContentReport() {
      try {
        let data = [];
        this.data.rows.forEach((row) => {
          // skip for dummy row
          if (row.dummy) return

          data.push(this.formatRowReport(row.days, row));
        });

        if (this.data?.total?.total) data.push(this.formatRowReport("Total", this.data.total));

        return data;
      } catch (error) {
        this.$utility.setErrorContextSentry(error);
        this.$sentry.captureMessage(
          `${error.message} at formatContentReport in TableReportByTransaction`
        );
        this.$utility.fireToast(
          "Gagal memformat data",
          "primary",
          "Kamu tidak bisa melakukan download laporan dikarenakan sistem gagal memformat data, anda dapat memuat kembali halaman ini"
        );

        return []
      }
    },

    formatRowReport(days, row) {
      try {
        // skip for dummy row
        if (row.dummy) return

        let row_data = {
          days,
          date: row.date,
          grand_total: row.grand_total,
        };

        if (this.type === "shift") row_data.shift = row.shift;
        if (this.type === "pos") row_data.gate = row.gate;

        this.transaction_types.forEach((col) => {
          this.vehicles.forEach((vehicle) => {
            row_data[`${col.value}_${vehicle.value}`] =
              row.empty ? 0 : row[col.value][vehicle.value];
          });
        });

        this.transaction_types.forEach((col) => {
          row_data[`total_${col.value}`] = row.empty ? 0 : row.total[col.value];
        });

        return row_data
      } catch (error) {
        this.$utility.setErrorContextSentry(error);
        this.$sentry.captureMessage(
          `${error.message} at formatRowReport in TableReportByTransaction`
        );
        this.$utility.fireToast(
          "Gagal memformat data",
          "primary",
          "Kamu tidak bisa melakukan download laporan dikarenakan sistem gagal memformat data, anda dapat memuat kembali halaman ini"
        );

        return {}
      }
    },

    processCalculateTotal(total) {
      this.transaction_types.forEach(col => {
        this.vehicles.forEach(vehicle => {
          this.data.total[col.value][vehicle.value] += total[col.value][vehicle.value]
        })
        this.data.total.total[col.value] += total.total[col.value]
      })

      this.data.total.grand_total += total.grand_total
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
        if (data?.total?.total) {
          if (this.data.total.total) this.processCalculateTotal(data.total)
          else this.data.total = data.total
        }
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
      let payload = this.setPayloadGet(dateRange)
      return await this.get_report(payload)
    }
  },
};
</script>

<template>
  <div>
    <content-table-view :length="data.rows.length" :is_loading="batchReport.isLoadingInit()" :is_init="helper.is_init"
      :loading-caption="(batchReport.isWarningBusy()) ? 'Mohon menunggu, sepertinya server kami sedang sibuk' : 'Loading ...'"
      :test_id="`report-by-trx__wrapper`" :ref="`report-by-trx__wrapper`">
      <table class="d-block table table-striped table-sticky-header report-table"
        data-testid="table-report-by-transaction">
        <thead class="thead-primary">
          <tr>
            <th v-if="type !== 'shift'" rowspan="3" class="cell-sticky" data-testid="head-cell__date"
              style="top: 1px; min-height: 44.5px; left: 0px; min-width: 67px; z-index: 3;">
              Tanggal
            </th>
            <th v-if="type !== 'shift'" rowspan="3" class="cell-sticky" data-testid="head-cell__day"
              style="top: 1px; min-height: 44.5px; left: 67px; min-width: 67px; z-index: 3;">
              Hari
            </th>
            <th v-if="type === 'pos'" rowspan="3" class="cell-sticky" data-testid="head-cell__gate"
              style="top: 1px; min-height: 44.5px; left: 134px; min-width: 67px; z-index: 3;">
              Pintu
            </th>
            <th v-if="type === 'shift'" rowspan="3" class="cell-sticky" data-testid="head-cell__shift"
              style="top: 1px; min-height: 44.5px; left: 0px; min-width: 201px; z-index: 3;">
              Shift
            </th>
            <th :colspan="column.length * vehicle.length" v-show="vehicle.length && column.length" class="cell-sticky"
              style="top: 1px; min-height: 44.5px" :data-testid="`head-cell__payment-method`">
              Jenis Transaksi
            </th>
            <th rowspan="1" :colspan="column.length" v-show="column.length" class="cell-sticky"
              style="top: 1px; min-height: 89px" :data-testid="`head-cell__total`">
              Total
            </th>
            <th rowspan="3" class="cell-sticky" style="top: 1px; min-height: 44.5px; width: 5%"
              :data-testid="`head-cell__grand-total`">
              Grand Total
            </th>
          </tr>
          <tr>
            <th v-for="col in column" v-show="vehicle.length" :colspan="vehicle.length" class="cell-sticky"
              style="top: 45.5px; min-height: 44.5px" :key="`head-${col.value}`"
              :data-testid="`head-cell__vehicle-type-${col.value}`">
              {{ col.text }}
            </th>
            <th v-for="col in column" class="cell-sticky" rowspan="2" style="top: 45.5px"
              :key="`head-total-${col.value}`" :data-testid="`head-cell__total-${col.value}`">
              {{ col.text }}
            </th>
          </tr>
          <tr>
            <template v-for="(col, col_idx) in column">
              <th v-for="(vhc, vhc_idx) in vehicle" :key="`vehicle-${col.value}-${vhc.value}`"
                :data-testid="`head-cell__${col.value}-${vhc.value}`" :class="formatColumnClass(col_idx, vhc_idx)"
                class="cell-sticky" style="top: 90px">
                {{ vhc.text }}
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <!-- Loading View -->
          <tr v-if="batchReport.isLoadingBatch() && !batchReport.isReloadingBatch()" data-testid="row-loading">
            <td class="text-left font-weight-bold" colspan="1000">
              <b-spinner small class="text-primary mr-2"></b-spinner>
              Memuat data tanggal {{ batchReport.getWorkingBatch() }}
            </td>
          </tr>

          <tr v-for="(row, index) in data.rows" :key="`row-${index}`">
            <td v-if="type !== 'shift'" class="cell-sticky" style="left: 0px; min-width: 67px; z-index: 2"
              data-testid="shift">
              {{ row.date }}
            </td>
            <td v-if="type !== 'shift'" class="cell-sticky" style="left: 67px; min-width: 67px; z-index: 2"
              data-testid="cell-field__days">
              {{ row.days }}
            </td>
            <td v-if="type === 'pos'" class="cell-sticky" style="left: 134px; min-width: 67px; z-index: 2"
              data-testid="cell-field__pos">
              {{ row.empty ? row.date : row.gate }}
            </td>
            <td v-if="type === 'shift'" class="cell-sticky" style="left: 0px; min-width: 201px; z-index: 2"
              data-testid="cell-field__shift">
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
                <td v-for="vhc in vehicle" :key="`data-${index}-${col.value}-${vhc.value}`"
                  :data-testid="`cell-field__${index}-${col.value}-${vhc.value}`">
                  {{ row.empty ? 0 : $utility.convertToRupiah(row[col.value][vhc.value]) }}
                </td>
              </template>
              <td v-for="col in column" :key="`total-${index}-${col.value}`"
                :data-testid="`cell-field__${index}-total-${col.value}`">
                {{ row.empty ? 0 : $utility.convertToRupiah(row.total[col.value]) }}
              </td>
              <td data-testid="cell-field__grand-total">
                {{ row.empty ? 0 : $utility.convertToRupiah(row.grand_total) }}
              </td>
            </template>
          </tr>
        </tbody>
        <tfoot v-if="data.total.total">
          <tr data-testid="row-total">
            <th :colspan="type === 'pos' ? 3 : type === 'shift' ? 1 : 2" class="bg-primary cell-sticky"
              style="left: 0px">
              Total
            </th>

            <template v-for="col in column">
              <td v-for="vhc in vehicle" :key="`total-${col.value}-${vhc.value}`"
                :data-testid="`total-field__${col.value}-${vhc.value}`">
                {{ $utility.convertToRupiah(data.total[col.value][vhc.value]) }}
              </td>
            </template>
            <td v-for="col in column" :key="`total-${col.value}`">
              {{ $utility.convertToRupiah(data.total.total[col.value]) }}
            </td>
            <td>{{ $utility.convertToRupiah(data.total.grand_total) }}</td>
          </tr>
        </tfoot>
      </table>
    </content-table-view>

    <b-toast no-auto-hide :visible="!!data.last_sync" id="toast_last_sync" toaster="b-toaster-bottom-right"
      header-class="d-none" variant="dark">

      <template slot="default">
        <div class="d-flex flex-row">
          <div class="text-dark">
            <span class="rounded-circle bg-primary font-weight-bold" style="padding: 0.2em 0.7em">
              !
            </span>
          </div>
          <div class="align-self-lg-center align-middle text-white flex-grow-1 ml-1 font-size-12">
            Terakhir diperbarui
            {{ $utility.formatLocalTimezone(data.last_sync, "DD/MM/YYYY HH:mm:ss") }}
          </div>
          <div class="align-self-lg-center align-middle text-white float-right">
            <i class="bx bx-x cursor-pointer" @click="$bvToast.hide('toast_last_sync')"></i>
          </div>
        </div>
      </template>
    </b-toast>
  </div>
</template>
