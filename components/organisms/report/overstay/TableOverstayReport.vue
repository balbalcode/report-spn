<template>
  <div>
    <div class="row" v-if="helper.is_loading">
      <content-span />
    </div>

    <div class="row" v-else-if="helper.is_error">
      <content-span
        :has_animation="false"
        image="error.png" size="xl"
        caption="Gagal memuat data"
        has_reload_button
        @reload="processGetData"
      />
    </div>

    <div class="row" v-else-if="data.rows.length < 1">
      <content-span :has_animation="false" image="empty.png" size="xl" caption="Laporan belum tersedia" />
    </div>
    <div v-else class="row py-1 px-3">
      <div class="col-12 p-0 rounded">
        <table class="d-block table table-striped table-sticky-header report-table">
          <thead class="thead-primary w-100">
            <tr>
              <th class="cell-sticky" style="top: 1px;">ID Transaksi</th>
              <th class="cell-sticky" style="top: 1px;">Penerima</th>
              <th class="cell-sticky" style="top: 1px;">No. Kartu</th>
              <th class="cell-sticky" style="top: 1px;">No. RFID</th>
              <th class="cell-sticky" style="top: 1px;">Plat</th>
              <th class="cell-sticky" style="top: 1px; width: 10%;">In</th>
              <th class="cell-sticky" style="top: 1px;">Out</th>
              <th class="cell-sticky" style="top: 1px;">Lama Inap</th>
              <th class="cell-sticky" style="top: 1px;">Tarif Parkir</th>
              <th class="cell-sticky" style="top: 1px;">Tarif Inap</th>
              <th class="cell-sticky" style="top: 1px;">Total Bayar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in report" :key="`row-${index}`">
              <td>
                <overview-label
                  :has_space="false"
                  :value="row.transaction_id"
                  limit_text="12"
                  :is_italic="false"
                />
              </td>
              <td>{{ row.membership_name }}</td>
              <td>{{ row.membership_card_id }}</td>
              <td>{{ row.membership_rf_id }}</td>
              <td>
                {{ row.membership_plate }}
              </td>
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
    <b-toast no-auto-hide :visible="helper.last_sync !== null" id="toast_last_sync" toaster="b-toaster-bottom-right"
             header-class="d-none" variant="dark">
      <template slot="default">
        <div class="d-flex flex-row">
          <div class="text-dark">
              <span class="rounded-circle bg-primary font-weight-bold" style="padding: .2em .7em">
                !
              </span>
          </div>
          <div class="align-self-lg-center align-middle text-white flex-grow-1 ml-1 font-size-12">
            Terakhir diperbarui {{ $utility.formatLocalTimezone(helper.last_sync, 'DD/MM/YYYY HH:mm:ss') }}
          </div>
          <div class="align-self-lg-center align-middle text-white float-right">
            <i class="bx bx-x cursor-pointer" @click="$bvToast.hide('toast_last_sync')"></i>
          </div>
        </div>
      </template>
    </b-toast>
  </div>
</template>

<script>
import { reportMethods } from "@/store/helperActions";

export default {
  components: {
    ContentTableView: () => import("@utilities/molecules/content-view/ContentTableView"),
    ContentSpan: () => import("@utilities/atoms/utility/ContentSpan"),
    OverviewLabel: () => import("@utilities/atoms/label/OverviewLabel"),
  },

  props: {
    is_searching: { default: false },
    month: { default: "" },
  },

  data: () => ({
    data: {
      rows: [],
    },
    report: [],
    helper: {
      last_sync: null,
      is_loading: false,
      is_error: false,
    },
  }),

  watch: {
    is_searching: {
      async handler(value) {
        if (value) await this.processGetData();
      },
    },
  },

  async mounted() {
    if (this.is_searching) await this.processGetData();
  },

  methods: {
    ...reportMethods,

    passFormatDownloadReport() {
      let payload = { header: {}, content: [] };
      if (this.data.rows.length > 0) {
        this.report = this.formatContentReport(this.data.rows);
        payload = { header: this.formatHeaderReport(), content: this.report };
      }
      this.$emit("ready", payload);
    },

    setPayloadGet() {
      return {
        month: this.month,
        spot_id: this.$utility.getSpotId(),
        opener: this.$route.path,
      };
    },

    formatHeaderReport() {
      return {
        "ID Transaksi": "transaction_id",
        "Penerima": "membership_name",
        "No. Kartu": "membership_card_id",
        "No. RFID": "membership_rf_id",
        "Plat": "membership_plate",
        "In": "time_in",
        "Out": "time_out",
        "Lama Inap": "total_days",
        "Tarif Parkir": "normal_amount",
        "Tarif Inap": "overstay_amount",
        "Total Bayar": "total_amount",
      };
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
        this.$sentry.captureMessage(`${error.message} at formatContentReport in TableReportOverstay`)
        return []
      }
    },

    async processGetData() {
      this.helper.is_loading = true;
      this.helper.is_error = false;
      try {
        const payload = this.setPayloadGet();
        this.data = await this.getOverstayReportByDate(payload);
        this.helper.last_sync = this.data.last_sync
        this.passFormatDownloadReport();
      } catch (error) {
        this.data = {rows: []}
        this.helper.is_error = true;
      }
      this.helper.is_loading = false;
    },
  },
};
</script>
