<script>
import constant_report from "~/constants/report";
let FilterReport = null;
try {
  FilterReport = () =>
    import("@/components/organisms/report/_shared/FilterReport");
} catch (error) {
  window.$nuxt.$utility.setErrorContextSentry(error);
  window.$nuxt.$sentry.captureMessage(
    `${error.message} at rendering filter-report in report/counter/index`
  );
  window.location.reload();
}

export default {
  head: () => ({
    title: `Laporan Keuangan`
  }),
  components: {
    ContentTitle: () => import("@utilities/atoms/title/ContentTitle"),
    Layout: () => import("@/layouts/main"),
    DropdownButton: () => import("@utilities/atoms/button/DropdownButton"),
    TableOfficer: () => import("@/components/organisms/spot/officer/TableOfficer"),
    SquareCard: () => import("@utilities/atoms/card/SquareCard"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
    ContentDivider: () => import("@utilities/atoms/utility/ContentDivider"),
    FilterReport: FilterReport,
    ExportButton: () => import("@utilities/atoms/button/ExportButton"),
    TableCounterReport: () => import("@/components/organisms/report/counter/TableCounterReport"),
  },
  data: () => ({
    filter: {},
    helper: {
      is_searching: false
    },
    report: {
      name: "",
      fields: {},
      content: []
    },
    options: {
      type: constant_report.type(),
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
            window.open(`/report/counter/print?month=${this.filter.month}&vehicle=${this.$utility.formatListParameterPayload(this.filter.vehicle, 'value')}&alias=${this.$utility.formatListParameterPayload(this.filter.vehicle, 'alias')}&spot=${this.$utility.getSpotId()}`, "_blank")
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
        this.$sentry.captureMessage(`${error.message} at passExportType in index report casual income`)
      }
    },

    processLabelReport() {
      let values = []
      values.push(this.formatLabelDate())
      return values
    },

    formatLabelDate() {
      return {
        value: this.$utility.formatDateMoment(this.filter.month, "MMM-YYYY"),
        text: "Periode"
      }
    },

    processGetPayloadFilter(value) {
      this.filter = value
      this.helper.is_searching = true
    },

    processNamingReportFile() {
      let spot = this.$utility.getSelectedSpot()
      this.report.name = `Laporan Counter ${spot.text} Bulan ${this.filter.month}`
    },

    processPayloadDownloadReport(value) {
      this.helper.is_searching = false
      this.report = {
        fields: value.header,
        content: value.content
      }
    }
  }
}
</script>
<template>
  <layout title="Laporan Keuangan">
    <square-card :has_shadow="true">
      <b-row class="px-2">
        <b-col cols="12" lg="6" class="px-1">
          <content-title additional_class="mb-0 px-0 mx-0 pt-2" value="Laporan Counter"/>
        </b-col>
        <b-col cols="12" lg="6" class="text-center text-lg-right mt-2 mt-lg-0">
          <dropdown-button :options="options.type" text="Download CSV (Excel)" position="right"
                           :is_disabled="report.content.length < 1" @update="passExportType" />
          <export-button :export_name="report.name" :fields="report.fields" :content="report.content" id="csv_button"
                         :is_disabled="report.content.length < 1" additional_class="mt-2" style="display: none"/>
        </b-col>
        <b-col cols="12" class="px-1">
          <content-divider/>
        </b-col>
        <b-col cols="12" class="px-1 mb-3">
          <filter-report :has_vehicle="true" :has_period="true" :has_spot="true" @update="processGetPayloadFilter" :is_disabled="helper.is_searching"/>
        </b-col>
        <b-col cols="12" class="px-0">
          <table-counter-report :month="filter.month" :vehicle="filter.vehicle" :is_searching="helper.is_searching"
                                @ready="processPayloadDownloadReport" ref="table_counter_report"/>
        </b-col>
      </b-row>
    </square-card>
  </layout>
</template>
