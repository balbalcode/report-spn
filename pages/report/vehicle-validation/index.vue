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
    `${error.message} at rendering filter-report in report/vehicle-validation/index`
  );
  window.location.reload();
}

export default {
  head: () => ({
    title: `Laporan Parkir - Validasi Kendaraan | ${process.env.APP_TITLE}`
  }),
  data: () => ({
    report: {
      name: "",
      month: "",
      fields: constant_report.vehicle_validation_report_header(),
      content: []
    },
    filter: {
      month: "",
      transaction_type: {},
      gate_type: {}
    },
    modal: {
      request_download: false
    },
    helper: {
      is_searching: false,
      is_not_empty: false
    },
    options: {
      type: constant_report.type(),
    }
  }),
  methods: {
    ...reportMethods,

    resetIsSearching(total_data) {
      if (!this.filter.transaction_type.value && !this.filter.gate_type.value)
        this.helper.is_not_empty = total_data > 0
      this.helper.is_searching = false
    },

    toggleModalRequestDownload() {
      this.modal.request_download = !this.modal.request_download
    },

    processGetPayloadFilter(value) {
      this.filter.month = value.month ?? ""
      this.filter.transaction_type = value.transaction_type ?? {}
      this.filter.gate_type = value.gate_type ?? {}
      this.helper.is_searching = true
    },
  },
  components: {
    Layout: () => import("@/layouts/main"),
    TableVehicleValidationReport: () => import("@/components/organisms/report/vehicle-validation/TableVehicleValidationReport"),
    FormRequestVehicleValidationReport: () => import("@/components/organisms/report/vehicle-validation/FormRequestVehicleValidationReport"),
    FilterReport: FilterReport,
    SquareCard: () => import("@utilities/atoms/card/SquareCard"),
    ContentTitle: () => import("@utilities/atoms/title/ContentTitle"),
    PlainModal: () => import("@utilities/atoms/modal/PlainModal"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
    ContentDivider: () => import("@utilities/atoms/utility/ContentDivider")
  },
}
</script>

<template>
  <layout title="Laporan Parkir">
    <square-card has_shadow>
      <div class="row px-2">
        <div class="col-12 col-lg-6 px-0">
          <content-title additional_class="mb-0 px-0 mx-0 pt-2" value="Laporan Validasi Kendaraan" />
        </div>
        <div class="col-12 col-lg-6 px-0 text-center text-lg-right mt-2 mt-lg-0">
          <active-button text="Kirim Laporan (Excel)" @click="toggleModalRequestDownload()" />
        </div>
        <div class="col-12 px-1">
          <content-divider />
        </div>
        <div class="col-12 px-0">
          <filter-report has_period has_transaction_type @update="processGetPayloadFilter"
            :is_disabled="helper.is_searching" />
        </div>
        <div class="col-12 px-0">
          <table-vehicle-validation-report :is_searching="helper.is_searching" :month="filter.month"
            :gate_type="filter.gate_type" :transaction_type="filter.transaction_type" @ready="resetIsSearching" />
        </div>
      </div>
    </square-card>

    <plain-modal size="md" v-model="modal.request_download">
      <form-request-vehicle-validation-report @close="toggleModalRequestDownload"/>
    </plain-modal>
  </layout>
</template>