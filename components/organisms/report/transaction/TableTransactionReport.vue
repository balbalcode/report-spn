<template>
  <div>
    <div class="row" v-if="helper.is_loading">
      <content-span />
    </div>

    <div class="row" v-else-if="helper.is_error">
      <content-span
        :has_animation="false"
        image="error.png"
        size="xl"
        caption="Gagal memuat data"
        has_reload_button
        @reload="processGetData"
      />
    </div>

    <div class="row" v-else-if="report.length < 1">
      <content-span
        :has_animation="false"
        image="empty.png"
        size="xl"
        caption="Laporan belum tersedia"
      />
    </div>
    <div v-else class="mt-3">
      <div class="row mx-0 px-1 py-2" v-html="filter_title" />
      <div class="row py-1 px-3">
        <div class="col-12 p-0 rounded">
          <table
            class="d-block table table-striped table-sticky-header report-table"
            id="table-report-transaction"
          >
            <thead class="thead-primary">
              <tr>
                <th
                  data-testid="head-cell__no"
                  rowspan="2"
                  class="cell-sticky text-left"
                  style="top: 1px"
                >
                  No.
                </th>
                <th
                  data-testid="head-cell__transaction_id"
                  rowspan="2"
                  class="cell-sticky text-left"
                  style="top: 1px"
                >
                  Transaksi
                </th>
                <th
                  data-testid="head-cell__finder_id"
                  rowspan="2"
                  class="cell-sticky text-left"
                  style="top: 1px"
                >
                  Finder
                </th>
                <th
                  data-testid="head-cell__license_plate"
                  rowspan="2"
                  class="cell-sticky text-left"
                  style="top: 1px"
                >
                  Plat Nomor
                </th>
                <th
                  data-testid="head-cell__rfid"
                  rowspan="2"
                  class="cell-sticky text-left"
                  style="top: 1px"
                >
                  RF ID
                </th>
                <th
                  data-testid="head-cell__status"
                  rowspan="2"
                  class="cell-sticky text-left"
                  style="top: 1px"
                >
                  Status
                </th>
                <th
                  colspan="6"
                  v-if="helper.lpr_field"
                  style="top: 1px"
                  class="cell-sticky text-center"
                  data-testid="head-cell__lpr-field"
                >
                  LPR
                </th>
                <th
                  rowspan="2"
                  class="cell-sticky text-left"
                  style="top: 1px"
                  data-testid="head-cell__time_in"
                >
                  Waktu Masuk Transaksi
                </th>
                <th
                  rowspan="2"
                  class="cell-sticky text-left"
                  style="top: 1px"
                  data-testid="head-cell__ref_time_in"
                >
                  Waktu Masuk Finder
                </th>
                <th
                  rowspan="2"
                  class="cell-sticky text-left"
                  style="top: 1px"
                  data-testid="head-cell__time_out"
                >
                  Waktu Keluar Transaksi
                </th>
                <th
                  rowspan="2"
                  class="cell-sticky text-left"
                  style="top: 1px"
                  data-testid="head-cell__ref_time_out"
                >
                  Waktu Keluar Finder
                </th>
                <th
                  rowspan="2"
                  class="cell-sticky text-left"
                  style="top: 1px"
                  data-testid="head-cell__paid_at"
                >
                  Waktu Bayar
                </th>
                <th
                  rowspan="2"
                  class="cell-sticky text-left"
                  style="top: 1px; width: 10%"
                  data-testid="head-cell__officer"
                >
                  Petugas
                </th>
                <th
                  rowspan="2"
                  class="cell-sticky text-left"
                  style="top: 1px; width: 5%"
                  data-testid="head-cell__vehicle-code"
                >
                  Kendaraan
                </th>
                <th
                  rowspan="2"
                  class="cell-sticky text-left"
                  style="top: 1px; width: 5%"
                  data-testid="head-cell__product"
                >
                  > Produk
                </th>
                <th
                  rowspan="2"
                  class="cell-sticky text-right"
                  style="top: 1px"
                  data-testid="head-cell__amount"
                >
                  Tarif
                </th>
              </tr>
              <tr>
                <th
                  v-if="helper.lpr_field"
                  class="cell-sticky text-left"
                  style="top: 45.5px"
                  data-testid="head_cell-lpr_in__license_plate"
                >
                  Plat Prediction(In)
                </th>
                <th
                  v-if="helper.lpr_field"
                  class="cell-sticky text-left"
                  style="top: 45.5px"
                  data-testid="head_cell-lpr_in__accuracy"
                >
                  Accuration Rate(In)
                </th>
                <th
                  v-if="helper.lpr_field"
                  class="cell-sticky text-left"
                  style="top: 45.5px"
                  data-testid="head_cell-lpr_in__vehicle"
                >
                  Vehicle Prediction(In)
                </th>
                <th
                  v-if="helper.lpr_field"
                  class="cell-sticky text-left"
                  style="top: 45.5px"
                  data-testid="head_cell-lpr_out__license_plate"
                >
                  Plat Prediction(Out)
                </th>
                <th
                  v-if="helper.lpr_field"
                  class="cell-sticky text-left"
                  style="top: 45.5px"
                  data-testid="head_cell-lpr_out__accuracy"
                >
                  Accuration Rate(Out)
                </th>
                <th
                  v-if="helper.lpr_field"
                  class="cell-sticky text-left"
                  style="top: 45.5px"
                  data-testid="head_cell-lpr_out__vehicle"
                >
                  Vehicle Prediction(Out)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in report"
                :key="`row-${index}`"
                class="cursor-pointer"
                @click="passDetailToParent(row)"
              >
                <td
                  :data-testid="`cell-field--${index}-cell__no`"
                  class="text-left"
                >
                  {{ index + pagination.start }}
                </td>
                <td
                  class="text-left"
                  :data-testid="`cell-field--${index}-cell__transaction_id`"
                >
                  <overview-label
                    additional_class="my-0"
                    :has_space="false"
                    :value="row.transaction_id"
                    limit_text="6"
                    :is_italic="false"
                    :id="`row-${index}-transaction`"
                    :ref="`row-${index}-transaction`"
                  />
                </td>
                <td
                  class="text-left"
                  :data-testid="`cell-field--${index}-cell__finder_id`"
                >
                  <overview-label
                    additional_class="my-0"
                    :has_space="false"
                    :value="row.ref_id"
                    limit_text="6"
                    :is_italic="false"
                    :id="`row-${index}-ref_id`"
                    :ref="`row-${index}-ref_id`"
                  />
                </td>
                <td
                  class="text-left"
                  :data-testid="`cell-field--${index}-cell__license_plate`"
                >
                  {{ row.license_plate }}
                </td>
                <td
                  :data-testid="`cell-field--${index}-cell__rfid`"
                  class="text-left"
                >
                  {{ row.rf_id }}
                </td>
                <td
                  :data-testid="`cell-field--${index}-cell__status`"
                  class="text-left"
                >
                  {{ row.status }}
                </td>
                <td
                  :data-testid="`cell-field--${index}-cell__time_in`"
                  v-if="helper.lpr_field"
                  class="text-left"
                >
                  {{ row.predict_in_license_plate }}
                </td>
                <td
                  :data-testid="`cell-field--${index}-cell__ref_time_in`"
                  v-if="helper.lpr_field"
                  class="text-left"
                >
                  {{ row.predict_in_accuracy }}
                </td>
                <td
                  :data-testid="`cell-field--${index}-cell__time_out`"
                  v-if="helper.lpr_field"
                  class="text-left"
                >
                  {{ row.predict_in_vehicle }}
                </td>
                <td
                  :data-testid="`cell-field--${index}-cell__ref_time_out`"
                  v-if="helper.lpr_field"
                  class="text-left"
                >
                  {{ row.predict_out_license_plate }}
                </td>
                <td
                  :data-testid="`cell-field--${index}-cell__paid_at`"
                  v-if="helper.lpr_field"
                  class="text-left"
                >
                  {{ row.predict_out_accuracy }}
                </td>
                <td
                  :data-testid="`cell-field--${index}-cell__officer`"
                  v-if="helper.lpr_field"
                  class="text-left"
                >
                  {{ row.predict_out_vehicle }}
                </td>
                <td
                  :data-testid="`cell-field--${index}-cell__vehicle` - code"
                  class="text-left"
                >
                  {{ row.time_in }}
                </td>
                <td
                  :data-testid="`cell-field--${index}-cell__product`"
                  class="text-left"
                >
                  {{ row.ref_time_in }}
                </td>
                <td
                  :data-testid="`cell-field--${index}-cell__amount`"
                  class="text-left"
                >
                  {{ row.time_out }}
                </td>
                <td
                  :data-testid="`cell-field--${index}_cell-lpr_in__license_plate`"
                  class="text-left"
                >
                  {{ row.ref_time_out }}
                </td>
                <td
                  :data-testid="`cell-field--${index}_cell-lpr_in__accuracy`"
                  class="text-left"
                >
                  {{ row.paid_at }}
                </td>
                <td
                  :data-testid="`cell-field--${index}_cell-lpr_in__vehicle`"
                  class="text-left"
                >
                  {{ row.officer_name }}
                </td>
                <td
                  :data-testid="`cell-field--${index}_cell-lpr_out__license_plate`"
                  class="text-left"
                >
                  {{ row.vehicle_code }}
                </td>
                <td
                  :data-testid="`cell-field--${index}_cell-lpr_out__accuracy`"
                  class="text-left"
                >
                  {{ row.product }}
                </td>
                <td
                  :data-testid="`cell-field--${index}_cell-lpr_out__vehicle`"
                  class="text-right"
                >
                  {{ row.amount }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="row">
        <div class="col-12 text-right">
          <card-pagination-view
            :per_page="pagination.per_page"
            :total_data="pagination.total_data"
            additional_class="mt-3 "
            :current_page="pagination.current_page"
            @update="passUpdatePagination"
          />
        </div>
      </div>
    </div>
    <b-toast
      no-auto-hide
      :visible="helper.last_sync !== null"
      id="toast_last_sync"
      toaster="b-toaster-bottom-right"
      header-class="d-none"
      variant="dark"
    >
      <template slot="default">
        <div class="d-flex flex-row">
          <div class="text-dark">
            <span
              class="rounded-circle bg-primary font-weight-bold"
              style="padding: 0.2em 0.7em"
            >
              !
            </span>
          </div>
          <div
            class="align-self-lg-center align-middle text-white flex-grow-1 ml-1 font-size-12"
          >
            Terakhir diperbarui
            {{
              $utility.formatLocalTimezone(
                helper.last_sync,
                "DD/MM/YYYY HH:mm:ss"
              )
            }}
          </div>
          <div class="align-self-lg-center align-middle float-right">
            <i
              class="bx bx-x cursor-pointer"
              @click="$bvToast.hide('toast_last_sync')"
            ></i>
          </div>
        </div>
      </template>
    </b-toast>
  </div>
</template>

<script>
import { reportMethods } from "@/store/helperActions";
import constant_resolution_center from "@/constants/resolution-center";

export default {
  components: {
    ContentSpan: () => import("@utilities/atoms/utility/ContentSpan"),
    OverviewLabel: () => import("@utilities/atoms/label/OverviewLabel"),
    CardPaginationView: () =>
      import("@utilities/molecules/card-view/CardPaginationView"),
  },

  props: {
    is_searching: { default: false },
    date: { default: "" },
    vehicle: { default: "" },
    product: { default: "" },
    officer: { default: "" },
    status: { default: "" },
    time_range: {
      default() {
        return { start: "00:00", end: "23:59" };
      },
    },
  },

  data: () => ({
    report: [],
    helper: {
      lpr_field: false,
      last_sync: null,
      is_loading: false,
      is_error: false,
    },
    pagination: {
      start: 1,
      per_page: 10,
      current_page: 1,
      total_data: 0,
    },
    vehicle_map: {},
    transaction_status: constant_resolution_center.transaction_status,
  }),

  computed: {
    filter_title() {
      const end = this.pagination.start - 1 + this.report.length;
      let text = `
        Menampilkan
          <b>&nbsp;${this.pagination.start}-${end}&nbsp;</b>
        dari
          <b>&nbsp;${this.pagination.total_data}&nbsp;</b>
        transaksi untuk status
          <b>&nbsp;${this.status.text}&nbsp;</b>
      `;
      if (this.vehicle && this.vehicle.length > 0) {
        const vehicles = this.vehicle
          .map((item) => item.text)
          .join("</b>,<b>&nbsp;");
        text += `kendaraan<b>&nbsp;${vehicles}&nbsp;</b>`;
      }
      return text;
    },
  },

  watch: {
    is_searching: {
      async handler(value) {
        if (value) await this.passUpdatePagination(1);
      },
    },
  },

  async mounted() {
    this.vehicle_map = await this.$utility.getVehicleMap();
    await this.formatTableReport();
    if (this.is_searching) {
      await this.processGetData();
    }
  },

  methods: {
    getTransactionReport: reportMethods.getTransactionReport,

    async passUpdatePagination(page) {
      this.pagination.current_page = page;
      this.pagination.start =
        1 + (parseInt(page) - 1) * parseInt(this.pagination.per_page);
      await this.processGetData();
    },

    passDetailToParent(data) {
      let image_list = {
        image_url: [""],
        image_out_url: [""],
      };

      if (data.image_list) {
        if (data.image_list.image_url && data.image_list.image_url.length)
          image_list.image_url = data.image_list.image_url;
        if (
          data.image_list.image_out_url &&
          data.image_list.image_out_url.length
        )
          image_list.image_out_url = data.image_list.image_out_url;
      }

      this.$emit("detail", {
        id: data.transaction_id,
        ref_id: data.ref_id,
        image_list,
      });
    },

    setPayloadGet() {
      const payload = {
        filter: [
          { key: "date", value: this.date },
          { key: "start", value: `${this.time_range.start}:00` },
          { key: "end", value: `${this.time_range.end}:59` },
          { key: "page", value: this.pagination.current_page },
          { key: "per_page", value: this.pagination.per_page },
          { key: "spot_id", value: this.$utility.getSpotId() },
        ],
        opener: this.$route.path,
      };

      if (this.status && this.status.value) {
        payload.filter.push({ key: "status", value: this.status.value });
      }

      if (this.officer && this.officer.value) {
        payload.filter.push({ key: "officer_id", value: this.officer.value });
      }

      if (this.vehicle && this.vehicle.length) {
        payload.filter.push({
          key: "vehicle_code",
          value: this.$utility.formatListParameterPayload(
            this.vehicle,
            "value"
          ),
        });
      }

      if (this.product && this.product.length) {
        payload.filter.push({
          key: "product_id",
          value: this.$utility.formatListParameterPayload(
            this.product,
            "value"
          ),
        });
      }

      return payload;
    },

    async formatTableReport() {
      let spot = await this.$utility.getSpotInfo();
      if (spot.features.indexOf("LPR") >= 0) {
        this.helper.lpr_field = true;
      } else {
        this.helper.lpr_field = false;
      }
    },

    formatContentReport(rows) {
      try {
        return rows.map((row) => ({
          transaction_id: row.id,
          ref_id: row.ref_id,
          license_plate: row.ref_detail.values
            ? row.ref_detail.values.motorcycle_detail.license_plate
            : "-",
          rf_id: row.rf_id ?? "-",
          status: this.transaction_status(row.status),
          time_in:
            this.$utility.formatLocalTimezone(
              row.time_in,
              "DD/MM/YYYY HH:mm"
            ) ?? "-",
          ref_time_in:
            this.$utility.formatLocalTimezone(
              row.ref_detail.time_in,
              "DD/MM/YYYY HH:mm"
            ) ?? "-",
          time_out:
            this.$utility.formatLocalTimezone(
              row.time_out,
              "DD/MM/YYYY HH:mm"
            ) ?? "-",
          ref_time_out:
            this.$utility.formatLocalTimezone(
              row.ref_detail.time_out,
              "DD/MM/YYYY HH:mm"
            ) ?? "-",
          paid_at:
            this.$utility.dateUTCToLocal(row.paid_at, "DD/MM/YYYY HH:mm:ss") ??
            "-",
          officer_name:
            row.officer_detail && row.officer_detail.name
              ? row.officer_detail.name
              : "-",
          vehicle_code: this.vehicle_map[row.vehicle_code] ?? "-",
          product:
            row.product_detail && row.product_detail.name
              ? row.product_detail.name
              : "-",
          amount: this.$utility.convertToRupiah(row.amount) ?? "-",
          image_url: row.image_url,
          image_out_url: row.image_out_url,
          image_list: row.image_list,
          predict_in_license_plate: row.prediction.lpr_in.license_plate ?? "-",
          predict_in_accuracy: row.prediction.lpr_in.accuracy ?? "-",
          predict_in_vehicle: row.prediction.lpr_in.vehicle ?? "-",
          predict_out_license_plate:
            row.prediction.lpr_out.license_plate ?? "-",
          predict_out_accuracy: row.prediction.lpr_out.accuracy ?? "-",
          predict_out_vehicle: row.prediction.lpr_out.vehicle ?? "-",
        }));
      } catch (error) {
        this.$utility.setErrorContextSentry(error);
        this.$sentry.captureMessage(
          `${error.message} at formatContentReport in TableTransactionReport`
        );
        throw error;
      }
    },

    async processGetData() {
      this.helper.is_loading = true;
      this.helper.is_error = false;
      try {
        // get data from API
        const payload = this.setPayloadGet();
        const data = await this.getTransactionReport(payload);

        // set report
        this.report =
          data.rows.length > 0 ? this.formatContentReport(data.rows) : [];

        // set total
        this.pagination.total_data = data.total;

        // set last sync
        this.helper.last_sync = data.last_sync;

        // emit searching to false
        this.$emit("searching", false);

        // clear selected item
        this.passDetailToParent({});
      } catch (error) {
        this.report = [];
        this.helper.is_error = true;
        this.pagination.total_data = 0;
      }
      this.helper.is_loading = false;
    },
  },
};
</script>
