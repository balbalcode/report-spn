<script>
import constant_report from "~/constants/report";

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
  head: () => ({
    title: `Laporan Lainnya - Tiket Bermasalah | ${process.env.APP_TITLE}`
  }),
  data: () => ({
    report: {
      name: "",
      fields: constant_report.problem_ticket_report_header(),
      content: [],
      total: {
        officer_app: 0,
        dashboard: 0,
        system: 0
      },
    },
    filter: {
      date_range: [],
      problem_media: [],
      user: [],
      officer: []
    },
    helper: {
      is_searching: false,
      has_officer: false,
      has_user: false
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
            window.open(`/report/problem-ticket/print?date_range=${this.filter.date_range.join("_")}`, "_blank")
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
        this.$sentry.captureMessage(`${error.message} at passExportType in report/problem-ticket`)
      }
    },

    processGetPayloadFilter(value) {
      this.filter = value
      this.helper.is_searching = true
    },

    processPayloadDownloadReport(value) {
      this.report.content = value.content
      this.report.total = value.total
      this.helper.is_searching = false
    },

    processNamingReportFile() {
      let spot = this.$utility.getSelectedSpot()
      this.report.name = `Laporan Tiket Bermasalah ${spot.text} Bulan ${this.filter.month}`
    },

  },
  components: {
    Layout: () => import("@/layouts/main"),
    TableProblemTicketReport: () => import("@/components/organisms/report/problem-ticket/TableProblemTicketReport"),
    FilterReport: FilterReport,
    SquareCard: () => import("@utilities/atoms/card/SquareCard"),
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
        <div class="col-12 col-lg-7 px-0">
          <h4 class="text-dark d-inline mr-2 pt-2">
            Laporan Tiket Bermasalah
          </h4>
          <template v-if="!is_searching">
            <span class="d-inline-block badge-pill px-2 py-1 mr-2 badge-soft-pink">
              Dashboard {{ report.total.dashboard }}
            </span>
            <span class="d-inline-block badge-pill px-2 py-1 mr-2 badge-soft-blue">
              Aplikasi Petugas {{ report.total.officer_app }}
            </span>
            <span class="d-inline-block badge-pill px-2 py-1 mr-2 badge-soft-orange">
              Sistem {{ report.total.system }}
            </span>
          </template>
        </div>
        <div class="col-12 col-lg-5 text-right">
          <dropdown-button :options="options.type" text="Download Excel" position="right"
            :is_disabled="report.content.length < 1" @update="passExportType">
          </dropdown-button>
          <export-button :export_name="report.name" :fields="report.fields" :content="report.content" id="csv_button"
            :is_disabled="report.content.length < 1" additional_class="mt-2" style="display: none" />
        </div>
        <div class="col-12 px-1">
          <content-divider />
        </div>
        <div class="col-12 px-0">
          <filter-report :has_date_range="true" :has_user="true" :has_officer="true" :has_reason="true"
            has_problem_media :is_disabled="helper.is_searching" @update="processGetPayloadFilter" />
        </div>
        <div class="col-12 px-0">
          <table-problem-ticket-report :is_searching="helper.is_searching" :date_range="filter.date_range"
            :media="filter.problem_media" :user="filter.user" :officer="filter.officer" :reason="filter.reason"
            ref="table_shift_report" @ready="processPayloadDownloadReport" />
        </div>
      </div>
    </square-card>
  </layout>
</template>