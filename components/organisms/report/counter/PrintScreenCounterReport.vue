<script>
import {reportMethods} from "~/store/helperActions";
import jscookie from "js-cookie"

export default {
  components: {ContentSpan: () => import("@utilities/atoms/utility/ContentSpan")},
  head: () => ({
    title: `Laporan Counter ${window.$nuxt.$route.query.month} Spot ${(JSON.parse(jscookie.get("selected_spots")).text)}`
  }),
  data: () => ({
    data: {
      rows: [],
      total: {}
    },
    vehicle: [],
    alias: [],
    table: {
      dynamic_column: 2,
      static_column: 3,
      length_dynamic_column: 0,
      additional_dynamic_column: 1,
      dynamic_count: 0,
      total_column: 0
    },
    helper: {
      is_loading: false,
      is_error: false
    },
  }),
  async mounted() {
    this.processFillVehicle()
    this.processFillAlias()
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
    setPayloadGet() {
      return {
        month: this.$route.query.month,
        spot_id: this.$route.query.spot,
        vehicle_codes: this.$route.query.vehicle,
        opener: this.$route.path
      }
    },

    processFillVehicle() {
      let vehicle = String(this.$route.query.vehicle)
      vehicle = vehicle.split(",")
      this.vehicle = vehicle
    },

    processFillAlias() {
      let alias = String(this.$route.query.alias)
      alias = alias.split(",")
      this.alias = alias
    },

    processGetCounterVehicle(data, vehicle_code) {
      try {
        if (data.length > 0) {
          return data.map(opt => {
            if (opt.code === vehicle_code) return opt.values
          })
        } else {
          return 0
        }
      } catch (error) {
        this.$utility.fireToast(
            "Gagal memformat data",
            "primary",
            "Kamu tidak bisa melakukan download laporan dikarenakan sistem gagal memformat data, anda dapat memuat kembali halaman ini"
        )
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatContentReport in TableCounterReport`)
        return 0
      }
    },

    formatTableColumn() {
      this.table.length_dynamic_column = this.vehicle.length
      this.table.dynamic_count = this.table.dynamic_column * this.length_dynamic_column
      this.table.total_column = this.table.dynamic_count + this.table.static_column
    },

    formatColumnClass(root, index) {
      let number = index + (this.table.length_dynamic_column * root - 1)
      if ((number % 2) === 0) {
        return "odd"
      } else {
        return "even"
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

    async processGetData() {
      this.helper.is_loading = true
      this.helper.is_error = false
      try {
        await this.formatTableColumn()
        let payload = this.setPayloadGet()
        this.data = await this.getCounterReportByDate(payload)
        this.helper.is_loading = false
      } catch (error) {
        this.helper.is_loading = false
        this.helper.is_error = true
      }
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
      <content-span image="error.png" size="xl" :has_animation="false" caption="Gagal memuat data"/>
    </div>

    <div class="row" v-if="!helper.is_loading && data.rows.length < 1 && !helper.is_error">
      <content-span image="empty.png" size="xl" :has_animation="false" caption="Laporan belum tersedia"/>
    </div>

    <div class="row py-1 px-3" v-if="!helper.is_loading && data.rows.length > 0 && !helper.is_error">
      <div class="col-12 p-0 rounded overflow-scroll-x">
        <table class="table report-table min-vw-100">
          <thead class="thead-primary">
          <tr>
            <th rowspan="2">Tanggal</th>
            <th rowspan="2">Hari</th>
            <th :colspan="vehicle.length">Pendapatan</th>
            <th :colspan="vehicle.length">Kuantitas</th>
            <th colspan="2">Kuantitas</th>
          </tr>
          <tr>
            <template v-for="root in (table.dynamic_column )">
              <th v-if="vehicle !== ''" v-for="(type, index) in alias" :key="root"
                  :class="formatColumnClass(root,index)">
                {{ type }}
              </th>
            </template>
            <th>Motor</th>
            <th>Mobil</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="rows in data.rows">
            <td>{{ rows.date }}</td>
            <td>{{ rows.days }}</td>
            <td v-for="index in table.length_dynamic_column" :key="`counter-income-${index}`">
              {{ $utility.convertToRupiah(rows['income'] ? rows['income'][(index - 1)].values : 0) }}
            </td>
            <td v-for="index in table.length_dynamic_column" :key="`counter-qty-${index}`">
              {{ $utility.convertToRupiah(rows['count'] ? rows['count'][(index - 1)].values : 0) }}
            </td>
            <td>{{ $utility.convertToRupiah(processGetCounterVehicle(rows.counter, 'MT1')) }}</td>
            <td>{{ $utility.convertToRupiah(processGetCounterVehicle(rows.counter, 'MB1')) }}</td>
          </tr>
          </tbody>
          <tfoot>
          <tr>
            <td colspan="2" class="bg-primary">Total</td>
            <td v-for="index in table.length_dynamic_column" :key="`counter-income-${index}`">
              {{ $utility.convertToRupiah(data.total['income'] ? data.total['income'][(index - 1)].values : 0) }}
            </td>
            <td v-for="index in table.length_dynamic_column" :key="`counter-qty-${index}`">
              {{ $utility.convertToRupiah(data.total['count'] ? data.total['count'][(index - 1)].values : 0) }}
            </td>
            <td>{{ $utility.convertToRupiah(processGetCounterVehicle(data.total.counter, 'MT1')) }}</td>
            <td>{{ $utility.convertToRupiah(processGetCounterVehicle(data.total.counter, 'MB1')) }}</td>
          </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>
