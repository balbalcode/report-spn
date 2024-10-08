<script>
import {reportMethods} from "~/store/helperActions";
import jscookie from "js-cookie"

export default {
  components: {
    ContentSpan: () => import("@utilities/atoms/utility/ContentSpan"),
    PriceLabel: () => import("@utilities/atoms/label/PriceLabel"),
  },
  head: () => ({
    title: `Laporan Membership ${window.$nuxt.$route.query.month} Spot ${(JSON.parse(jscookie.get("selected_spots")).text)}`
  }),
  data: () => ({
    data: {
      rows: [],
      total: {}
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
        filter: [
          { key: "month", value: this.$route.query.month },
          { key: "spot_id", value: this.$route.query.spot },
          { key: "product_id", value: this.$route.query.product },
          { key: "mgmt_user_id", value: this.$route.query.user },
        ],
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
        let payload = this.setPayloadGet()
        this.data = await this.getMembershipReportPlateByDate(payload)
      } catch (error) {
        this.passErrorToParent(error)
        this.helper.is_error = true
        this.helper.is_loading = false
      }
      this.helper.is_loading = false
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
        <table class="table report-table table-freeze-x">
          <thead class="thead-primary">
          <tr>
            <th>No</th>
            <th>Tanggal</th>
            <th>No Polisi</th>
            <th>Periode</th>
            <th>PJP Lama</th>
            <th>PJP Baru</th>
            <th>Produk</th>
            <th>User</th>
            <th>Nominal</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(data, index) in data.rows">
            <td>{{ index + 1 }}</td>
            <td>{{ data.date }}</td>
            <td>{{ data.license_plate }}</td>
            <td>{{ data.period }}</td>
            <td class="font-weight-bolder">{{ data.old_member }}</td>
            <td class="font-weight-bolder">{{ data.new_member }}</td>
            <td>{{ data.product_name }}</td>
            <td>{{ data.mgmt_user_name }}</td>
            <td>
              <price-label :value="data.amount" :has_label="true"/>
            </td>
          </tr>
          </tbody>
          <tfoot>
          <tr>
            <th colspan="2" class="bg-primary">Total</th>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>
              <price-label :has_label="true" :value="(data.total) ? data.total.amount : 0 "/>
            </td>
          </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>
