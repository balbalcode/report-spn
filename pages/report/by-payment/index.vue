<script>
import { download_types, payment_types, report_data_types } from "~/constants/v3.report";
import { v3reportMethods } from "@/store/helperActions";

let FilterReport = null;
try {
  FilterReport = () =>
    import("@/components/organisms/report/_shared/FilterReport");
} catch (error) {
  window.$nuxt.$utility.setErrorContextSentry(error);
  window.$nuxt.$sentry.captureMessage(
    `${error.message} at rendering filter-report in report/by-payment/index`
  );
  window.location.reload();
}

export default {
  components: {
    Layout: () => import("@/layouts/main"),
    PlainModal: () => import("@utilities/atoms/modal/PlainModal"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
    FilterReport,
    TableReportByPayment: () => import("@/components/organisms/report/by-payment/TableReportByPayment"),
    SquareCard: () => import("@utilities/atoms/card/SquareCard"),
    ContentTitle: () => import("@utilities/atoms/title/ContentTitle"),
    DropdownButton: () => import("@utilities/atoms/button/DropdownButton"),
    ExportButton: () => import("@utilities/atoms/button/ExportButton"),
    ContentDivider: () => import("@utilities/atoms/utility/ContentDivider"),
    SelectInput: () => import("@utilities/atoms/input/SelectInput"),
  },
  data: () => ({
    filter: {
      type: {},
      vehicle: [],
      column: [],
      month: "",
      timezone: "",
    },
    data_type: report_data_types(0),
    helper: {
      is_searching: false,
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
      column: payment_types(),
      data_type: report_data_types(),
    },
  }),
  watch: {
    data_type() {
      if (this.filter.month) this.helper.is_searching = true;
    }
  },
  mounted() {
    this.filter.timezone = this.$utility.getSpotTimezone();
    this.checkModalWarning();
  },
  methods: {
    ...v3reportMethods,

    passExportType(value) {
      try {
        switch (value) {
          case "PDF":
            window.open(
              `/report/v3/${this.data_type.value}/payment/print?month=${this.filter.month
              }&vehicle=${this.$utility.formatListParameterPayload(
                this.filter.vehicle,
                "value"
              )}&alias=${this.$utility.formatListParameterPayload(
                this.filter.vehicle,
                "alias"
              )}&spot=${this.$utility.getSpotId()}&type=${this.filter.type.value
              }`,
              "_blank"
            );
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
          `${error.message} at passExportType in ReportByPayment`
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

    async processGetReport(payload) {
      if (this.data_type.value === "income")
        return await this.getIncomeReportByPayment(payload);
      else if (this.data_type.value === "quantity")
        return await this.getQuantityReportByPayment(payload);
    },

    processGetPayloadFilter(value) {
      const reload =
        value.month != this.filter.month ||
        value.type != this.filter.type ||
        value.timezone != this.filter.timezone;
      this.filter = value;
      this.helper.is_searching = reload;
    },

    processPayloadDownloadReport(value) {
      this.helper.is_searching = false;
      let spot = this.$utility.getSelectedSpot();
      this.report.name = `Laporan ${this.data_type.text} Jenis Pembayaran ${spot.text} Bulan ${this.filter.month}`;
      this.report.fields = value.header;
      this.report.content = value.content;
    },
  },
};
</script>
<template>
  <layout :title="`Laporan ${data_type.text}`">
    <square-card :has_shadow="true">
      <div class="row px-2">
        <div class="col-12 col-lg-6 px-1">
          <content-title additional_class="mb-0 px-0 mx-0 pt-2" value="Jenis Pembayaran" />
        </div>
        <div class="col-12 col-lg-6 text-right">
          <dropdown-button :options="options.type" text="Download Excel" position="right" id="btn-download"
            :is_disabled="report.content.length < 1" @update="passExportType" test_id="btn-download" />
          <export-button :export_name="report.name" :fields="report.fields" :content="report.content" id="btn-export"
            :is_disabled="report.content.length < 1" additional_class="mt-2" style="display: none"
            test_id="btn-export" />
        </div>
      </div>
      <div>
        <content-divider />
      </div>
      <div class="d-flex align-items-center flex-wrap mb-3">
        <filter-report has_vehicle has_period has_column_setting has_type is_not_update_init is_init_all_column
          is_init_all_vehicle :option_column="options.column" @update="processGetPayloadFilter" id="payment"
          has_timezone :is_disabled="helper.is_searching" />
        <span class="ml-4 font-weight-bold font-size-14">Data yang ditampilkan</span>
        <select-input v-model="data_type" :options="options.data_type" class="w-25 ml-3"
          :is_disabled="helper.is_searching" :test_id="`filter-data-type`" :ref="`filter-data-type`" />
      </div>
      <div>
        <table-report-by-payment :month="filter.month" :vehicle="filter.vehicle" :column="filter.column" has_timezone
          :timezone="filter.timezone" :type="filter.type.value ? filter.type.value : ''"
          :is_searching="helper.is_searching" @ready="processPayloadDownloadReport" ref="table_report"
          :get_report="processGetReport" />
      </div>
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