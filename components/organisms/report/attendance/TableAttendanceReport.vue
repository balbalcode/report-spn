<template>
  <div>
    <div class="row" v-if="helper.is_loading">
      <content-span ref="content-span-loading"/>
    </div>

    <div class="row" v-else-if="helper.is_error">
      <content-span :has_animation="false" image="error.png" size="xl" caption="Gagal memuat data"
        has_reload_button @reload="processGetData" ref="content-span-error"/>
    </div>

    <div class="row" v-else-if="data.rows.length < 1">
      <content-span :has_animation="false" image="empty.png" size="xl" caption="Laporan belum tersedia"
        ref="content-span-empty"/>
    </div>

    <div v-else class="mt-3" id="wrapper-table-content">
      <div class="row mx-0 px-1 py-2" v-html="filter_title"/>
      <div class="row py-1 px-3">
        <div class="col-12 p-0 rounded">
          <table class="d-block table table-striped table-sticky-header report-table">
            <thead class="thead-primary">
            <tr style="width: 100%">
              <th class="cell-sticky text-left" style="top: 1px;">No.</th>
              <th class="cell-sticky text-left" style="top: 1px; width: 20%;">Nama</th>
              <th class="cell-sticky text-left" style="top: 1px;">ID</th>
              <th class="cell-sticky text-left" style="top: 1px; width: 20%;">Shift (Jam Kerja)</th>
              <th class="cell-sticky text-left" style="top: 1px; width: 15%;">Waktu Check In</th>
              <th class="cell-sticky text-left" style="top: 1px; width: 15%;">Status In</th>
              <th class="cell-sticky text-left" style="top: 1px; width: 15%;">Waktu Check Out</th>
              <th class="cell-sticky text-left" style="top: 1px; width: 15%;">Status Out</th>
              <th class="cell-sticky text-left" style="top: 1px; width: 10%;">Durasi</th>
              <th class="cell-sticky text-left" style="top: 1px; width: 25%;">Foto Check In</th>
              <th class="cell-sticky text-left" style="top: 1px; width: 25%;">Foto Check Out</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, index) in report" :key="`row-${index}`" @click="toggleModalImage(row)"
              class="cursor-pointer" :class="{'selected-row': row.id === selected_data.id}">
              <td class="text-left">{{ index + pagination.start }}</td>
              <td class="text-left">{{ row.name }}</td>
              <td class="text-left">
                <overview-label additional_class="my-0" :has_space="false" :value="row.officer_id" limit_text="6"
                  :is_italic="false" :ref="`overview-officer-id-${index}`"/>
              </td>
              <td class="text-left" style="width: 20%;">{{ row.shift }}</td>
              <td class="text-left">{{ row.timestamp }}</td>
              <td class="text-left">{{ row.status_in }}</td>
              <td class="text-left">{{ row.timestamp_out }}</td>
              <td class="text-left">{{ row.status_out }}</td>
              <td class="text-left">{{ row.duration }}</td>
              <td class="text-left">
                <overview-label additional_class="my-0" :has_space="false" :value="row.image_url" limit_text="20"
                  :is_italic="false" :ref="`overview-image-url-${index}`"/>
              </td>
              <td class="text-left">
                <overview-label additional_class="my-0" :has_space="false" :value="row.image_url_out" limit_text="20"
                  :is_italic="false" :ref="`overview-image-url-out-${index}`"/>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="row">
        <div class="col-12 text-right">
          <card-pagination-view :per_page="pagination.per_page" :total_data="pagination.total_data" additional_class="mt-3 "
            :current_page="pagination.current_page" @update="passUpdatePagination"/>
        </div>
      </div>
    </div>
    
    <plain-modal size="md" v-model="modal.modal_image" @close="resetSelectedData">
      <div class="d-flex">
        <div class="w-50 mr-2">
          <div class="d-flex h-100 justify-content-center align-items-center bg-gray-90">
            <content-image :value="selected_data.image_url" additional_class="object-contain align-middle mx-auto"
              :is_responsive="true"/>
          </div>
        </div>
        <div class="w-50">
          <div class="d-flex h-100 justify-content-center align-items-center bg-gray-90">
            <content-image :value="selected_data.image_url_out" additional_class="object-contain align-middle mx-auto"
              :is_responsive="true"/>
          </div>
        </div>
      </div>
      <active-button @click="toggleModalImage" text="Tutup" additional_class="w-100 mt-3" type="outline"
        variant="grey" ref="btn-close-modal" id="btn-close-modal"/>
    </plain-modal>

    <b-toast no-auto-hide :visible="helper.last_sync !== null" id="toast_last_sync" toaster="b-toaster-bottom-right"
      header-class="d-none" variant="dark">
      <template slot="default">
        <div class="d-flex flex-row">
          <div class="text-dark">
            <span class="rounded-circle bg-primary font-weight-bold" style="padding: .2em .7em">!</span>
          </div>
          <div class="align-self-lg-center align-middle text-white flex-grow-1 ml-1 font-size-12">
            Terakhir diperbarui {{ $utility.formatLocalTimezone(helper.last_sync, 'DD/MM/YYYY HH:mm:ss') }}
          </div>
          <div class="align-self-lg-center align-middle float-right">
            <i class="bx bx-x cursor-pointer" @click="$bvToast.hide('toast_last_sync')"></i>
          </div>
        </div>
      </template>
    </b-toast>
  </div>
</template>

<script>
import {reportMethods} from "@/store/helperActions";
import constant_report from "~/constants/report";

export default {
  components: {
    CardPaginationView: () => import("@utilities/molecules/card-view/CardPaginationView"),
    ContentSpan: () => import("@utilities/atoms/utility/ContentSpan"),
    ContentImage: () => import("@utilities/atoms/image/ContentImage"),
    OverviewLabel: () => import("@utilities/atoms/label/OverviewLabel"),
    PlainModal: () => import("@utilities/atoms/modal/PlainModal"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton")
  },

  props: {
    is_searching: { default: false },
    month: { default: "" },
    officer: { default: () => ([]) },
  },

  data: () => ({
    data: {
      rows: [],
    },
    report: [],
    selected_data: {},
    helper: {
      last_sync: null,
      is_loading: false,
      is_error: false,
    },
    modal: {
      modal_image: false,
    },
    pagination: {
      start: 0,
      per_page: 15,
      current_page: 1,
      total_data: 0
    },
    status_map: constant_report.attendance_status()
  }),

  computed: {
    filter_title() {
      const end = this.pagination.start - 1 + this.report.length
      let text = `
        Menampilkan
          <b>&nbsp;${this.pagination.start}-${end}&nbsp;</b>
        dari
          <b>&nbsp;${this.pagination.total_data}&nbsp;</b>
        data absensi
      `
      return text
    }
  },

  watch: {
    is_searching: {
      async handler(value) {
        if (value) await this.passUpdatePagination(1)
      },
    },
  },

  async mounted() {
    if (this.is_searching) await this.processGetData()
  },

  methods: {
    ...reportMethods,

    async passUpdatePagination(page) {
      this.pagination.current_page = page
      await this.processGetData()
    },

    setPayloadGet() {
      let payload = {
        filter: [
          { key: 'month', value: this.month ?? "" },
          { key: 'spot_id', value: this.$utility.getSpotId() },
          { key: 'page', value: this.pagination.current_page},
          { key: 'per_page', value: this.pagination.per_page }
        ]
      }
      if (this.officer?.length > 0) {
        payload.filter.push({ key: "officer_id", value: this.officer[0].id })
      }
      return payload
    },

    setNumber() {
      this.pagination.start = 1 + (parseInt(this.pagination.current_page) - 1) * parseInt(this.pagination.per_page)
    },

    resetSelectedData() {
      this.selected_data = {}
    },

    toggleModalImage(data) {
      this.selected_data = data ?? {}
      this.modal.modal_image = !this.modal.modal_image
    },

    formatShownReport() {
      if (this.data.rows.length > 0) {
        this.report = this.formatContentReport(this.data.rows);
      }
    },

    formatContentReport(rows) {
      try {
        return rows.map(row => ({
          id: row.id,
          name: row.name,
          officer_id: row.officer_id,
          shift: row.shift,
          timestamp: this.$utility.formatLocalTimezone(row.timestamp, 'DD/MM/YYYY HH:mm'),
          status_in: this.status_map[row.status_in] ?? "-",
          timestamp_out: this.$utility.formatLocalTimezone(row.timestamp_out, 'DD/MM/YYYY HH:mm'),
          status_out: this.status_map[row.status_out] ?? "-",
          duration: row.duration,
          image_url: row.image_url,
          image_url_out: row.image_url_out
        }))
      } catch (error) {
        this.$utility.setErrorContextSentry(error);
        this.$sentry.captureMessage(
            `${error.message} at formatContentReport in TableTransactionReport`
        );
        return []
      }
    },

    async processGetData() {
      this.helper.is_loading = true;
      this.helper.is_error = false;
      try {
        const payload = this.setPayloadGet();
        const data = await this.getAttendanceReport(payload);
        this.helper.last_sync = data.last_sync
        this.data.rows = data.rows
        this.pagination.total_data = data.total
        this.$emit("ready", data.total)
        this.formatShownReport();
        this.setNumber()
      } catch (error) {
        this.helper.is_error = true;
        this.data.rows = []
        this.pagination.total_data = 0
        this.helper.last_sync = ''
      }
      this.helper.is_loading = false;
    },
  },
};
</script>
