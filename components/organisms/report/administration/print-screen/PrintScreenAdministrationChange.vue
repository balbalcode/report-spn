<script>
import {reportMethods} from "~/store/helperActions";
import jscookie from "js-cookie"
import constant_report from "@/constants/report"

export default {
  components: {
    ContentSpan: () => import("@utilities/atoms/utility/ContentSpan")
  },
  head: () => ({
    title: `Laporan Administrasi  ${window.$nuxt.$route.query.month} Spot ${(JSON.parse(jscookie.get("selected_spots")).text)}`
  }),
  data: () => ({
    data: {
      field: [],
      rows: [],
      total: {}
    },
    options  :{
      administration_type : constant_report.administration_type()
    },
    administration: [],
    helper: {
      is_loading: false,
      is_error: false
    },
  }),
  async mounted() {
    if (!this.$route.query.month) {
      this.processMappingError('no-reference-number');
      return
    }
    await this.processCheckModalWarning()
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
        month: this.$route.query.month,
        spot_id: this.$route.query.spot,
        name: this.$route.query.name,
        administration: this.$route.query.administration,
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

    toggleModalWarning() {

    },

    processCheckModalWarning() {

    },

    formatAdministrationType(type){
      if (!type) return "Terjadi Kesalahan"
      type = this.options.administration_type.find(opt => opt.value === type)
      return type.text ?? "Terjadi Kesalahan"
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
        let payload = this.setPayloadGet()
        this.data = await this.getAdministrationReport(payload)
      } catch (error) {
        this.data = { field: [], rows: [], total: {} }
        this.helper.is_error = true
        this.passErrorToParent(error)
      }
      this.helper.is_loading = false
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
        <table class="d-block table table-striped report-table rounded overflow-scroll-x">
          <thead class="thead-primary">
          <tr>
            <th rowspan="2">Tanggal</th>
            <th rowspan="2">Nama</th>
            <th rowspan="2">Jenis Kendaraan</th>
            <th rowspan="2">Jenis Administrasi</th>
            <th rowspan="2">Nama</th>
            <th rowspan="2">Nomor Identitas</th>
            <th rowspan="2">Email</th>
            <th colspan="7">Data Lama</th>
            <th colspan="7">Data Baru</th>
            <th rowspan="2">User Management</th>
            <th rowspan="2" class="cell-sticky" style="top: 1px;">Catatan</th>
            <th rowspan="2" class="cell-sticky" style="top: 1px;">Alasan Perubahan Harga</th>
            <th rowspan="2">Biaya</th>
          </tr>
          <tr>
            <th>RF ID</th>
            <th>Nomor Kartu</th>
            <th>Plat 1</th>
            <th>Plat 2</th>
            <th>RF ID</th>
            <th>Nomor Kartu</th>
            <th>Plat 1</th>
            <th>Plat 2</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="rows in data.rows">
            <td>{{ rows.date }}</td>
            <td>{{ rows.updated_data.name }}</td>
            <td>{{ rows.vehicle_name }}</td>
            <td>{{ formatAdministrationType(rows.type) }}</td>
            <td>{{ rows.previous_data.name }}</td>
            <td>{{ rows.previous_data.identification_number }}</td>
            <td>{{ rows.previous_data.email }}</td>
            <td>{{ rows.previous_data.card.rf_id }}</td>
            <td>{{ rows.previous_data.card.card_id }}</td>
            <td>{{ rows.previous_data.card.license_plate }}</td>
            <td>{{ rows.previous_data.card.second_license_plate }}</td>
            <td>{{ rows.updated_data.card.rf_id }}</td>
            <td>{{ rows.updated_data.card.card_id }}</td>
            <td>{{ rows.updated_data.card.license_plate }}</td>
            <td>{{ rows.updated_data.card.second_license_plate }}</td>
            <td>{{ rows.mgmt_user_detail.name }}</td>
            <td>{{ rows.message ? JSON.parse(rows.message).note : '-' }}</td>
            <td>{{ rows.message ? JSON.parse(rows.message).reason : '-' }}</td>
            <td>{{ $utility.convertToRupiah(rows.amount) }}</td>
          </tr>
          </tbody>
          <tfoot>
          <tr>
            <th colspan="2" class="bg-primary">Total</th>
            <td colspan="16"></td>
            <td>{{ $utility.convertToRupiah(data.total.amount) }}</td>
          </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>
