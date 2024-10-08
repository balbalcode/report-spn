<template>
  <layout title="Laporan Absensi">
    <square-card :has_shadow="true">
      <content-header-view title_text="Laporan Izin" additional_class="border-bottom py-lg-2 mb-3">
        <template #right-side>
          <active-button @click="processDownloadReport()" text="Download .CSV (Excel)"
            :is_disabled="!report.content.length" icon="bx bxs-cloud-download" icon_size="16" align="rtl" />
          <export-button :export_name="report.name" :fields="report.fields" :content="report.content"
            :id="`${id}__btn-download`" :is_disabled="report.content.length < 1" additional_class="mt-2"
            style="display: none" />
        </template>
      </content-header-view>
      <filter-report is_not_update_init has_period has_officer is_single_officer has_leave_type
        :is_disabled="helper.is_searching" @update="setFilter" :id="`${id}__filter`" :ref="`${id}__filter`" />
      <div class="mt-2">
        <table-leave-report ref="table-leave-report" :selected="selected" :is_searching="helper.is_searching"
          :month="filter.month" :officer="filter.officer" :leave_type="filter.leave_type"
          :leave_reason="filter.leave_reason" @approval="setSelectedToApproval" @preview="setSelectedToPreview"
          @ready="setDownloadReport" />
      </div>
    </square-card>
    <plain-modal v-model="modal.approval" @close="setSelectedToApproval" size="md" :test_id="`${id}__modal-approval`">
      <content-title :value="`${selected.action == '1_APPROVED' ? 'Terima' : 'Tolak'} Izin`"
        :test_id="`${id}__modal-approval__title`" :ref="`${id}__modal-approval__title`" />
      <p>Berikan alasan Anda {{ selected.action == '1_APPROVED' ? 'menerima' : 'menolak' }} izin</p>
      <input-textarea-group v-model="form.note" label="Note" placeholder="Masukkan note..." is_submitted
        :test_id="`${id}__modal-approval__note`" :ref="`${id}__modal-approval__note`" />
      <div class="text-right">
        <active-button @click="setSelectedToApproval()" additional_class="mt-2 px-4" text="Batal" type="outline"
          variant="secondary" :test_id="`${id}__modal-approval__btn-cancel`" :ref="`${id}__modal-approval__btn-cancel`" />
        <disabled-buttou v-if="helper.is_loading" additional_class="mt-2 px-4"
          :test_id="`${id}__modal-approval__btn-loading`" :ref="`${id}__modal-approval__btn-loading`" />
        <active-button v-else @click="processApprovalLeave()" additional_class="mt-2 px-4"
          :test_id="`${id}__modal-approval__btn-submit`" :ref="`${id}__modal-approval__btn-submit`" />
      </div>
    </plain-modal>
    <plain-modal size="lg" v-model="modal.preview" @close="setSelectedToPreview">
      <div class="row mx-0 bg-gray-90">
        <content-image :value="selected.letter_image" :is_responsive="true"
          additional_class="object-contain align-middle mx-auto" />
      </div>
      <active-button @click="setSelectedToPreview()" text="Tutup" additional_class="w-100 mt-3" type="outline"
        variant="grey" />
    </plain-modal>
  </layout>
</template>

<script>
import { officerLeaveMethods } from "~/store/helperActions";
import constant_report from "@/constants/report";

let FilterReport = null;
try {
  FilterReport = () =>
    import("@/components/organisms/report/_shared/FilterReport");
} catch (error) {
  window.$nuxt.$utility.setErrorContextSentry(error);
  window.$nuxt.$sentry.captureMessage(
    `${error.message} at rendering filter-report in report/leave/index`
  );
  window.location.reload();
}

export default {
  head: () => ({
    title: `Laporan Absensi - Izin | ${process.env.APP_TITLE}`,
  }),
  components: {
    Layout: () => import("@/layouts/main"),
    TableLeaveReport: () => import("@/components/organisms/report/leave/TableLeaveReport"),
    FilterReport: FilterReport,
    ContentHeaderView: () => import("@utilities/molecules/content-view/ContentHeaderView"),
    InputTextareaGroup: () => import("@utilities/molecules/input-group/InputTextareaGroup"),
    PlainModal: () => import("@utilities/atoms/modal/PlainModal"),
    SquareCard: () => import("@utilities/atoms/card/SquareCard"),
    ContentImage: () => import("@utilities/atoms/image/ContentImage"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
    DisabledButton: () => import("@utilities/atoms/button/DisabledButton"),
    ExportButton: () => import("@utilities/atoms/button/ExportButton"),
    DropdownButton: () => import("@utilities/atoms/button/DropdownButton"),
    ContentTitle: () => import("@utilities/atoms/title/ContentTitle"),
  },
  data: () => ({
    id: "report-leave",
    modal: {
      approval: false,
      preview: false
    },
    filter: {
      month: "",
      officer: [],
      leave_type: "",
      leave_reason: []
    },
    report: {
      name: "",
      fields: constant_report.leave_report_header(),
      content: [],
    },
    selected: {},
    form: {
      note: ""
    },
    helper: {
      is_searching: false,
    },
  }),
  methods: {
    updateOfficerLeave: officerLeaveMethods.updateOfficerLeave,
    setSelectedToApproval(data, action) {
      if (data && data.id) {
        this.selected = { ...data, action };
        this.modal.approval = true
      } else {
        this.selected = {};
        this.form.note = ""
        this.modal.approval = false
      }
    },
    setSelectedToPreview(data) {
      if (data && data.id) {
        this.selected = data
        this.modal.preview = true
      } else {
        this.selected = {};
        this.modal.preview = false
      }
    },
    setDownloadReport(value) {
      this.helper.is_searching = false;
      this.report.name = value.name;
      this.report.content = value.content;
    },
    setFilter(filter) {
      this.filter.month = filter.month;
      this.filter.officer = filter.officer;
      this.filter.leave_type = filter.leave_type;
      this.filter.leave_reason = filter.leave_reason;
      this.helper.is_searching = true
    },
    getPayloadApprovalLeave() {
      return {
        id: this.selected.id,
        status: this.selected.action,
        note: this.form.note,
      };
    },
    processDownloadReport() {
      document.getElementById(`${this.id}__btn-download`).click()
    },
    async processApprovalLeave() {
      try {
        const payload = this.getPayloadApprovalLeave();
        await this.updateOfficerLeave(payload);
        this.setSelectedToApproval()
        this.helper.is_searching = true
      } catch (error) { }
    },
  },
};
</script>