<template>
  <content-table-view :length="data.length" :is_init="helper.is_init" :is_loading="helper.is_loading"
    :is_error="helper.is_error" :test_id="`wrapper__${id}`">
    <div class="table-responsive rounded-top table-freeze mb-0">
      <table class="table table-striped table-borderless mb-0 custom-tbl" :id="id" :data-testid="id">
        <thead class="thead-freeze bg-primary">
          <tr class="border-bottom-table">
            <th class="text-dark text-left" :data-testid="`${id}__tr-head__th-number`">No</th>
            <th class="text-dark text-left" :data-testid="`${id}__tr-head__th-officer-name`">Nama</th>
            <th class="text-dark text-left" :data-testid="`${id}__tr-head__th-officer-id`">ID Petugas</th>
            <th class="text-dark text-left" :data-testid="`${id}__tr-head__th-leave-type`">Tipe Izin</th>
            <th class="text-dark text-left" :data-testid="`${id}__tr-head__th-date`">Tanggal Izin</th>
            <th class="text-dark text-left" :data-testid="`${id}__tr-head__th-days`">Durasi Izin</th>
            <th class="text-dark text-left" :data-testid="`${id}__tr-head__th-leave-reason`">Alasan</th>
            <th class="text-dark text-left" :data-testid="`${id}__tr-head__th-letter-image`" v-if="leave_type.includes('SICK')">
              Foto Surat
            </th>
            <th class="text-dark text-left" :data-testid="`${id}__tr-head__th-status`">Status</th>
            <th class="text-dark text-center" :data-testid="`${id}__tr-head__th-option`">Opsi</th>
            <th class="text-dark text-left" :data-testid="`${id}__tr-head__th-checker`">Dicek oleh</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in data" :key="index" :class="{ 'selected-row': row.id === selected.id }">
            <td class="text-left" :data-testid="`${id}__tr-${index}__td-number`">{{ index + pagination.start }}</td>
            <td class="text-left" :data-testid="`${id}__tr-${index}__td-officer-name`">{{ row.officer_name }}</td>
            <td class="text-left" :data-testid="`${id}__tr-${index}__td-officer-id`">{{ row.officer_id }}</td>
            <td class="text-left" :data-testid="`${id}__tr-${index}__td-leave-type`">{{ row.leave_type_text }}</td>
            <td class="text-left" :data-testid="`${id}__tr-${index}__td-date`">{{ row.leave_range_date }}</td>
            <td class="text-left" :data-testid="`${id}__tr-${index}__td-days`">{{ row.leave_days }} hari</td>
            <td class="text-left" :data-testid="`${id}__tr-${index}__td-leave-reason`">
              {{ row.leave_reason_text }}
            </td>
            <td class="text-left" :data-testid="`${id}__tr-${index}__td-letter-image`" v-if="leave_type.includes('SICK')">
              <active-button @click="passPreviewToParent(row)" text="Lihat Foto" type="outline" variant="secondary"
                :test_id="`${id}__tr-${index}__btn-preview-letter`" :ref="`${id}__tr-${index}__btn-preview-letter`" />
            </td>
            <td class="text-left" :data-testid="`${id}__tr-${index}__td-status`">
              <label-status-group :test_id="`${id}__tr-${index}__label-status`" :ref="`${id}__tr-${index}__label-status`"
                :is_default_format="false" :variant="row.status_variant" :text="row.status_text" />
            </td>
            <td class="text-center" :data-testid="`${id}__tr-${index}__td-option`">
              <dropdown-button v-if="row.status == '0_PENDING'" size="sm" variant="gray" type="outline"
                additional_class="p-0" caret="font-size-20 bx bx-dots-vertical-rounded" :has_custom_action="true"
                :ref="`${id}__tr-${index}__btn-option`" :test_id="`${id}__tr-${index}__btn-option`">
                <active-button icon="bx bx-check-circle" icon_size="20" icon_color="text-success" text="Terima"
                  text_color="text-success"
                  additional_class="border-0 w-100 text-left p-2 bg-transparent font-weight-semibold"
                  :ref="`${id}__tr-${index}__btn-approve`" :test_id="`${id}__tr-${index}__btn-approve`" align="rtl"
                  @click="passApprovalToParent(row, '1_APPROVED')" />
                <active-button icon="bx bx-x-circle" icon_size="20" icon_color="text-danger" text_color="text-danger"
                  text="Tolak" additional_class="border-0 w-100 text-left p-2 bg-transparent font-weight-semibold"
                  :ref="`${id}__tr-${index}__btn-decline`" :test_id="`${id}__tr-${index}__btn-decline`" align="rtl"
                  @click="passApprovalToParent(row, '2_REJECTED')" />
              </dropdown-button>
            </td>
            <td class="text-left" :data-testid="`${id}__tr-${index}__td-checker`">{{ row.checker }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <card-pagination-view :test_id="`${id}__pagination`" :per_page="pagination.per_page"
      :total_data="pagination.total_data" additional_class="mt-3 col-12 px-0 text-right"
      :current_page="pagination.current_page" @update="setCurrentPage" />
  </content-table-view>
</template>

<script>
import { reportMethods } from "@/store/helperActions";
import officer_constant from "~/constants/officer";

const status_variant = {};
const status_text = {};

officer_constant.status_registration().forEach((item) => {
  status_text[item.value] = item.text;
  status_variant[item.value] = item.variant;
});

export default {
  components: {
    ContentTableView: () => import("@utilities/molecules/content-view/ContentTableView"),
    CardPaginationView: () => import("@utilities/molecules/card-view/CardPaginationView"),
    LabelStatusGroup: () => import("@utilities/molecules/label-group/LabelStatusGroup"),
    DropdownButton: () => import("@utilities/atoms/button/DropdownButton"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
  },

  props: {
    selected: { default: () => ({}) },
    month: { default: "" },
    officer: { default: "" },
    leave_type: { default: () => ([]) },
    leave_reason: { default: () => ([]) },
    is_searching: { default: false, type: Boolean },
  },

  data: () => ({
    id: "table-leave-report",
    data: [],
    pagination: {
      start: 0,
      per_page: 10,
      current_page: 1,
      total_data: 0,
      total_pages: 0
    },
    helper: {
      is_init: true,
      is_loading: false,
      is_error: false,
    },
    leave_type_map: officer_constant.leave_type_map(),
    leave_reason_map: officer_constant.leave_reason_map()
  }),

  computed: {
    filter_title() {
      const end = this.pagination.start - 1 + this.data.length
      let text = `
        Menampilkan
          <b>&nbsp;${this.pagination.start}-${end}&nbsp;</b>
        dari
          <b>&nbsp;${this.pagination.total_data}&nbsp;</b>
        data
      `
      return text
    }
  },

  watch: {
    is_searching: async function (value) {
      this.helper.is_init = false
      if (value) {
        await this.setCurrentPage(1);
      }
    },
  },

  methods: {
    getLeaveReport: reportMethods.getLeaveReport,
    passApprovalToParent(data, action) {
      this.$emit("approval", data, action);
    },
    passPreviewToParent(data) {
      this.$emit("preview", data);
    },
    passFormatDownloadReport(data) {
      let payload = { content: [], name: "" }
      let spot = this.$utility.getSelectedSpot();
      payload.name = `Laporan Izin ${spot.text} Bulan ${this.month} (hal ${this.pagination.current_page} dari ${this.pagination.total_pages})`;

      this.data = this.formatContentReport(data)
      payload.content = this.data
      this.$emit("ready", payload)
    },
    setNumber() {
      this.pagination.start = 1 + (parseInt(this.pagination.current_page) - 1) * parseInt(this.pagination.per_page)
      this.pagination.total_pages = Math.ceil(parseInt(this.pagination.total_data) / parseInt(this.pagination.per_page))
    },
    async setCurrentPage(page) {
      this.pagination.current_page = page;
      await this.processGetData();
    },
    getPayloadGetData() {
      const payload = {
        filter: [
          { key: "spot_id", value: this.$utility.getSpotId() },
          { key: "month", value: this.month },
          { key: "page", value: this.pagination.current_page },
          { key: "per_page", value: this.pagination.per_page },
        ],
      };
      if (this.officer?.length > 0) {
        payload.filter.push({ key: "officer_id", value: this.officer[0].id })
      }
      if (this.leave_type && this.leave_type.length) {
        const types = this.leave_type.join(",")
        payload.filter.push({ key: "leave_type", value: types })
      }
      if (Array.isArray(this.leave_reason) && this.leave_reason.length) {
        const reasons = this.leave_reason.join(",")
        payload.filter.push({ key: "leave_reason", value: reasons })
      }
      return payload;
    },
    formatContentReport(rows) {
      try {
        return rows.map(row => {
          const formatted = { ...row }

          if (!formatted.letter_image && formatted.file_url) formatted.letter_image = formatted.file_url
          if (!formatted.status && formatted.approval_status) formatted.status = formatted.approval_status
          if (!formatted.leave_type && formatted.type) formatted.leave_type = formatted.type
          if (!formatted.leave_reason && formatted.reason) formatted.leave_reason = formatted.reason

          formatted.leave_start = this.$utility.formatDateMoment(formatted.leave_start, "DD MMM YYYY")
          formatted.leave_end = this.$utility.formatDateMoment(formatted.leave_end, "DD MMM YYYY")
          formatted.leave_range_date = `${formatted.leave_start} - ${formatted.leave_end}`
          formatted.leave_type_text = this.leave_type_map[formatted.leave_type] ?? "-"
          formatted.leave_reason_text = this.leave_reason_map[formatted.leave_reason] ?? "-"
          formatted.status_text = status_text[formatted.status]
          formatted.status_variant = status_variant[formatted.status]
          formatted.checker = formatted.mgmt_user_detail && formatted.mgmt_user_detail.name ? formatted.mgmt_user_detail.name : "-"

          return formatted
        })
      } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatContentReport in TableLeaveReport`)
        return []
      }
    },
    async processGetData() {
      this.helper.is_loading = true
      this.helper.is_error = false
      try {
        const payload = this.getPayloadGetData();
        const data = await this.getLeaveReport(payload);
        this.setNumber()
        this.passFormatDownloadReport(data.values)
        this.pagination.total_data = data.total_values;
      } catch (error) {
        this.data = [];
        this.pagination.total_data = 0;
        this.helper.is_error = true
        this.passFormatDownloadReport([])
      }
      this.helper.is_loading = false
    },
  },
};
</script>