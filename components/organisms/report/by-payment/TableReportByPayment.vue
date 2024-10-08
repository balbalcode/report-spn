<script>
import {
  app_cashless,
  static_qris,
  emoney,
  payment_outlines,
  payment_types,
} from "@/constants/v3.report";
import { BatchReport } from '@/plugins/batch-report';

const batchReport = new BatchReport()

export default {
  components: {
    ContentTableView: () => import("@utilities/molecules/content-view/ContentTableView"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
  },
  props: {
    is_searching: { type: Boolean },
    month: { default: "" },
    vehicle: { default: () => [], type: Array }, // selected vehicles at filter
    column: { default: () => [], type: Array },
    type: { default: "" },
    timezone: { default: "" },
    get_report: { type: Function, required: true },
  },
  data: () => ({
    data: { rows: [], total: {}, last_sync: "" },
    batchReport,
    helper: {
      is_init: false,
    },
    vehicles: [],
    app_cashless: app_cashless(),
    emoney: emoney(),
    static_qris: static_qris(),
    payment_outlines: payment_outlines(),
    payment_types: payment_types(),
  }),
  watch: {
    is_searching: async function (value) {
      if (value) {
        this.helper.is_init = false;
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
  computed: {
    has_nested_payment() {
      const not_nested = ["qris_dispenser", "cash"];
      return this.column.some((col) => !not_nested.includes(col.value));
    },
    column_list() {
      return this.column.map((item) => item.value);
    },
    selected_length() {
      let selected = {
        app_cashless: 0,
        emoney: 0,
        static_qris: 0,
      };
      const cashless_groups = ["app_cashless", "emoney", "static_qris"];
      cashless_groups.forEach((group) => {
        this[group].forEach((item) => {
          if (this.column_list.includes(item.value)) selected[group]++;
        });
      });
      return selected;
    },
  },
  async mounted() {
    this.helper.is_init = true;
    this.setBatchReport()
    this.vehicles = await this.$utility.getFormattedVehicle();
  },
  methods: {
    setPayloadGet(range) {
      let payload = {
        filter: [
          { key: "spot_id", value: this.$utility.getSpotId() },
          { key: "date_range", value: range },
          { key: "month", value: this.month },
          { key: "type", value: this.type ? this.type : "daily" },
        ],
      };

      if (this.timezone) payload.filter.push({ key: "timezone", value: this.timezone });

      return payload;
    },

    setBatchReport() {
      this.batchReport.getReport = this.processGetReport
      this.batchReport.concatRows = this.processConcatData
    },

    passFormatDownloadReport() {
      let payload = { header: {}, content: [] };
      if (this.data.rows.length > 0) {
        payload.header = this.formatHeaderReport();
        payload.content = this.formatContentReport();
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
        this.payment_types.forEach((col) => {
          this.vehicles.forEach((vehicle) => {
            header[
              `${col.text} ${vehicle.text}`
            ] = `${col.value}_${vehicle.value}`;
          });
        });
        this.payment_outlines.forEach((col) => {
          header[`Total ${col.text}`] = `total_${col.value}`;
        });
        header["Grand Total"] = "grand_total";
        return header;
      } catch (error) {
        this.$utility.setErrorContextSentry(error);
        this.$sentry.captureMessage(
          `${error.message} at formatHeaderReport in TableReportByPayment`
        );
        this.$utility.fireToast(
          "Gagal memformat data",
          "primary",
          "Kamu tidak bisa melakukan download laporan dikarenakan sistem gagal memformat data, anda dapat memuat kembali halaman ini"
        );
        return {};
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
        if (this.data.total?.total) data.push(this.formatRowReport("Total", this.data.total));
        return data;
      } catch (error) {
        this.$utility.setErrorContextSentry(error);
        this.$sentry.captureMessage(
          `${error.message} at formatContentReport in TableReportByPayment`
        );
        this.$utility.fireToast(
          "Gagal memformat data",
          "primary",
          "Kamu tidak bisa melakukan download laporan dikarenakan sistem gagal memformat data, anda dapat memuat kembali halaman ini"
        );
        return [];
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

        this.payment_types.forEach((col) => {
          this.vehicles.forEach((vehicle) => {
            row_data[`${col.value}_${vehicle.value}`] =
              row.empty ? 0 : row[col.value][vehicle.value];
          });
        });
        this.payment_outlines.forEach((col) => {
          row_data[`total_${col.value}`] = row.empty ? 0 : row.total[col.value];
        });
        return row_data;
      } catch (error) {
        this.$utility.setErrorContextSentry(error);
        this.$sentry.captureMessage(
          `${error.message} at formatRowReport in TableReportByPayment`
        );
        this.$utility.fireToast(
          "Gagal memformat data",
          "primary",
          "Kamu tidak bisa melakukan download laporan dikarenakan sistem gagal memformat data, anda dapat memuat kembali halaman ini"
        );
        return {};
      }
    },

    processCalculateTotal(total) {
      this.payment_types.forEach((col) => {
        this.vehicles.forEach((vehicle) => {
          this.data.total[col.value][vehicle.value] += total[col.value][vehicle.value]
        });
      });

      this.payment_outlines.forEach((col) => {
        this.data.total.total[col.value] += total.total[col.value]
      });

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
      :test_id="`report-by-payment__wrapper`" :ref="`report-by-payment__wrapper`">
      <div class="table-responsive rounded-top mb-0">
        <table class="d-block table table-striped table-sticky-header report-table"
          data-testid="table-report-by-payment">
          <thead class="thead-primary">
            <tr>
              <th v-if="type !== 'shift'" rowspan="3" data-testid="head-cell__date" class="cell-sticky"
                style="top: 1px; min-height: 44.5px; left: 0px; min-width: 67px; z-index: 3;">
                Tanggal
              </th>
              <th v-if="type !== 'shift'" rowspan="3" data-testid="head-cell__day" class="cell-sticky"
                style="top: 1px; min-height: 44.5px; left: 67px; min-width: 67px; z-index: 3;">
                Hari
              </th>
              <th v-if="type === 'pos'" rowspan="3" data-testid="head-cell__gate" class="cell-sticky"
                style="top: 1px; min-height: 44.5px; left: 134px; min-width: 67px; z-index: 3;">
                Pintu
              </th>
              <th v-if="type === 'shift'" rowspan="3" data-testid="head-cell__shift" class="cell-sticky"
                style="top: 1px; min-height: 44.5px; left: 0px; min-width: 201px; z-index: 3;">
                Shift
              </th>
              <th v-if="vehicle.length && column_list.includes('cash')" rowspan="2" :colspan="vehicle.length"
                data-testid="head-cell__cash" class="cell-sticky" style="top: 1px; min-height: 44.5px">
                Tunai
              </th>
              <th v-if="selected_length.app_cashless && vehicle.length"
                :colspan="selected_length.app_cashless * vehicle.length" data-testid="head-cell__apps"
                class="cell-sticky" style="top: 1px; min-height: 44.5px">
                Aplikasi User
              </th>
              <th v-if="selected_length.emoney && vehicle.length" :colspan="selected_length.emoney * vehicle.length"
                data-testid="head-cell__emoney" class="cell-sticky" style="top: 1px; min-height: 44.5px">
                Uang Elektronik
              </th>
              <th v-if="selected_length.static_qris && vehicle.length"
                :colspan="selected_length.static_qris * vehicle.length" data-testid="head-cell__static-qris"
                class="cell-sticky" style="top: 1px; min-height: 44.5px">
                QRIS Statis
              </th>
              <th v-if="vehicle.length && column_list.includes('qris_dispenser')" data-testid="head-cell__dynamic-qris"
                rowspan="2" :colspan="vehicle.length" class="cell-sticky" style="top: 1px; min-height: 44.5px">
                QRIS Dinamis
              </th>
              <th rowspan="1" v-if="payment_outlines.length" data-testid="head-cell__total"
                :colspan="payment_outlines.length" class="cell-sticky" style="top: 1px; min-height: 89px">
                Total
              </th>
              <th rowspan="3" data-testid="head-cell__grand-dotal" class="cell-sticky"
                style="top: 1px; min-height: 44.5px; width: 5%">
                Grand Total
              </th>
            </tr>
            <tr>
              <template v-if="vehicle.length">
                <th v-for="col in app_cashless" v-show="column_list.includes(col.value)" :colspan="vehicle.length"
                  class="cell-sticky" style="top: 45.5px; min-height: 44.5px" :key="`head-${col.value}`"
                  :data-testid="`head-cell__app-${col.value}`">
                  {{ col.text }}
                </th>
                <th v-for="col in emoney" v-show="column_list.includes(col.value)" :colspan="vehicle.length"
                  class="cell-sticky" style="top: 45.5px; min-height: 44.5px" :key="`head-${col.value}`"
                  :data-testid="`head-cell__emoney-${col.value}`">
                  {{ col.text }}
                </th>
                <th v-for="col in static_qris" v-show="column_list.includes(col.value)" :colspan="vehicle.length"
                  class="cell-sticky" style="top: 45.5px; min-height: 44.5px" :key="`head-${col.value}`"
                  :data-testid="`head-cell__static-qris-${col.value}`">
                  {{ col.text }}
                </th>
              </template>
              <th v-for="col in payment_outlines" class="cell-sticky" rowspan="2"
                style="top: 45.5px; min-height: 44.5px" :key="`head-total-${col.value}`"
                :data-testid="`head-cell__dynamic-qris-${col.value}`">
                {{ col.text }}
              </th>
            </tr>
            <tr>

              <template v-for="(col, col_idx) in column">
                <th v-for="(vhc, vhc_idx) in vehicle" :key="`vehicle-${col_idx}-${vhc_idx}`"
                  :class="formatColumnClass(col_idx, vhc_idx)" class="cell-sticky"
                  :style="{ top: has_nested_payment ? '90px' : '45.5px' }"
                  :data-testid="`head-cell__${vhc.value}-${col.value}`">
                  {{ vhc.text }}
                </th>
              </template>
            </tr>
          </thead>

          <tbody>
            <!-- Loading View -->
            <tr v-if="batchReport.isLoadingBatch() && !batchReport.isReloadingBatch()">
              <td class="text-left font-weight-bold" colspan="1000">
                <b-spinner small class="text-primary mr-2"></b-spinner>
                Memuat data tanggal {{ batchReport.getWorkingBatch() }}
              </td>
            </tr>

            <tr v-for="(row, index) in data.rows" :key="`row-${index}`">
              <td v-if="type !== 'shift'" class="cell-sticky" :data-testid="`cell-field__date-${index}`"
                style="left: 0px; min-width: 67px; z-index: 2">
                {{ row.date }}
              </td>
              <td v-if="type !== 'shift'" class="cell-sticky" :data-testid="`cell-field__day-${index}`"
                style="left: 67px; min-width: 67px; z-index: 2">
                {{ row.days }}
              </td>
              <td v-if="type === 'pos'" class="cell-sticky" style="left: 134px; min-width: 67px; z-index: 2"
                :data-testid="`cell-field__gate-${index}`">
                {{ row.empty ? row.date : row.gate }}
              </td>
              <td v-if="type === 'shift'" class="cell-sticky" style="left: 0px; min-width: 201px; z-index: 2"
                :data-testid="`cell-field__shift-${index}`">
                {{ row.empty ? row.date : row.shift }}
              </td>

              <!-- Placeholder Failed Data -->

              <template v-if="row.dummy">
                <td v-if="batchReport.isLoadingBatch() && batchReport.isWorkingBatch(row.start)"
                  class="text-left font-weight-bold" colspan="1000">
                  <b-spinner small class="text-primary mr-2"></b-spinner>
                  Memuat data
                </td>
                <td v-else class="text-left font-weight-bold" colspan="1000">
                  Data gagal dimuat
                  <active-button variant="primary" text="Muat Ulang" size="sm" text_color="text-light"
                    @click="batchReport.getBatchData(row.start, row.end, index)" :id="`btn-reload_${index}`"
                    :is_disabled="batchReport.isLoadingBatch()" />
                </td>
              </template>

              <!-- Success Data -->

              <template v-else>
                <td v-for="vhc in vehicle" v-show="column_list.includes('cash')"
                  :key="`data-${index}-cash-${vhc.value}`" :data-testid="`cell-field__cash-${vhc.value}-${index}`">
                  {{ row.empty ? 0 : $utility.convertToRupiah(row["cash"][vhc.value]) }}
                </td>
                <template v-for="col in app_cashless">
                  <td v-for="vhc in vehicle" v-show="column_list.includes(col.value)"
                    :key="`data-${index}-${col.value}-${vhc.value}`"
                    :data-testid="`cell-field__cashless-${col.value}-${vhc.value}-${index}`">
                    {{ row.empty ? 0 : $utility.convertToRupiah(row[col.value][vhc.value]) }}
                  </td>
                </template>

                <template v-for="col in emoney">
                  <td v-for="vhc in vehicle" v-show="column_list.includes(col.value)"
                    :key="`data-${index}-${col.value}-${vhc.value}`"
                    :data-testid="`cell-field__emoney-${col.value}-${vhc.value}-${index}`">
                    {{ row.empty ? 0 : $utility.convertToRupiah(row[col.value][vhc.value]) }}
                  </td>
                </template>

                <template v-for="col in static_qris">
                  <td v-for="vhc in vehicle" v-show="column_list.includes(col.value)"
                    :key="`data-${index}-${col.value}-${vhc.value}`"
                    :data-testid="`cell-field__static-qris-${col.value}-${vhc.value}-${index}`">
                    {{ row.empty ? 0 : $utility.convertToRupiah(row[col.value][vhc.value]) }}
                  </td>
                </template>
                <td v-for="vhc in vehicle" v-show="column_list.includes('qris_dispenser')"
                  :key="`data-${index}-qris_dispenser-${vhc.value}`"
                  :data-testid="`cell-field__dynamic-qris-${vhc.value}-${index}`">
                  {{ row.empty ? 0 : $utility.convertToRupiah(row["qris_dispenser"][vhc.value]) }}
                </td>
                <td v-for="col in payment_outlines" :key="`total-${index}-${col.value}`"
                  :data-testid="`cell-field__total-${col.value}-${index}`">
                  {{ row.empty ? 0 : $utility.convertToRupiah(row.total[col.value]) }}
                </td>
                <td :data-testid="`cell-field__grand-total-${index}`">
                  {{ row.empty ? 0 : $utility.convertToRupiah(row.grand_total) }}
                </td>
              </template>
            </tr>
          </tbody>

          <tfoot v-if="data.total.total">
            <tr>
              <th :colspan="type === 'pos' ? 3 : type === 'shift' ? 1 : 2" class="bg-primary cell-sticky"
                style="left: 0px">
                Total
              </th>
              <td v-for="vhc in vehicle" :key="`data-total-cash-${vhc.value}`" v-show="column_list.includes('cash')"
                :data-testid="`total-field__cash-${vhc.value}`">
                {{ $utility.convertToRupiah(data.total["cash"][vhc.value]) }}
              </td>

              <template v-for="col in app_cashless">
                <td v-for="vhc in vehicle" :key="`data-total-${col.value}-${vhc.value}`"
                  v-show="column_list.includes(col.value)"
                  :data-testid="`total-field__cashless-${col.value}-${vhc.value}`">
                  {{ $utility.convertToRupiah(data.total[col.value][vhc.value]) }}
                </td>
              </template>

              <template v-for="col in emoney">
                <td v-for="vhc in vehicle" :key="`data-total-${col.value}-${vhc.value}`"
                  v-show="column_list.includes(col.value)"
                  :data-testid="`total-field__emoney-${col.value}-${vhc.value}`">
                  {{ $utility.convertToRupiah(data.total[col.value][vhc.value]) }}
                </td>
              </template>

              <template v-for="col in static_qris">
                <td v-for="vhc in vehicle" :key="`data-total-${col.value}-${vhc.value}`"
                  v-show="column_list.includes(col.value)"
                  :data-testid="`total-field__static-qris-${col.value}-${vhc.value}`">
                  {{ $utility.convertToRupiah(data.total[col.value][vhc.value]) }}
                </td>
              </template>
              <td v-for="vhc in vehicle" :key="`data-total-qris_dispenser-${vhc.value}`"
                v-show="column_list.includes('qris_dispenser')"
                :data-testid="`total-field__dynamic-qris-$${vhc.value}`">
                {{ $utility.convertToRupiah(data.total["qris_dispenser"][vhc.value]) }}
              </td>
              <td v-for="col in payment_outlines" :key="`total-total-${col.value}`"
                :data-testid="`total-field__${col.value}`">
                {{ $utility.convertToRupiah(data.total.total[col.value]) }}
              </td>
              <td>{{ $utility.convertToRupiah(data.total.grand_total) }}</td>
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
