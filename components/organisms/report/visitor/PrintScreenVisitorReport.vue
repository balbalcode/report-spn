<script>
import {reportMethods} from "~/store/helperActions";
import constant_resolution_center from "@/constants/resolution-center"

export default {
  components: {
    ContentSpan: () => import("@utilities/atoms/utility/ContentSpan"),
  },
  head: () => ({
    title: `Laporan Lainnya - Pengunjung | ${process.env.APP_TITLE}`
  }),
  data: () => ({
    data: {
      rows: [],
    },
    helper: {
      start: 1,
      is_loading: false,
      is_error: false
    },
    vehicle_map: {},
    modal: {
      modal_null_reference: false,
      modal_no_reference: false,
      modal_failed_reference: false,
      modal_failed_print: false,
    },
    transaction_status: constant_resolution_center.transaction_status
  }),

  computed: {
    parameter() {
      return window.$nuxt.$route.query
    }
  },

  async mounted() {
    if (!this.$route.query.date) {
      this.processMappingError('no-reference-number');
      return
    }
    this.vehicle_map = await this.$utility.getVehicleMap()
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
        date: this.parameter.date,
        spot_id: this.$utility.getSpotId(),
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
      return rows.map((row) => ({
        transaction_id: row.id,
        ref_id: row.ref_id,
        license_plate: row.ref_detail.values ? row.ref_detail.values.motorcycle_detail.license_plate : "-",
        rf_id: row.rf_id ?? "-",
        status: this.transaction_status(row.status),
        time_in: this.$utility.formatLocalTimezone(row.time_in, "DD/MM/YYYY HH:mm") ?? "-",
        ref_time_in: this.$utility.formatLocalTimezone(row.ref_detail.time_in, "DD/MM/YYYY HH:mm") ?? "-",
        time_out: this.$utility.formatLocalTimezone(row.time_out, "DD/MM/YYYY HH:mm") ?? "-",
        ref_time_out: this.$utility.formatLocalTimezone(row.ref_detail.time_out, "DD/MM/YYYY HH:mm") ?? "-",
        amount: this.$utility.convertToRupiah(row.amount) ?? "-",
        vehicle_code: this.vehicle_map[row.vehicle_code] ?? "-"
      }));
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
        this.data = await this.getVisitorReportByDate(payload);
        this.data.rows = data.rows
      } catch (error) {
        this.helper.is_error = true;
        this.$utility.setErrorContextSentry(error);
        this.$sentry.captureMessage(
          `${error.message} at processGetData in TableTransactionReport`
        );
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
              <th>No</th>
              <th>Tanggal</th>
              <th>Waktu Kunjungan</th>
              <th>Nama</th>
              <th>Tipe</th>
              <th>No. Identitas</th>
              <th>Tujuan</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in data.rows" :key="index">
              <td>{{ index + 1 }}</td>
              <td class="text-left">{{ $utility.formatLocalTimezone(row.date, "DD/MM/YYYY HH:mm") }}</td>
              <td class="text-left">{{ row.license_plate }}</td>
              <td class="text-left">{{ row.name }}</td>
              <td>{{ row.type }}</td>
              <td class="text-left">{{ row.identification_number }}</td>
              <td class="text-left">{{ row.destination }}</td>
              <td class="text-left">{{ row.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
