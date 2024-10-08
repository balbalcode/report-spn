<script>
import constant_report from "~/constants/report";

let FilterReport = null;
try {
  FilterReport = () =>
    import("@/components/organisms/report/_shared/FilterReport");
} catch (error) {
  window.$nuxt.$utility.setErrorContextSentry(error);
  window.$nuxt.$sentry.captureMessage(
    `${error.message} at rendering filter-report in report/administration/index`
  );
  window.location.reload();
}

export default {
  head: () => ({
    title: `Laporan Membership - Administrasi | ${process.env.APP_TITLE}`
  }),
  components: {
    Layout: () => import("@/layouts/main"),
    TableAdministrationReportChangeIdentity: () => import("@/components/organisms/report/administration/table/TableAdministrationReportChangeIdentity"),
    TableAdministrationReportChange: () => import("@/components/organisms/report/administration/table/TableAdministrationReportChange"),
    TableAdministrationReportLost: () => import("@/components/organisms/report/administration/table/TableAdministrationReportLost"),
    TableAdministrationReportDeleteHistory: () => import('@/components/organisms/report/administration/table/TableAdministrationReportDeleteHistory.vue'),
    TableAdministrationReportDeleteMember: () => import('@/components/organisms/report/administration/table/TableAdministrationReportDeleteMember.vue'),
    TableAdministrationReportChangePeriod: () => import("@/components/organisms/report/administration/table/TableAdministrationReportChangePeriod"),
    FilterReport: FilterReport,
    ContentTitle: () => import("@utilities/atoms/title/ContentTitle"),
    ContentSpan: () => import("@utilities/atoms/utility/ContentSpan"),
    SquareCard: () => import("@utilities/atoms/card/SquareCard"),
    ContentDivider: () => import("@utilities/atoms/utility/ContentDivider"),
    DropdownButton: () => import("@utilities/atoms/button/DropdownButton"),
    ExportButton: () => import("@utilities/atoms/button/ExportButton")
  },
  data: () => ({
    filter: {
      administration_type: { value: "" }
    },
    helper: {
      is_searching: false,
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
            window.open(`/report/administration/print?month=${this.filter.month}&administration=${this.filter.administration_type}&name=${this.filter.name ?? ' '}&spot=${this.$utility.getSpotId()}`, "_blank")
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
        this.$sentry.captureMessage(`${error.message} at passExportType index administration report`)
      }
    },

    processLabelReport() {
      let values = []
      values.push(this.formatLabelDate())
      return values
    },

    formatServiceList() {
      return this.filter.service.map(item => item.value).join(',');
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
      if (!this.filter.administration_type || !this.filter.administration_type.value)
        this.helper.is_searching = false
    },


    processNamingReportFile() {
      let spot = this.$utility.getSelectedSpot()
      this.report.name = `Laporan Administrasi ${this.filter.administration_type.text} ${spot.text} Bulan ${this.filter.month}`
    },
    
    processTransformDataReport(data) {
      data = data.map((row) => {
        if(row.previous_card_id){
          return {
            ...row,
            previous_card_id: `'${row.previous_card_id}`,
            previous_rf_id: `'${row.previous_rf_id}`,
            updated_card_id: `'${row.updated_card_id}`,
            updated_rf_id: `'${row.updated_rf_id}`,
          };
        } else {
          return row;
        }
      });
      return  data
    },

    processPayloadDownloadReport(value) {
      this.helper.is_searching = false
      this.report = {
        fields: value.header,
        content: this.processTransformDataReport(value.content)
      }
    }
  }
}
</script>
<template>
  <layout title="Laporan Membership">
    <square-card :has_shadow="true">
      <b-row class="px-2">
        <b-col cols="12" lg="6" class="px-1">
          <content-title additional_class="mb-0 px-0 mx-0 pt-2" value="Laporan Administrasi" />
        </b-col>
        <b-col cols="12" lg="6" class="text-center text-lg-right mt-2 mt-lg-0">
          <dropdown-button :options="options.type" text="Download CSV (Excel)" position="right"
            :is_disabled="report.content.length < 1" @update="passExportType" />
          <export-button :export_name="report.name" :fields="report.fields" :content="report.content" id="csv_button"
            :is_disabled="report.content.length < 1" additional_class="mt-2" style="display: none" />
        </b-col>
        <b-col cols="12" class="px-1">
          <content-divider />
        </b-col>
        <b-col cols="12" class="px-1 mb-3">
          <filter-report :has_period="true" :has_spot="true" :has_administration_type="true"
            @update="processGetPayloadFilter" :is_disabled="helper.is_searching" :is_not_update_init="true" />
        </b-col>
        <b-col cols="12" class="px-0">
          <table-administration-report-change-identity :month="filter.month" :administration="filter.administration_type"
            :is_searching="helper.is_searching" @ready="processPayloadDownloadReport"
            v-if="filter.administration_type.value === 'IDENTITY_CHANGE'" ref="table_administration_report_change" />
          <table-administration-report-change :month="filter.month" :administration="filter.administration_type"
            :is_searching="helper.is_searching" @ready="processPayloadDownloadReport"
            v-else-if="filter.administration_type.value === 'DATA_CHANGE'" ref="table_administration_report_change" />
          <table-administration-report-lost :month="filter.month" :administration="filter.administration_type"
            :is_searching="helper.is_searching" @ready="processPayloadDownloadReport"
            v-else-if="filter.administration_type.value === 'LOST_CARD'" ref="table_administration_report_lost" />
          <table-administration-report-delete-history :month="filter.month" :administration="filter.administration_type"
            :is_searching="helper.is_searching" @ready="processPayloadDownloadReport"
            v-else-if="filter.administration_type.value === 'DELETE_MEMBERSHIP_HISTORY'"
            ref="table_administration_report_delete_history" />
          <table-administration-report-delete-member :month="filter.month" :administration="filter.administration_type"
            :is_searching="helper.is_searching" @ready="processPayloadDownloadReport"
            v-else-if="filter.administration_type.value === 'DELETE_MEMBERSHIP'"
            ref="table_administration_report_delete_member" />
          <table-administration-report-change-period :month="filter.month" :administration="filter.administration_type"
            :is_searching="helper.is_searching" @ready="processPayloadDownloadReport"
            v-else-if="filter.administration_type.value === 'CHANGE_PERIOD'" ref="table_administration_report_change" />
          <content-span v-else :has_animation="false" caption="Silakan pilih filter untuk melihat laporan "
            image="empty.png" />
        </b-col>
      </b-row>
    </square-card>
  </layout></template>
