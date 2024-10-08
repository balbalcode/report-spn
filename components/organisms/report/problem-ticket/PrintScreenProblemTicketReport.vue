<script>
import {reportMethods} from "~/store/helperActions";
import constant_resolution_center from "@/constants/resolution-center"

export default {
  components: {
    ContentSpan: () => import("@utilities/atoms/utility/ContentSpan"),
  },
  head: () => ({
    title: `Laporan Lainnya - Tiket Bermasalah | ${process.env.APP_TITLE}`
  }),
  data: () => ({
    data: {
      rows: [],
    },
    helper: {
      is_loading: false,
      is_error: false
    },
    reason_map: constant_resolution_center.reason_map(),
  }),
  async mounted() {
    if (!this.$route.query.month) {
      this.processMappingError('no-reference-number');
      return
    }
    await this.processGetData()
    await this.processPrintDocument()
    await this.processClosePage()
  },

  methods: {
    ...reportMethods,
    passErrorToParent(error) {
      this.$emit("error", {state: true, message: error})
    },

    setPayloadGet() {
      return {
        month: window.$nuxt.$route.query.month,
        spot_id: this.$utility.getSpotId(),
        reason: '',
        officer_id: '',
        mgmt_user_id : "",
        opener: this.$route.path,
      };
    },


    formatSpotList() {
      return this.spot_id.map(item => item.value).join(',');
    },

    toggleModalNullReference() {
      this.modal.modal_null_reference = !this.modal.modal_null_reference
    },

    toggleModalNoReference() {
      this.modal.modal_no_reference = !this.modal.modal_no_reference
    },

    toggleModalFailedReference() {
      this.modal.modal_failed_reference = !this.modal.modal_failed_reference
    },

    toggleModalFailedPrint() {
      this.modal.modal_failed_print = !this.modal.modal_failed_print
    },

    formatContentReport(rows) {
      try {
        return rows.map((row) => {
          let media = '-'
          let officer_name = '-'

          if (row.mgmt.name) {
            media = "Dashboard"
            officer_name = row.mgmt.name
          } else if (row.officer.name) {
            media = "Aplikasi"
            officer_name = row.officer.name
          }

          return {
            time_in: row.time_in,
            time_out_system: row.time_out_system ? row.time_out_system : "-",
            time_out_manual: row.time_out_manual ? row.time_out_manual : "-",
            shift: row.shift_time_out,
            transaction_id: row.id,
            reason:  this.reason_map[row.reason] ?? row.reason ?? '-',
            officer_name,
            media,
            amount: this.$utility.convertToRupiah(row.amount),
          }
        });
      } catch (error) {
        this.$utility.setErrorContextSentry(error);
        this.$sentry.captureMessage(`${error.message} at formatContentReport in PrintScreenProblemTicketReport`);
      }
    },

    processMappingError(error) {
      switch (error) {
        case 'no-reference-number':
          this.toggleModalNoReference()
          return;
        case 'reference-number-null':
          this.toggleModalNullReference()
          return;
        case 'failed-print-document':
          this.toggleModalNullReference()
          return;
        case 'failed-retrieve-reference':
          this.toggleModalFailedReference()
          return;
      }
    },

    async processPrintDocument() {
      window.print()
    },

    processClosePage() {
      window.close()
    },

    async processGetData() {
      this.helper.is_loading = true;
      this.helper.is_error = false;
      try {
        const payload = this.setPayloadGet();
        const data = await this.getProblemTicketReport(payload);
        this.data.rows = this.formatContentReport(data.rows);
      } catch (error) {
        this.data.rows = []
        this.helper.is_error = true;
      }
      this.helper.is_loading = false;
    }
  }
}
</script>
<template>
  <div class="" style="height: 1748px !important;width: 2480px !important; ">
    <div class="row" v-if="helper.is_loading">
      <content-span/>
    </div>

    <div class="row" v-if="!helper.is_loading && helper.is_error">
      <content-span :has_animation="false" image="error.png" size="xl" caption="Gagal memuat data"/>
    </div>

    <div class="row" v-if="!helper.is_loading && data.rows.length < 1 && !helper.is_error">
      <content-span :has_animation="false" image="empty.png" size="xl" caption="Laporan belum tersedia"/>
    </div>

    <div class="row py-1 px-3" v-if="!helper.is_loading && data.rows.length > 0 && !helper.is_error">
      <div class="col-12 p-0 rounded overflow-scroll-x">
        <table class="d-block table report-table table-freeze-x">
          <thead class="thead-primary">
            <tr>
              <th rowspan="2">Waktu Tiket Dibuat</th>
              <th colspan="2">Waktu Ditandai Bermasalah</th>
              <th rowspan="2">Shift</th>
              <th rowspan="2">ID Transaksi</th>
              <th rowspan="2">Alasan</th>
              <th rowspan="2">Petugas</th>
              <th rowspan="2">Media</th>
              <th rowspan="2">Nominal</th>
            </tr>
            <tr>
              <th>Sistem</th>
              <th>Manual</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in data.rows" :key="`row-${index}`">
              <td>{{ row.time_in }}</td>
              <td>{{ row.time_out_system }}</td>
              <td>{{ row.time_out_manual }}</td>
              <td>{{ row.shift }}</td>
              <td>{{ row.transaction_id }}</td>
              <td>{{ row.reason }}</td>
              <td>{{ row.officer_name }}</td>
              <td>{{ row.media }}</td>
              <td>{{ row.amount }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
