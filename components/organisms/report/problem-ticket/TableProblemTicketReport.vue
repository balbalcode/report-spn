<template>
  <div>
    <content-table-view
      :test_id="`wrapper__${id}`"
      :is_loading="helper.is_loading"
      :is_error="helper.is_error"
      :length="report.length"
      empty-caption="Laporan Belum Tersedia"
      @reload="processGetData"
    >
      <div class="col-12 p-0 rounded">
        <table
          class="d-block table table-spn table-striped table-sticky-header report-table"
          :data-testid="id"
        >
          <thead class="thead-primary">
            <tr>
              <th
                class="cell-sticky"
                :data-testid="`${id}__th-media`"
                style="top: 1px"
              >
                Media
              </th>
              <th
                class="cell-sticky"
                :data-testid="`${id}__th-time-in`"
                style="top: 1px"
              >
                Waktu Tiket Dibuat
              </th>
              <th
                class="cell-sticky"
                :data-testid="`${id}__th-system-problem-at`"
                style="top: 1px; height: 45.5px"
              >
                Waktu Ditandai Bermasalah (Sistem)
              </th>
              <th
                class="cell-sticky"
                :data-testid="`${id}__th-manual-problem-at`"
                style="top: 1px; height: 45.5px"
              >
                Waktu Ditandai Bermasalah (Manual)
              </th>
              <th
                class="cell-sticky"
                :data-testid="`${id}__th-shift`"
                style="top: 1px"
              >
                Shift
              </th>
              <th
                class="cell-sticky"
                :data-testid="`${id}__th-id`"
                style="top: 1px; width: 5%"
              >
                ID Transaksi
              </th>
              <th
                class="cell-sticky"
                :data-testid="`${id}__th-reason`"
                style="top: 1px"
              >
                Alasan
              </th>
              <th
                class="cell-sticky"
                :data-testid="`${id}__th-officer`"
                style="top: 1px"
              >
                Petugas
              </th>
              <th
                class="cell-sticky"
                :data-testid="`${id}__th-amount`"
                style="top: 1px"
              >
                Nominal
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in report"
              :key="`row-${index}`"
              @click="setSelectedImage(row.image)"
              class="cursor-pointer"
              :data-testid="`${id}__tr-${index}`"
            >
              <td
                :data-testid="`${id}__tr-${index}__td-media`"
                class="font-size-12"
              >
                <span
                  v-if="row.media === 'DASHBOARD'"
                  class="d-inline-block badge-pill px-2 py-1 mr-2 badge-soft-pink"
                >
                  Dashboard
                </span>
                <span
                  v-if="row.media === 'OFFICER_APP'"
                  class="d-inline-block badge-pill px-2 py-1 mr-2 badge-soft-blue"
                >
                  Aplikasi Petugas
                </span>
                <span
                  v-if="row.media === 'SYSTEM'"
                  class="d-inline-block badge-pill px-2 py-1 mr-2 badge-soft-orange"
                >
                  Sistem
                </span>
              </td>
              <td :data-testid="`${id}__tr-${index}__td-time-in`">
                {{ row.time_in }}
              </td>
              <td :data-testid="`${id}__tr-${index}__td-system-problem-at`">
                {{ row.system_problem_at }}
              </td>
              <td :data-testid="`${id}__tr-${index}__td-manual-problem-at`">
                {{ row.manual_problem_at }}
              </td>
              <td :data-testid="`${id}__tr-${index}__td-shift`">
                {{ row.shift }}
              </td>
              <td :data-testid="`${id}__tr-${index}__td-id`">
                <overview-label
                  :test_id="`${id}__tr-${index}__td-id__overview`"
                  :ref="`${id}__tr-${index}__td-id__overview`"
                  :value="row.id"
                  limit_text="12"
                  :has_space="false"
                  :is_italic="false"
                />
              </td>
              <td :data-testid="`${id}__tr-${index}__td-reason`">
                {{ row.reason }}
              </td>
              <td :data-testid="`${id}__tr-${index}__td-reporter`">
                {{ row.reporter }}
              </td>
              <td :data-testid="`${id}__tr-${index}__td-amount`">
                {{ $utility.convertToRupiah(row.amount) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </content-table-view>

    <plain-modal size="lg" v-model="modal.modal_image">
      <content-image :value="selected_image" :is_responsive="true" />
      <active-button
        @click="toggleModalImage"
        text="Tutup"
        additional_class="w-100 mt-3"
        type="outline"
        variant="grey"
      />
    </plain-modal>
  </div>
</template>

<script>
import { reportMethods } from "@/store/helperActions";
import constant_resolution_center from "@/constants/resolution-center";
import constant_report from "@/constants/report";

export default {
  components: {
    ContentTableView: () =>
      import("@utilities/molecules/content-view/ContentTableView"),
    OverviewLabel: () => import("@utilities/atoms/label/OverviewLabel"),
    PlainModal: () => import("@utilities/atoms/modal/PlainModal"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
    ContentImage: () => import("@utilities/atoms/image/ContentImage"),
  },

  props: {
    is_searching: { default: false },
    date_range: { default: () => [] },
    officer: { default: "" },
    user: { default: "" },
    reason: { default: "" },
    media: { default: "" },
  },

  data: () => ({
    id: "table-problem-ticket-report",
    data: {
      rows: [],
      total: {},
    },
    report: [],
    helper: {
      is_loading: false,
      is_error: false,
    },
    modal: {
      modal_image: false,
    },
    reason_map: constant_resolution_center.reason_map(),
    selected_image: "",
    map_media: constant_report.problem_media_map(),
  }),

  watch: {
    is_searching: {
      async handler(value) {
        if (value === true) await this.processGetData();
      },
    },
  },

  async mounted() {
    if (this.is_searching) await this.processGetData();
  },

  methods: {
    ...reportMethods,

    passFormatDownloadReport() {
      this.report = [];
      const payload = { content: [], total: {} };
      if (this.data.rows.length > 0) {
        this.report = this.formatContentReport(this.data.rows);
        payload.content = this.report;
        payload.total = this.data.total;
      }
      this.$emit("ready", payload);
    },

    setSelectedImage(image) {
      this.selected_image = image ?? "";
      this.toggleModalImage();
    },

    setPayloadGet() {
      let payload = {
        filter: [
          { key: "date_range", value: this.date_range.join("_") },
          { key: "spot_id", value: this.$utility.getSpotId() },
        ],
      };

      if (this.media && this.media.length) {
        const media = this.media.map((item) => item.value).join(",");
        payload.filter.push({ key: "media", value: media });
      }

      if (this.officer && this.officer.length) {
        const officer = this.officer.map((item) => item.id).join(",");
        payload.filter.push({ key: "officer_id", value: officer });
      }

      if (this.user && this.user.length) {
        const user = this.user.map((item) => item.id).join(",");
        payload.filter.push({ key: "mgmt_user_id", value: user });
      }

      if (this.reason && this.reason.length) {
        const reason = this.reason.map((item) => item.value).join(",");
        payload.filter.push({ key: "reason", value: reason });
      }

      return payload;
    },

    toggleModalImage() {
      this.modal.modal_image = !this.modal.modal_image;
    },

    formatContentReport(rows) {
      try {
        return rows.map((row) => {
          let reporter = "-";
          if (row.media === "DASHBOARD" && row.mgmt) reporter = row.mgmt;
          else if (row.media === "OFFICER_APP" && row.officer)
            reporter = row.officer;

          return {
            ...row,
            reporter,
            media_text: this.map_media[row.media] ?? "-",
            shift: row.shift_time_out ?? "-",
            reason: this.reason_map[row.reason] ?? row.reason ?? "-",
            amount: this.$utility.convertToRupiah(row.amount),
          };
        });
      } catch (error) {
        this.$utility.setErrorContextSentry(error);
        this.$sentry.captureMessage(
          `${error.message} at formatContentReport in TableProblemTicketReport`
        );
        return [];
      }
    },

    async processGetData() {
      this.helper.is_loading = true;
      this.helper.is_error = false;
      this.data = { rows: [] };
      try {
        const payload = this.setPayloadGet();
        this.data = await this.getProblemTicketReport(payload);
      } catch (error) {
        console.log(error);
        this.data = { rows: [] };
        this.helper.is_error = true;
      }
      this.passFormatDownloadReport();
      this.helper.is_loading = false;
    },
  },
};
</script>
