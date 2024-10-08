<script>
import { download_types } from "~/constants/v3.report";
import { v3reportMethods } from "@/store/helperActions"

let FilterReport = null;
try {
  FilterReport = () =>
    import("@/components/organisms/report/_shared/FilterReport");
} catch (error) {
  window.$nuxt.$utility.setErrorContextSentry(error);
  window.$nuxt.$sentry.captureMessage(
    `${error.message} at rendering filter-report in report/duration/index`
  );
  window.location.reload();
}

export default {
  head: () => ({
    title: `Laporan Durasi Parkir | ${process.env.APP_TITLE}`,
  }),
  components: {
    Layout: () => import("@/layouts/main"),
    FilterReport: FilterReport,
    TableDurationReport: () => import("@/components/organisms/report/duration/TableDurationReport"),
    FormRequestDurationReport: () => import("@/components/organisms/report/duration/FormRequestDurationReport"),
    PlainModal: () => import("@utilities/atoms/modal/PlainModal"),
    SquareCard: () => import("@utilities/atoms/card/SquareCard"),
    ContentTitle: () => import("@utilities/atoms/title/ContentTitle"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
    ContentDivider: () => import("@utilities/atoms/utility/ContentDivider"),
  },
  data: () => ({
    filter: {
      date_range: [],
      product: "",
      vehicle: "",
    },
    helper: {
      is_searching: false,
      filter_disabled: false
    },
    report: {
      name: "",
      fields: {},
      content: []
    },
    options: {
      type: download_types(),
      column: []
    },
    modal: {
      request_download: false
    },
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
    ...v3reportMethods,

    toggleDisableFilter(disabled) {
      this.helper.filter_disabled = disabled
    },

    toggleModalRequestDownload() {
      this.modal.request_download = !this.modal.request_download
    },

    processGetPayloadFilter(value) {
      this.filter.date_range = value.date_range
      this.filter.product = value.product
      this.filter.vehicle = value.vehicle
      this.helper.is_searching = true
    },

    processNamingReportFile() {
      let spot = this.$utility.getSelectedSpot()
      this.report.name = `Laporan Kuantitas Per Durasi ${spot.text} Bulan ${this.filter.date_range}`
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
  <layout title="Laporan Parkir">
    <square-card :has_shadow="true">
      <b-row class="px-2">
        <b-col cols="12" lg="6" class="px-1">
          <content-title additional_class="mb-0 px-0 mx-0 pt-2" value="Laporan Durasi Parkir"/>
        </b-col>
        <b-col cols="12" lg="6" class="text-right">
          <active-button text="Kirim Laporan (Excel)" @click="toggleModalRequestDownload()" />
        </b-col>
        <b-col cols="12" class="px-1">
          <content-divider/>
        </b-col>
        <b-col cols="12" class="px-1 mb-3">
          <filter-report has_vehicle has_product has_date_range has_non_member has_all_member is_single_product
            is_not_update_init :is_disabled="helper.filter_disabled || helper.is_searching" @update="processGetPayloadFilter"
            ref="filter-report" id="table-duration-report"/>
        </b-col>
        <b-col cols="12" class="px-0">
          <table-duration-report :vehicle="filter.vehicle" :product="filter.product" :date_range="filter.date_range"
            :is_searching="helper.is_searching" @ready="processPayloadDownloadReport"
            @loadingBatch="toggleDisableFilter" ref="table-duration-report"/>
        </b-col>
      </b-row>
    </square-card>

    <plain-modal size="lg" v-model="modal.request_download">
      <form-request-duration-report @close="toggleModalRequestDownload"/>
    </plain-modal>
  </layout>
</template>