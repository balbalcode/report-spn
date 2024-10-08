<template>
  <layout title="Laporan Lainnya">
    <square-card :has_shadow="true">
      <div class="row px-2">
        <div class="col-12 col-lg-6 px-1">
          <content-title additional_class="mb-0 px-0 mx-0 pt-2" value="Laporan Palang Pintu"/>
        </div>
        <div class="col-12 col-lg-6 text-center text-lg-right mt-2 mt-lg-0">
          <dropdown-button :options="options.type" text="Download" position="right"
            :is_disabled="report.content.length < 1" @update="passExportType"/>
          <export-button :export_name="report.name" :fields="report.fields" :content="report.content" id="csv_button"
            :is_disabled="report.content.length < 1" additional_class="mt-2" style="display: none"/>
        </div>
        <div class="col-12 px-1">
          <content-divider/>
        </div>
        <div class="col-12 px-1 mb-3">
          <filter-report :has_period="true" :option_column="options.column" @update="passUpdateFilter" :is_disabled="helper.is_searching"/>
        </div>
        <div class="col-12 px-0">
          <table-gate-open-report :month="filter.month" :page="pagination.current_page" :per_page="pagination.per_page"
            :is_searching="helper.is_searching" @ready="processPayloadDownloadReport"/>
        </div>
        <div class="col-12 text-right">
          <card-pagination-view :per_page="pagination.per_page" :total_data="pagination.total_data"
            additional_class="mt-3 " :current_page="pagination.current_page" @update="passUpdatePagination"/>
        </div>
      </div>
    </square-card>
  </layout>
</template>

<script>
import report_constants from "@/constants/report"
let FilterReport = null;
try {
  FilterReport = () =>
    import("@/components/organisms/report/_shared/FilterReport");
} catch (error) {
  window.$nuxt.$utility.setErrorContextSentry(error);
  window.$nuxt.$sentry.captureMessage(
    `${error.message} at rendering filter-report in report/gate-open/index`
  );
  window.location.reload();
}
export default {
  head: () => ({
    title: `Laporan Lainnya - Palang Pintu | ${process.env.APP_TITLE}`,
  }),
  components: {
    Layout: () => import("@/layouts/main"),
    TableGateOpenReport: () => import("@/components/organisms/report/gate-open/TableGateOpenReport"),
    FilterReport: FilterReport,
    CardPaginationView: () => import("@utilities/molecules/card-view/CardPaginationView"),
    SquareCard: () => import("@utilities/atoms/card/SquareCard"),
    ContentDivider: () => import("@utilities/atoms/utility/ContentDivider"),
    ContentTitle: () => import("@utilities/atoms/title/ContentTitle"),
    ExportButton: () => import("@utilities/atoms/button/ExportButton"),
    DropdownButton: () => import("@utilities/atoms/button/DropdownButton")
  },
  data: () => ({
    filter: {
      month: "",
    },
    helper: {
      is_searching: false,
    },
    report: {
      name: "",
      content: [],
      fields: report_constants.gate_open_fields()
    },
    pagination: {
      current_page: 1,
      per_page: 20,
      total_data: 0
    },
    options: {
      type: [{ value: "CSV", text: "Download Excel" }],
    },
  }),
  methods:{
    passExportType(value) {
      try {
        switch (value) {
          case 'CSV':
            document.getElementById("csv_button").click()
            return;
          default:
            alert(value)
            return
        }
      } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at passExportType in report/gate-open`)
      }
    },

    passUpdatePagination(page) {
      this.pagination.current_page = page
      this.helper.is_searching = true
    },

    passUpdateFilter(value) {
      this.filter.month = value.month
      this.passUpdatePagination(1)
    },

    processPayloadDownloadReport(value) {
      this.pagination.total_data = value.total_data
      this.report.content = value.content
      this.report.name = value.name
      this.helper.is_searching = false
    }
  }
};
</script>
