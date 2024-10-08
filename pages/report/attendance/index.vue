<script>
import { reportMethods } from "@/store/helperActions";
import constant_report from "~/constants/report";

let FilterReport = null;
try {
  FilterReport = () =>
    import("@/components/organisms/report/_shared/FilterReport");
} catch (error) {
  window.$nuxt.$utility.setErrorContextSentry(error);
  window.$nuxt.$sentry.captureMessage(
    `${error.message} at rendering filter-report in report/attendance/index`
  );
  window.location.reload();
}

export default {
  head: () => ({
    title: `Laporan Absensi - Masuk | ${process.env.APP_TITLE}`
  }),
  data: () => ({
    report: {
      name: "",
      month: "",
      fields: constant_report.attendance_report_header(),
      content: []
    },
    filter: {
      month: "",
      officer: []
    },
    helper: {
      is_loading: false,
      is_not_empty: false,
      is_searching: false,
      is_ready_download: false,
    },
    options: {
      type: constant_report.type(),
    }
  }),
  watch: {
    'helper.is_ready_download': {
      handler(value) {
        if (value) {
          document.getElementById("csv_button").click()
          this.helper.is_ready_download = false
        }
      }
    },
  },
  methods: {
    ...reportMethods,
    
    async passExportType(value) {
      try {
        switch (value) {
          case 'PDF':
            return
          case 'CSV': {
            await this.processDowloadReport()
            return;
          }
          default:
            alert(value)
            return
        }
      } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at passExportType in report/attendance`)
      }
    },

    setPayloadGetFullReport() {
      let payload = {
        filter: [
          { key: 'page', value: 0 },
          { key: 'per_page', value: 0 },
          { key: 'month', value: this.filter.month ?? "" },
          { key: 'spot_id', value: this.$utility.getSpotId() },
        ],
      };
      return payload
    },

    setFullReport(data) {
      let spot = this.$utility.getSelectedSpot()
      this.report.name = `Laporan Absensi ${spot.text} Bulan ${this.filter.month}`
      this.report.month = this.filter.month
      this.report.content = this.$refs.attendance_report.formatContentReport(data)
    },

    resetIsSearching(total_data) {
      this.helper.is_not_empty = total_data > 0
      this.helper.is_searching = false
    },

    processGetPayloadFilter(value) {
      this.filter.month = value.month ?? ""
      this.filter.officer = value.officer ?? {}
      this.helper.is_searching = true
    },

    async processDowloadReport() {
      if (!this.report.content.length || this.report.month !== this.filter.month) {
        await this.processGetFullReport()
      }
      this.helper.is_ready_download = true
    },

    async processGetFullReport() {
      this.helper.is_loading = true
      try {
        let data = await this.getAttendanceReport(this.setPayloadGetFullReport())
        this.setFullReport(data.rows)
      } catch (error) {
        this.report.content = []
      }
      this.helper.is_loading = false
    }
  },
  components: {
    Layout: () => import("@/layouts/main"),
    TableAttendanceReport: () => import("@/components/organisms/report/attendance/TableAttendanceReport"),
    FilterReport: FilterReport,
    SquareCard: () => import("@utilities/atoms/card/SquareCard"),
    ContentTitle: () => import("@utilities/atoms/title/ContentTitle"),
    DropdownButton: () => import("@utilities/atoms/button/DropdownButton"),
    ExportButton: () => import("@utilities/atoms/button/ExportButton"),
    PlainModal: () => import("@utilities/atoms/modal/PlainModal"),
    ContentSpan: () => import("@utilities/atoms/utility/ContentSpan"),
    ContentDivider: () => import("@utilities/atoms/utility/ContentDivider")
  },
}
</script>

<template>
  <layout title="Laporan Absensi">
    <square-card has_shadow>
      <div class="row px-2">
        <div class="col-12 col-lg-6 px-0">
          <content-title additional_class="mb-0 px-0 mx-0 pt-2" value="Laporan Masuk"/>
        </div>
        <div class="col-12 col-lg-6 px-0 text-center text-lg-right mt-2 mt-lg-0">
          <dropdown-button :options="options.type" text="Download CSV (Excel)" position="right"
            :is_disabled="!helper.is_not_empty" @update="passExportType" />
          <export-button :export_name="report.name" :fields="report.fields" :content="report.content" id="csv_button"
            :is_disabled="!helper.is_not_empty" additional_class="mt-2" style="display: none"/>
        </div>
        <div class="col-12 px-1">
          <content-divider/>
        </div>
        <div class="col-12 px-0">
          <filter-report has_period has_officer is_single_officer @update="processGetPayloadFilter" :is_disabled="helper.is_searching"/>
        </div>
        <div class="col-12 px-0">
          <table-attendance-report :is_searching="helper.is_searching" :month="filter.month" :officer="filter.officer"
            @ready="resetIsSearching" ref="attendance_report"/>
        </div>
      </div>
    </square-card>

    <plain-modal size="md" v-model="helper.is_loading">
      <div class="d-flex">
        <content-span/>
      </div>
    </plain-modal>
  </layout>
</template>