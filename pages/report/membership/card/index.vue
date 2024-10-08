<script>
import constant_report from "~/constants/report";
let FilterReport = null;
try {
  FilterReport = () =>
    import("@/components/organisms/report/_shared/FilterReport");
} catch (error) {
  window.$nuxt.$utility.setErrorContextSentry(error);
  window.$nuxt.$sentry.captureMessage(
    `${error.message} at rendering filter-report in report/membership/gate/index`
  );
  window.location.reload();
}

export default {
  head: () => ({
    title: `Laporan Membership - Membership Kartu | ${process.env.APP_TITLE}`
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
    TableMembershipCardReport: () => import("@/components/organisms/report/membership/card/TableMembershipCardReport"),
  },
  data: () => ({
    filter: {},
    helper: {
      is_searching: false
    },
    report: {
      name: "",
      fields: constant_report.membership_card_report(),
      content: []
    },
    options: {
      type: constant_report.type(),
      column: constant_report.casual_quantity_column()
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
            window.open(`/report/membership/plate/print?month=${this.filter.month}&user=${this.filter.user}&product=${this.filter.product}&spot=${this.$utility.getSpotId()}`, "_blank")
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
        this.$sentry.captureMessage(`${error.message} at passExportType in report/membership/card`)
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
      this.report.name = `Laporan Membership Plat ${spot.text} Bulan ${this.filter.month}`
    },

    processPayloadDownloadReport(value) {
      this.helper.is_searching = false
      this.processTransformDataReport(value.content)
    },

    processTransformDataReport(data) {
      data = data.map((row) => {
        if(row.rf_id){
          return {
            ...row,
            rf_id: `'${row.rf_id}`,
            printed_id: `'${row.printed_id}`,
          };
        } else {
          return row
        }
      });
      this.report.content = data
    },
  }
}
</script>
<template>
  <layout title="Laporan Membership">
    <square-card :has_shadow="true">
      <b-row class="px-2">
        <b-col cols="12" lg="6" class="px-1">
          <content-title additional_class="mb-0 px-0 mx-0 pt-2" value="Laporan Membership Kartu"/>
        </b-col>
        <b-col cols="12" lg="6" class="text-center text-lg-right mt-2 mt-lg-0">
          <dropdown-button :options="options.type" text="Download CSV (Excel)" position="right"
                           :is_disabled="report.content.length < 1" @update="passExportType"/>
          <export-button :export_name="report.name" :fields="report.fields" :content="report.content" id="csv_button"
                         :is_disabled="report.content.length < 1" additional_class="mt-2" style="display: none"/>
        </b-col>
        <b-col cols="12" class="px-1">
          <content-divider/>
        </b-col>
        <b-col cols="12" class="px-1 mb-3">
          <filter-report :has_product="true" :has_period="true" :has_user="true" :is_disabled="helper.is_searching"
                         :option_column="options.column" @update="processGetPayloadFilter" open_on_init has_all_member/>
        </b-col>
        <b-col cols="12" class="px-0">
          <table-membership-card-report :month="filter.month" :product="filter.product" :user="filter.user"
                                        @ready="processPayloadDownloadReport" :is_searching="helper.is_searching"
                                        ref="table_membership_card_report"/>
        </b-col>
      </b-row>
    </square-card>
  </layout>
</template>