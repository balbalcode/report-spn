<script>
import {reportMethods} from "~/store/helperActions";
import jscookie from "js-cookie"

export default {
  components: {
    ContentSpan: () => import("@utilities/atoms/utility/ContentSpan")
  },
  head: () => ({
    title: `Laporan Layanan Tambahan  ${window.$nuxt.$route.query.month} Spot ${(JSON.parse(jscookie.get("selected_spots")).text)}`
  }),
  data: () => ({
    data: {
      field: [],
      rows: [],
      total: {}
    },
    service: [],
    alias: [],
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
        service: this.$route.query.service,
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


    formatServiceQuantityReport(data) {
      let sampling = this.$utility.copyObject(data)
      delete sampling.date
      delete sampling.days
      delete sampling.total_amount
      delete sampling.total_income

      this.processMappingTable(sampling)
    },

    processMappingTable(data) {
      this.data.field = []
      Object.entries(data).forEach(([key, values]) => {
        this.data.field.push({"values": key, "text": values.name})
      });
    },

    async processGetData() {
      this.helper.is_loading = true
      this.helper.is_error = false
      try {
        let payload = this.setPayloadGet()
        this.data = await this.getAdditionalReportByDate(payload)
        this.formatServiceQuantityReport(this.data.rows[0])
      } catch (error) {
        this.data = { field: [], rows: [], total: {} }
        this.passErrorToParent(error)
        this.helper.is_error = true
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
        <table class="table table-striped report-table min-vw-100">
          <thead class="thead-primary">
          <tr>
            <th rowspan="2">Tanggal</th>
            <th rowspan="2">Hari</th>
            <template v-for="(root, index) in data.field">
              <th colspan="2" :key="index">
                {{ root.text }}
              </th>
            </template>
            <th rowspan="2">Total Layanan</th>
            <th rowspan="2">Total Pendapatan</th>
          </tr>
          <tr>
            <template v-for="(field) in data.field">
              <th :key="`${field}-Jumlah`" class="odd">Jumlah</th>
              <th :key="`${field}-Pendapatan`" class="even">Pendapatan</th>
            </template>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(rows) in data.rows">
            <td>{{ rows.date }}</td>
            <td>{{ rows.days }}</td>
            <template v-for="field in data.field">
              <td>{{ $utility.convertToRupiah(rows[field.values].qty) }}</td>
              <td>{{ $utility.convertToRupiah(rows[field.values].values) }}</td>
            </template>
            <td>{{ $utility.convertToRupiah(rows.total_amount) }}</td>
            <td>{{ $utility.convertToRupiah(rows.total_income) }}</td>
          </tr>
          </tbody>
          <tfoot>
          <tr>
            <th colspan="2" class="bg-primary">Total</th>
            <template v-for="(field, idx) in data.field">
              <td :key="`qty-${idx}`">{{ $utility.convertToRupiah(data.total[field.values].qty) }}</td>
              <td :key="`values-${idx}`">{{ $utility.convertToRupiah(data.total[field.values].values) }}</td>
            </template>
            <td>{{ $utility.convertToRupiah(data.total.total_amount) }}</td>
            <td>{{ $utility.convertToRupiah(data.total.total_income) }}</td>
          </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>
