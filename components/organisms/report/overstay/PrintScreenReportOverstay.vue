<script>
import {reportMethods} from "~/store/helperActions";

export default {
  components: {
    ContentSpan: () => import("@utilities/atoms/utility/ContentSpan"),
  },
  head: () => ({
    title: `Laporan Parkir Inap ${window.$nuxt.$route.query.month}`
  }),
  data: () => ({
    data: {
      rows: [],
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
    passErrorToParent(error) {
      this.$emit("error", {state: true, message: error})
    },

    setPayloadGet() {
      return {
        month: window.$nuxt.$route.query.month,
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

    formatMembershipData(membership_detail) {
      let detail = {
        membership_name: '-',
        membership_card_id: '-',
        membership_rf_id: '-',
        membership_plate: '-',
      }
      if (membership_detail) {
        // set membership plate
        let plates = []
        if (membership_detail.license_plate) plates.push(membership_detail.license_plate)
        if (membership_detail.second_license_plate) plates.push(membership_detail.second_license_plate)
        if (plates.length > 0) detail.membership_plate = plates.join(" atau ")

        if (membership_detail.employee_detail) {
          if (membership_detail.employee_detail.card_id) detail.membership_card_id = membership_detail.employee_detail.card_id
          if (membership_detail.employee_detail.rf_id) detail.membership_rf_id = membership_detail.employee_detail.rf_id
        }
      }
      return detail
    },

    formatContentReport(rows) {
      try {
        return rows.map((row) => ({
          ...this.formatMembershipData(row.membership_detail),
          transaction_id: row.id,
          time_in: this.$utility.formatLocalTimezone(row.time_in, "DD/MM/YYYY hh:mm"),
          time_out: this.$utility.formatLocalTimezone(row.time_out, "DD/MM/YYYY hh:mm"),
          total_days: row.total_days,
          normal_amount: this.$utility.convertToRupiah(row.normal_amount),
          overstay_amount: this.$utility.convertToRupiah(row.overstay_amount),
          total_amount: this.$utility.convertToRupiah(row.total_amount),
        }));
      } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatContentReport in PrintScreenReportOverstay`)
        return []
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
        const payload = this.setPayloadGet();
        this.data = await this.getOverstayReportByDate(payload);
        this.data.rows = this.formatContentReport(this.data.rows);
      } catch (error) {
        this.data = {row: []}
        this.helper.is_error = true
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
            <th>ID Transaksi</th>
            <th>Penerima</th>
            <th>No. Kartu</th>
            <th>No. RFID</th>
            <th>Plat</th>
            <th>In</th>
            <th>Out</th>
            <th>Lama Inap</th>
            <th>Tarif Parkir</th>
            <th>Tarif Inap</th>
            <th>Total Bayar</th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in data.rows" :key="`row-${index}`">
              <td>{{row.transaction_id}}</td>
              <td>{{ row.membership_name }}</td>
              <td>{{ row.membership_card_id }}</td>
              <td>{{ row.membership_rf_id }}</td>
              <td>{{ row.membership_plate }}</td>
              <td>{{ row.time_in }}</td>
              <td>{{ row.time_out }}</td>
              <td>{{ row.total_days }} hari</td>
              <td>{{ row.normal_amount }}</td>
              <td>{{ row.overstay_amount }}</td>
              <td>{{ row.total_amount }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
