<script>
import {reportMethods} from "~/store/helperActions";
import price_constant from "@/constants/price"

export default {
  components: {
    ContentSpan: () => import("@utilities/atoms/utility/ContentSpan"),
  },
  head: () => ({
    title: `Laporan Lainnya - Tiket Hilang | ${process.env.APP_TITLE}`
  }),
  data: () => ({
    data: {
      rows: [],
    },
    report: [],
    helper: {
      is_loading: false,
      is_error: false
    },
    vehicle_map: {},
    fine_type_map: price_constant.fine_type_map()
  }),
  async created() {
    this.vehicle_map = await this.$utility.getVehicleMap()
  },
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

    passFormatDownloadReport() {
      if (this.data.rows.length > 0) {
        this.report = this.formatContentReport(this.data.rows)
      }
    },

    setPayloadGet() {
      return {
        month: window.$nuxt.$route.query.month,
        spot_id: this.$utility.getSpotId(),
        status: "all",
        officer_id: "",
        opener: this.$route.path
      }
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
        return rows.map(row => ({
          transaction_id: row.transaction_id,
          license_plate: row.license_plate,
          time_in: this.$utility.formatLocalTimezone(row.transaction_detail.time_in, 'DD/MM/YYYY HH:mm:ss'),
          time_out: this.$utility.formatLocalTimezone(row.transaction_detail.time_out, 'DD/MM/YYYY HH:mm:ss'),
          total_hours: `${row.transaction_detail.total_hours} jam`,
          vehicle_code: this.vehicle_map[row.transaction_detail.vehicle_code],
          fine_type: this.fine_type_map[row.type],
          officer_name: row.officer_detail.name,
          parking_price: this.$utility.convertToRupiah(row.parking_price),
          fine: this.$utility.convertToRupiah(row.fine),
          total_price: this.$utility.convertToRupiah(row.total_price),
        }));
      } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatContentReport in TableLostTicketReport`)
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
      this.helper.is_loading = true
      this.helper.is_error = false
      try {
        const payload = this.setPayloadGet()
        this.data = await this.getLostTicketReport(payload)
        this.passFormatDownloadReport()
        this.helper.is_loading = false
      } catch (error) {
        this.helper.is_loading = false
        this.helper.is_error = true
      }
    },
  }
}
</script>
<template>
  <div class="" style="height: 1748px !important;width: 2480px !important; ">
    <div class="row" v-if="helper.is_loading">
      <content-span/>
    </div>

    <div class="row" v-if="!helper.is_loading && helper.is_error">
      <content-span image="error.png" size="xl" :has_animation="false" caption="Gagal memuat data"/>
    </div>

    <div class="row" v-if="!helper.is_loading && data.rows.length < 1 && !helper.is_error">
      <content-span image="empty.png" size="xl" :has_animation="false" caption="Laporan belum tersedia"/>
    </div>

    <div class="row py-1 px-3" v-if="!helper.is_loading && data.rows.length > 0 && !helper.is_error">
      <div class="col-12 p-0 rounded overflow-scroll-x">
        <table class="d-block table report-table table-freeze-x">
          <thead class="thead-primary">
          <tr>
            <th>ID Transaksi</th>
            <th>Plat</th>
            <th>Masuk</th>
            <th>Keluar</th>
            <th>Durasi</th>
            <th>Jenis Kendaraan</th>
            <th>Tipe Denda</th>
            <th>Petugas</th>
            <th>Tarif Parkir</th>
            <th>Denda</th>
            <th>Total Bayar</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(row, index) in report" :key="`row-${index}`">
            <td>{{ row.transaction_id }}</td>
            <td>{{ row.license_plate }}</td>
            <td>{{ row.time_in }}</td>
            <td>{{ row.time_out }}</td>
            <td>{{ row.total_hours }}</td>
            <td>{{ row.vehicle_code }}</td>
            <td>{{ row.fine_type }}</td>
            <td>{{ row.officer_name }}</td>
            <td>{{ row.parking_price }}</td>
            <td>{{ row.fine }}</td>
            <td>{{ row.total_price }}</td>
          </tr>
          </tbody>
          <tfoot>
          <tr>
            <th colspan="2">Total</th>
            <td colspan="6"></td>
            <td>{{ $utility.convertToRupiah(data.total.parking_price) }}</td>
            <td>{{ $utility.convertToRupiah(data.total.fine) }}</td>
            <td>{{ $utility.convertToRupiah(data.total.total_price) }}</td>
          </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>
