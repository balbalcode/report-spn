<script>
import {reportMethods} from "~/store/helperActions";
import jscookie from "js-cookie"

export default {
  components: {ContentSpan: () => import("@utilities/atoms/utility/ContentSpan")},
  head: () => ({
    title: `Laporan Keuangan Kasir ${window.$nuxt.$route.query.month} Spot ${(JSON.parse(jscookie.get("selected_spots")).text)}`
  }),
  data: () => ({
    data: {
      rows: [],
      total: {}
    },
    vehicle: [],
    alias: [],
    table: {
      dynamic_column: 4,
      static_column: 7,
      length_dynamic_column: 0,
      additional_dynamic_column: 0,
      dynamic_count: 0,
      total_column: 0
    },
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
    await this.processGetData()
    await this.processPrintDocument()
    await this.processClosePage()
  },

  methods: {
    ...reportMethods,
    setPayloadGet() {
      return {
        month: this.$route.query.month,
        spot_id: this.$route.query.spot,
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

    formatColumnClass(root, index) {
      let number = index + (this.table.length_dynamic_column * root - 1)
      if ((number % 2) === 0) {
        return "odd"
      } else {
        return "even"
      }
    },

    formatColumnLabel(root, index) {
      let number = index + (this.table.length_dynamic_column * root - 1)
      if ((number % 2) === 0) {
        return "Pendapatan"
      } else {
        return "Jumlah"
      }
    },

    formatReportOfficerStat(data) {
      // WE SHOULD CLONE THE OBJECT USING THIS METHOD CAUSE WE CANT CLONE WITH COMMON CLONING VARIABLE
      // MORE INFORMATION PLEASE READ
      // https://stackoverflow.com/questions/33914899/using-delete-property-without-affecting-parent-object
      let sampling = this.$utility.copyObject(data)

      // mapping based on json contract
      delete sampling.shifts
      delete sampling.date
      delete sampling.officer_name
      delete sampling.reported_at

      this.processMappingTable(sampling)
      this.table.length_dynamic_column = this.table.dynamic_column * 2
    },

    processMappingTable(data) {
      this.data.field = []
      this.table.dynamic_column = 0
      Object.entries(data).forEach(([key]) => {
        this.data.field.push(key)
        this.table.dynamic_column += 1
      });
    },

    processMappingVehicle(data) {
      this.data.vehicle = []
      Object.entries(data).forEach(([values]) => {
        this.data.vehicle.push(values.name)
      })
    },

    async processGetData() {
      this.helper.is_loading = true
      this.helper.is_error = false
      try {
        let payload = this.setPayloadGet()
        let data = await this.getOfficerStatReport(payload)
        this.data.rows = data.rows
        this.formatReportOfficerStat(this.data.rows[0])
      } catch (error) {
        this.data.rows = []
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
      <content-span :has_animation="false" image="error.png" size="xl" caption="Gagal memuat data"/>
    </div>

    <div class="row" v-if="!helper.is_loading && data.rows.length < 1 && !helper.is_error">
      <content-span :has_animation="false" image="empty.png" size="xl" caption="Laporan belum tersedia"/>
    </div>

    <div class="row py-1 px-3" v-if="!helper.is_loading && data.rows.length > 0 && !helper.is_error">
      <div class="col-12 p-0 rounded overflow-scroll-x">
        <table class="table table-striped report-table table-freeze-x">
          <thead class="thead-primary">
          <tr>
            <th rowspan="2">Tanggal</th>
            <th rowspan="2">Shift</th>
            <template v-for="(root, index) in (table.dynamic_column)">
              <th colspan="2">{{ data.field[index] }}</th>
            </template>
            <th rowspan="2">Petugas</th>
            <th rowspan="2">Waktu Pembuatan</th>
          </tr>
          <tr>
            <template v-for="(root, index) in (table.length_dynamic_column)">
              <th :class="formatColumnClass(root, index)">{{ formatColumnLabel(root, index) }}</th>
            </template>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(report, index) in data.rows" :key="index">
            <td>{{ report.date }}</td>
            <td>{{ report.shifts }}</td>
            <template v-for="root in (data.field)">
              <td>{{ $utility.convertToRupiah(report[root].quantity) }}</td>
              <td>{{ $utility.convertToRupiah(report[root].amount) }}</td>
            </template>
            <td>{{ report.officer_name }}</td>
            <td>{{ report.reported_at }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
