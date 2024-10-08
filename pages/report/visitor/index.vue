<script>
import constant_report from "~/constants/report";
let FilterReport = null;
try {
  FilterReport = () =>
    import("@/components/organisms/report/_shared/FilterReport");
} catch (error) {
  window.$nuxt.$utility.setErrorContextSentry(error);
  window.$nuxt.$sentry.captureMessage(
    `${error.message} at rendering filter-report in report/visitor/index`
  );
  window.location.reload();
}
export default {
  head: () => ({
    title: `Laporan Lainnya - Transaksi Parkir | ${process.env.APP_TITLE}`
  }),
  data: () => ({
    report: {
      name: "",
      fields: {},
      content: []
    },
    filter :{
      date  :""
    },
    options: {
      type: constant_report.type()
    },
    helper: {
      is_searching: false,
    },
  }),
  watch: {
    report: {
      deep: true,
      handler() {
        this.processNamingReportFile()
      }
    },
  },
  methods: {
    passExportType(value) {
      try {
        switch (value) {
          case 'PDF':
            window.open(`/report/visitor/print?date=${this.filter.date}&spot=${this.$utility.getSpotId()}`, "_blank")
            return
          case 'CSV':
            document.getElementById("csv_button").click()
            return;
          default:
            alert(value)
            return
        }
      } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at passExportType in report/visitor`)
      }
    },

    processGetPayloadFilter(value) {
      this.filter = value
      this.helper.is_searching = true
    },

    processPayloadDownloadReport(value) {
      this.helper.is_searching = false
      this.report.fields = value.header
      this.report.content = value.content
    },

    processNamingReportFile() {
      let spot = this.$utility.getSelectedSpot()
      this.report.name = `Laporan Pengunjung ${spot.text} ${this.filter.date}`
    },

  },
  components: {
    Layout: () => import("@/layouts/main"),
    TableVisitorReport: () => import("@/components/organisms/report/visitor/TableVisitorReport"),
    FilterReport: FilterReport,
    SquareCard: () => import("@utilities/atoms/card/SquareCard"),
    ContentTitle: () => import("@utilities/atoms/title/ContentTitle"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
    DropdownButton: () => import("@utilities/atoms/button/DropdownButton"),
    ExportButton: () => import("@utilities/atoms/button/ExportButton"),
    ContentDivider: () => import("@utilities/atoms/utility/ContentDivider"),
  },
}
</script>

<template>
  <layout title="Laporan Parkir">
    <square-card has_shadow>
      <div class="row px-2">
        <div class="col-12 col-lg-6 px-0">
          <content-title additional_class="mb-0 px-0 mx-0 pt-2" value="Laporan Pengunjung"/>
        </div>
        <b-col cols="12" lg="6" class="text-center text-lg-right mt-2 mt-lg-0">
          <dropdown-button :options="options.type" text="Download CSV (Excel)" position="right"
                           :is_disabled="report.content.length < 1" @update="passExportType"/>
          <export-button :export_name="report.name" :fields="report.fields" :content="report.content" id="csv_button"
                         :is_disabled="report.content.length < 1" additional_class="mt-2" style="display: none"/>
        </b-col>
        <b-col cols="12" class="px-1">
          <content-divider/>
        </b-col>
        <div class="col-12 px-0">
          <filter-report :has_date="true" :has_reset_button="false"  @update="processGetPayloadFilter" :is_disabled="helper.is_searching" />
        </div>
        <div class="col-12 px-0">
          <table-visitor-report :is_searching="helper.is_searching" :date="filter.date" 
            ref="table_transaction_report" @ready="processPayloadDownloadReport" />
        </div>
      </div>
    </square-card>
  </layout>
</template>