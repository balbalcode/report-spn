<script>
import { download_types, parking_access } from "~/constants/v3.report";
import { v3reportMethods } from "@/store/helperActions";

let FilterReport = null;
try {
  FilterReport = () =>
    import("@/components/organisms/report/_shared/FilterReport");
} catch (error) {
  window.$nuxt.$utility.setErrorContextSentry(error);
  window.$nuxt.$sentry.captureMessage(
    `${error.message} at rendering filter-report in components/templates/report/v3/ReportInOut`
  );
  window.location.reload();
}

export default {
  props: {
    report_title: { default: "" },
    report_key: { default: "" },
  },
  components: {
    Layout: () => import("@/layouts/main"),
    FilterReport,
    TableReportInOut: () =>
      import("@/components/templates/report/v3/TableReportInOut"),
    SquareCard: () => import("@utilities/atoms/card/SquareCard"),
    PlainModal: () => import("@utilities/atoms/modal/PlainModal"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
    ContentTitle: () => import("@utilities/atoms/title/ContentTitle"),
    DropdownButton: () => import("@utilities/atoms/button/DropdownButton"),
    ExportButton: () => import("@utilities/atoms/button/ExportButton"),
    ContentDivider: () => import("@utilities/atoms/utility/ContentDivider"),
  },
  data: () => ({
    filter: {
      type: {},
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
      fields: {},
      content: [],
    },
    options: {
      type: download_types(),
      column: parking_access(),
    },
    parking_access: parking_access(),
  }),
  mounted() {
    this.checkModalWarning();
  },
  methods: {
    ...v3reportMethods,

    passExportType(value) {
      try {
        switch (value) {
          case "PDF":
            return;
          case "CSV":
            document.getElementById("btn-export").click();
            return;
          default:
            alert(value);
            return;
        }
      } catch (error) {
        this.$utility.setErrorContextSentry(error);
        this.$sentry.captureMessage(
          `${error.message} at passExportType in ReportInOut`
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

    toggleDisableFilter(disabled) {
      this.helper.filter_disabled = disabled;
    },

    async processGetReport(payload) {
      if (this.report_key === "quantity")
        return await this.getQuantityInOutReport(payload);
    },

    processGetPayloadFilter(value) {
      const is_searching =
        value.month != this.filter.month || value.type != this.filter.type;
      this.filter = value;
      this.helper.is_searching = is_searching;
    },

    processPayloadDownloadReport(value) {
      this.helper.is_searching = false;
      let spot = this.$utility.getSelectedSpot();
      this.report.name = `${this.report_title} Keluar Masuk ${spot.text} Bulan ${this.filter.month}`;
      this.report.fields = value.header;
      this.report.content = value.content;
    },
  },
};
</script>
<template>
  <layout :title="report_title">
    <square-card :has_shadow="true">
      <b-row class="px-2">
        <b-col cols="12" lg="6" class="px-1">
          <content-title additional_class="mb-0 px-0 mx-0 pt-2" value="Keluar Masuk" />
        </b-col>
        <b-col cols="12" lg="6" class="text-right">
          <dropdown-button :options="options.type" text="Download Excel" position="right" id="btn-download"
            test_id="btn-download" :is_disabled="report.content.length < 1" @update="passExportType" />
          <export-button :export_name="report.name" :fields="report.fields" :content="report.content" id="btn-export"
            test_id="btn-export" :is_disabled="report.content.length < 1" additional_class="mt-2" style="display: none" />
        </b-col>
        <b-col cols="12" class="px-1">
          <content-divider />
        </b-col>
        <b-col cols="12" class="px-1 mb-3">
          <filter-report has_vehicle has_period has_spot has_column_setting has_type is_init_all_column
            is_init_all_vehicle is_not_update_init :option_column="options.column" @update="processGetPayloadFilter"
            ref="filter-report" :is_disabled="helper.filter_disabled || helper.is_searching" />
        </b-col>
        <b-col cols="12" class="px-0">
          <table-report-in-out :month="filter.month" :vehicle="filter.vehicle" :column="filter.column"
            :type="filter.type.value ? filter.type.value : ''" :is_searching="helper.is_searching"
            @ready="processPayloadDownloadReport" ref="table_report" :get_report="processGetReport"
            :parking_access="parking_access" @loadingBatch="toggleDisableFilter" />
        </b-col>
      </b-row>
    </square-card>
    <!-- modal warning -->
    <plain-modal v-model="modal.modal_warning">
      <img src="~/static/assets/warning-modal.png" class="img-fluid" alt="image-warning" />
      <p class="text-dark font-weight-bold font-size-18 my-1">
        Klik Filter untuk menampilkan laporan
      </p>
      <p class="my-1">
        Kami melakukan perubahan padahalaman pelaporan, seluruh laporan akan
        ditampilkan setelah anda meilih filter atau format laporan yang anda
        atur.
      </p>
      <div class="d-flex">
        <active-button @click="processBlockModal" text="Mengerti, Jangan tampilkan lagi"
          additional_class="my-3 w-100 font-weight-bold" id="btn-close__always" test_id="btn-close__always" />
      </div>
    </plain-modal>
  </layout>
</template>