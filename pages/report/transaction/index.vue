<script>
import {transactionMethods, finderMethods} from "~/store/helperActions";

let FilterReport = null;
try {
  FilterReport = () =>
    import("@/components/organisms/report/_shared/FilterReport");
} catch (error) {
  window.$nuxt.$utility.setErrorContextSentry(error);
  window.$nuxt.$sentry.captureMessage(
    `${error.message} at rendering filter-report in report/transaction/index`
  );
  window.location.reload();
}

export default {
  head: () => ({
    title: `Laporan Parkir - Transaksi Parkir | ${process.env.APP_TITLE}`
  }),
  data: () => ({
    filter: {
      date: "",
      time_range: "",
      product: "",
      vehicle: "",
      transaction_status: "",
      officer: "",
    },
    helper: {
      is_searching: false,
    },
    modal: {
      modal_request: false
    },
    selected_data: {}
  }),
  methods: {
    ...transactionMethods,
    ...finderMethods,

    passDataToDetail(data) {
      this.selected_data = data
    },

    toggleModalRequest() {
      this.modal.modal_request = !this.modal.modal_request
    },

    processGetPayloadFilter(value) {
      if (value.date) this.filter.date = value.date
      if (value.time_range) this.filter.time_range = value.time_range
      if (value.product) this.filter.product = value.product
      if (value.vehicle) this.filter.vehicle = value.vehicle
      if (value.transaction_status) this.filter.transaction_status = value.transaction_status
      if (value.officer) this.filter.officer = value.officer
      this.toggleIsSearching(true)
    },

    toggleIsSearching(value) {
      this.helper.is_searching = value
    },
  },
  components: {
    Layout: () => import("@/layouts/main"),
    TableTransactionReport: () => import("@/components/organisms/report/transaction/TableTransactionReport"),
    FormRequestTransactionReport: () => import("@/components/organisms/report/transaction/FormRequestTransactionReport"),
    TableLog: () => import("@/components/organisms/resolution-center/TableLog"),
    TableDetailResolution: () => import("@/components/organisms/resolution-center/TableDetailResolution"),
    ParkingImageDetail: () => import("@/components/organisms/resolution-center/ParkingImageDetail"),
    FilterReport: FilterReport,
    SquareCard: () => import("@utilities/atoms/card/SquareCard"),
    ContentTitle: () => import("@utilities/atoms/title/ContentTitle"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
    ContentDivider: () => import("@utilities/atoms/utility/ContentDivider"),
    PlainModal: () => import("@utilities/atoms/modal/PlainModal"),
  },
}
</script>

<template>
  <layout title="Laporan Parkir">
    <square-card has_shadow>
      <div class="row px-2">
        <div class="col-12 col-lg-6 px-0">
          <content-title additional_class="mb-0 px-0 mx-0 pt-2" value="Laporan Transaksi Parkir"/>
        </div>
        <div class="col-12 col-lg-6 px-0 text-right">
          <active-button id="download_button" text="Kirim Laporan (Excel)"
            text_color="text-white" @click="toggleModalRequest"/>
        </div>
        <div class="col-12 px-1">
          <content-divider/>
        </div>
        <div class="col-12 px-0">
          <filter-report has_date has_time_range has_product has_non_member has_vehicle has_transaction_status
            has_officer is_single_officer @update="processGetPayloadFilter" :is_disabled="helper.is_searching"/>
        </div>
        <div class="col-12 px-0">
          <table-transaction-report :date="filter.date" :time_range="filter.time_range" :product="filter.product"
            :vehicle="filter.vehicle" :status="filter.transaction_status" :officer="filter.officer"
            :is_searching="helper.is_searching" ref="table_transaction_report"
            @searching="toggleIsSearching" @detail="passDataToDetail"/>
        </div>
      </div>
    </square-card>
    <square-card v-if="selected_data.id" :has_shadow="true" additional_class="mt-3">
      <parking-image-detail :data="selected_data.image_list"/>
      <table-log :id="selected_data.id" :get_logs="getTransactionLog" log_name="Transaksi"/>
      <table-log v-if="selected_data.ref_id" :id="selected_data.ref_id" :get_logs="getFinderLog" log_name="Finder"/>
    </square-card>
    <plain-modal v-model="modal.modal_request">
      <form-request-transaction-report @cancel="toggleModalRequest" />
    </plain-modal>
  </layout>
</template>