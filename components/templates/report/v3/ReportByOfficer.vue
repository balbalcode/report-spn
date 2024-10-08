<script>
import { download_types, report_by_officer_heads } from "~/constants/v3.report";
import { v3reportMethods } from "@/store/helperActions";

let FilterReport = null;
try {
  FilterReport = () =>
    import("@/components/organisms/report/_shared/FilterReport");
} catch (error) {
  window.$nuxt.$utility.setErrorContextSentry(error);
  window.$nuxt.$sentry.captureMessage(
    `${error.message} at rendering filter-report in report/problem-ticket/index`
  );
  window.location.reload();
}

export default {
  props: {
    id: { default: "" },
    report_title: { default: "" },
    report_key: { default: "" },
  },
  components: {
    Layout: () => import("@/layouts/main"),
    PlainModal: () => import("@utilities/atoms/modal/PlainModal"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
    FilterReport,
    TableReportByOfficer: () =>
      import("@/components/templates/report/v3/TableReportByOfficer"),
    SquareCard: () => import("@utilities/atoms/card/SquareCard"),
    ContentTitle: () => import("@utilities/atoms/title/ContentTitle"),
    DropdownButton: () => import("@utilities/atoms/button/DropdownButton"),
    ExportButton: () => import("@utilities/atoms/button/ExportButton"),
    ContentDivider: () => import("@utilities/atoms/utility/ContentDivider"),
  },
  data: () => ({
    filter: {
      month: [],
      officer: "",
    },
    helper: {
      is_searching: false,
      filter_disabled: false,
      report_versions: process.env.REPORT_VERSIONS,
    },
    modal: {
      modal_warning: false,
    },
    report: {
      name: "",
      fields: report_by_officer_heads(),
      content: [],
    },
    options: {
      type: download_types(),
      column: [],
    },
  }),
  mounted() {
    this.checkModalWarning();
  },
  methods: {
    ...v3reportMethods,

    passExportType(value) {
      try {
        switch (value) {
          case "CSV":
            document.getElementById(`${this.id}__btn-export`).click();
            return;
          default:
            alert(value);
            return;
        }
      } catch (error) {
        this.$utility.setErrorContextSentry(error);
        this.$sentry.captureMessage(
          `${error.message} at passExportType in report/duration/index`
        );
      }
    },

    toggleModalWarning() {
      this.modal.modal_warning = !this.modal.modal_warning;
    },

    checkModalWarning() {
      const report_versions = localStorage.getItem("new_report_scheme");
      if (!(report_versions === this.helper.report_versions))
        this.toggleModalWarning();
    },

    processBlockModal() {
      localStorage.setItem("new_report_scheme", this.helper.report_versions);
      this.toggleModalWarning();
    },

    passFilter(value) {
      this.filter.month = value.month;
      this.filter.officer = value.officer;
      this.filter.timezone = value.timezone;
      this.helper.is_searching = true;
    },

    async processGetReport(payload) {
      if (this.report_key === "income")
        return await this.getIncomeReportByOfficer(payload);
      else if (this.report_key === "quantity")
        return await this.getQuantityReportByOfficer(payload);
    },

    processPayloadDownloadReport(value) {
      this.helper.is_searching = false;
      let spot = this.$utility.getSelectedSpot();

      let name = `${this.report_title} Per Petugas ${spot.text} Bulan ${this.filter.month}`;
      if (this.filter.officer && this.filter.officer.text)
        name += ` Petugas ${this.filter.officer.text}`;
      if (value.total_page > 1)
        name += ` (hal ${value.page} dari ${value.total_page})`;
      this.report.name = name;

      this.report.content = value.content;
    },
  },
};
</script>
<template>
  <layout :title="report_title">
    <square-card :has_shadow="true">
      <div class="row px-2">
        <div class="col-12 col-lg-6 px-1">
          <content-title
            additional_class="mb-0 px-0 mx-0 pt-2"
            value="Per Petugas"
          />
        </div>
        <div class="col-12 col-lg-6 text-right">
          <dropdown-button
            :options="options.type"
            text="Download CSV"
            position="right"
            :is_disabled="report.content.length < 1"
            :id="`${id}__btn-download-option`"
            :ref="`${id}__btn-download-option`"
            @update="passExportType"
          />
          <export-button
            :export_name="report.name"
            :fields="report.fields"
            :content="report.content"
            :id="`${id}__btn-export`"
            :ref="`${id}__btn-export`"
            :is_disabled="report.content.length < 1"
            additional_class="mt-2"
            style="display: none"
          />
        </div>
        <div class="col-12 px-1">
          <content-divider />
        </div>
        <div class="col-12 px-1 mb-3 d-flex justify-content-between">
          <filter-report
            has_period
            has_officer
            has_timezone
            is_not_update_init
            :is_disabled="helper.is_searching"
            @update="passFilter"
            :id="`${id}__filter`"
            :ref="`${id}__filter`"
          />
          <div class="text-info d-flex align-items-center">
            <i class="bx bx-info-circle font-size-18 mr-1"></i>
            <span
              >Hanya transaksi dengan pembayaran <strong>TUNAI</strong></span
            >
          </div>
        </div>
        <div class="col-12 px-0">
          <table-report-by-officer
            :officer="filter.officer"
            :month="filter.month"
            :timezone="filter.timezone"
            :is_searching="helper.is_searching"
            :get_report="processGetReport"
            @ready="processPayloadDownloadReport"
            :id="`${id}__table`"
            :ref="`${id}__table`"
          />
        </div>
      </div>
    </square-card>
    <!-- modal warning -->
    <plain-modal v-model="modal.modal_warning">
      <img
        src="~/static/assets/warning-modal.png"
        class="img-fluid"
        alt="image-warning"
      />
      <p class="text-dark font-weight-bold font-size-18 my-1">
        Klik Filter untuk menampilkan laporan
      </p>
      <p class="my-1">
        Kami melakukan perubahan padahalaman pelaporan, seluruh laporan akan
        ditampilkan setelah anda meilih filter atau format laporan yang anda
        atur.
      </p>
      <div class="d-flex">
        <active-button
          @click="processBlockModal"
          text="Mengerti, Jangan tampilkan lagi"
          additional_class="my-3 w-100 font-weight-bold"
          id="btn-close__always"
          test_id="btn-close__always"
        />
      </div>
    </plain-modal>
  </layout>
</template>