<script>
import constant_report from "~/constants/report";

let FilterReport = null;
try {
  FilterReport = () =>
    import("@/components/organisms/report/_shared/FilterReport");
} catch (error) {
  window.$nuxt.$utility.setErrorContextSentry(error);
  window.$nuxt.$sentry.captureMessage(
    `${error.message} at rendering filter-report in report/overstay/old/index`
  );
  window.location.reload();
}

export default {
  head: () => ({
    title: `Laporan Lainnya - Parkir Inap | ${process.env.APP_TITLE}`
  }),
  data: () => ({
    report: {
      name: "",
      fields: {},
      content: []
    },
    filter: {
      value: "",
    },
    helper: {
      is_searching: false,
    },
    options: {
      type: constant_report.type()
    }
  }),
  watch: {
    report: {
      deep: true,
      handler() {
        this.processNamingReportFile()
      }
    }
  },
  methods: {
    passExportType(value) {
      try {
        switch (value) {
          case 'PDF':
            window.open(`/report/overstay/print?month=${this.filter.month}`, "_blank")
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
        this.$sentry.captureMessage(`${error.message} at passExportType in report/overstay`)
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
      this.report.name = `Laporan Parkir Inap ${spot.text} Bulan ${this.filter.month}`
    },

  },
  components: {
    Layout: () => import("@/layouts/main"),
    TableOverstayReport: () => import("@/components/organisms/report/overstay/TableOverstayReport"),
    FilterReport,
    SquareCard: () => import("@utilities/atoms/card/SquareCard"),
    ContentTitle: () => import("@utilities/atoms/title/ContentTitle"),
    ExportButton: () => import("@utilities/atoms/button/ExportButton"),
    DropdownButton: () => import("@utilities/atoms/button/DropdownButton"),
    ContentDivider: () => import("@utilities/atoms/utility/ContentDivider"),
  },
}
</script>

<template>
  <layout title="Laporan Parkir">
    <square-card has_shadow>
      <div class="row px-2">
        <div class="col-12 col-lg-6 px-0">
          <content-title additional_class="mb-0 px-0 mx-0 pt-2" value="Laporan Parkir Inap"/>
        </div>
        <div class="col-12 col-lg-6 text-center text-lg-right mt-2 mt-lg-0">
          <dropdown-button :options="options.type" text="Download CSV (Excel)" position="right"
                           :is_disabled="report.content.length < 1" @update="passExportType" >
          </dropdown-button>
          <export-button :export_name="report.name" :fields="report.fields" :content="report.content"
                         id="csv_button" :is_disabled="report.content.length < 1" additional_class="mt-2"
                         style="display: none"/>
        </div>
        <div class="col-12 px-1">
          <content-divider/>
        </div>
        <div class="col-12 px-0">
          <filter-report :has_reset_button="true" :has_period="true" @update="processGetPayloadFilter" :is_disabled="helper.is_searching"/>
        </div>
        <div class="col-12 px-0">
          <table-overstay-report :is_searching="helper.is_searching" :month="filter.month"
                                 ref="table_shift_report" @ready="processPayloadDownloadReport"/>
        </div>
      </div>
    </square-card>
  </layout>
</template>
