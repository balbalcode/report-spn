<script>
import { reportMethods } from "~/store/helperActions";
export default {
  components: {
    ContentTableView: () => import("@utilities/molecules/content-view/ContentTableView"),
    PlainModal: () => import("@utilities/atoms/modal/PlainModal"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
    PriceLabel: () => import("@utilities/atoms/label/PriceLabel"),
    PlainLabel: () => import("@utilities/atoms/label/PlainLabel"),
    OverviewLabel: () => import("@utilities/atoms/label/OverviewLabel"),
  },
  props: {
    is_searching: { default: false },
    month: { default: "" },
    product: { default: () => [] },
    user: { default: () => [] },
    column: { default: "" },
  },
  data: () => ({
    data: {
      rows: [],
      total: {},
    },
    table: {
      dynamic_column: 4,
      static_column: 3,
      length_dynamic_column: 0,
      additional_dynamic_column: 1,
      dynamic_count: 0,
      total_column: 0,
    },
    selected_data: {},
    modal: {
      modal_preview: false,
    },
    helper: {
      is_loading: false,
      is_error: false,
    },
  }),
  watch: {
    is_searching: function (value) {
      if (value) this.processGetData();
    },
  },
  async mounted() {
    if (this.is_searching) await this.processGetData();
  },
  methods: {
    ...reportMethods,
    passErrorToParent(error) {
      this.$emit("error", { state: true, message: error });
    },
    passFormatDownloadReport() {
      let payload = { content: [] };
      if (this.data.rows.length > 0) {
        payload.content = [...this.data.rows];
        payload.content.push({
          date: "Total",
          amount: this.data.total?.amount ?? 0,
        });
      }
      this.$emit("ready", payload);
    },

    setPayloadGet() {
      const payload = {
        filter: [
          { key: "spot_id", value: this.$utility.getSpotId() },
          {
            key: "month",
            value: this.month
              ? this.month
              : this.$utility.formatDateMoment(new Date(), "YYYY-MM"),
          },
          { key: "type", value: "NOT_CASHIER" },
          { key: "status", value: "true" },
        ],
      };

      if (this.product && this.product.length) {
        const has_all_member = this.product.filter(
          (opt) => opt.value === "ALL_MEMBER"
        );
        if (has_all_member.length > 0) {
          payload.filter.push({
            key: "product_id",
            value: "",
          });
        } else {
          payload.filter.push({
            key: "product_id",
            value: this.$utility.encodeReportFilterUrl(this.product),
          });
        }
      }

      if (this.user && this.user.length) {
        payload.filter.push({
          key: "mgmt_user_id",
          value: this.$utility.encodeReportFilterUrl(this.user, "id"),
        });
      }

      return payload;
    },

    toggleModalImage(data) {
      if (data && data.payment_receipt) {
        this.selected_data = data
        this.modal.modal_preview = true
      } else {
        this.modal.modal_preview = false
        this.selected_data = {}
      }
    },

    async processGetData() {
      this.helper.is_loading = true;
      this.helper.is_error = false;
      try {
        let payload = this.setPayloadGet();
        this.data = await this.getMembershipReportPlateByDate(payload);
      } catch (error) {
        this.data = { rows: [], total: {} };
        this.helper.is_error = true;
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at processGetData in TableMembershipPlateReport`)
      }
      this.passFormatDownloadReport();
      this.helper.is_loading = false;
    },
  },
};
</script>
<template>
  <div>
    <content-table-view :length="data.rows.length" :is_loading="helper.is_loading" :is_error="helper.is_error"
      @reload="processGetData" loading-caption="Laporan belum tersedia" test_id="wrapper__table-membership-plate-report"
      ref="wrapper__table-membership-plate-report">
      <div class="table-responsive rounded-top mb-0">
        <table class="d-block table table-striped table-sticky-header report-table"
          data-testid="table-membership-plate-report">
          <thead class="thead-primary">
            <tr>
              <th class="cell-sticky" style="top: 1px" data-testid="th-number">
                No
              </th>
              <th class="cell-sticky" style="top: 1px" data-testid="th-date">
                Tanggal Aktivasi/Perpanjang
              </th>
              <th class="cell-sticky" style="top: 1px" data-testid="th-name">
                Nama
              </th>
              <th class="cell-sticky" style="top: 1px" data-testid="th-phone">
                No. HP
              </th>
              <th class="cell-sticky" style="top: 1px" data-testid="th-plate">
                No Polisi
              </th>
              <th class="cell-sticky" style="top: 1px" data-testid="th-period">
                Periode
              </th>
              <th class="cell-sticky" style="top: 1px" data-testid="th-old">
                PJP Lama
              </th>
              <th class="cell-sticky" style="top: 1px" data-testid="th-new">
                PJP Baru
              </th>
              <th class="cell-sticky" style="top: 1px" data-testid="th-product">
                Produk
              </th>
              <th class="cell-sticky" style="top: 1px" data-testid="th-user">
                User
              </th>
              <th class="cell-sticky" style="top: 1px" data-testid="th-payment-method">
                Metode Pembayaran
              </th>
              <th class="cell-sticky" style="top: 1px" data-testid="th-ref">
                Referensi
              </th>
              <th class="cell-sticky" style="top: 1px" data-testid="th-paid-date">
                Waktu Bayar
              </th>
              <th class="cell-sticky" style="top: 1px" data-testid="th-payment-receipt">
                Bukti Transfer
              </th>
              <th class="cell-sticky" style="top: 1px" data-testid="th-amount">
                Nominal
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in data.rows" :key="index">
              <td :data-testid="`tr-${index}__td-number`">{{ index + 1 }}</td>
              <td :data-testid="`tr-${index}__td-date`">{{ row.date }}</td>
              <td :data-testid="`tr-${index}__td-name`">
                {{ row.employee_name }}
              </td>
              <td :data-testid="`tr-${index}__td-phone`">
                <plain-label :ref="`tr-${index}__label-phone`" :test_id="`tr-${index}__label-phone`"
                  :value="row.user_phone_number" />
              </td>
              <td :data-testid="`tr-${index}__td-plate`">
                <plain-label :ref="`tr-${index}__label-plate`" :test_id="`tr-${index}__label-plate`"
                  :value="row.license_plate" />
              </td>
              <td :data-testid="`tr-${index}__td-period`">{{ row.period }}</td>
              <td :data-testid="`tr-${index}__td-old`" class="font-weight-bolder">
                {{ row.old_member }}
              </td>
              <td :data-testid="`tr-${index}__td-new`" class="font-weight-bolder">
                {{ row.new_member }}
              </td>
              <td :data-testid="`tr-${index}__td-product`">
                {{ row.product_name }}
              </td>
              <td :data-testid="`tr-${index}__td-user`">
                {{
                  row.mgmt_user_name ? row.mgmt_user_name : "Pengguna Aplikasi"
                }}
              </td>
              <td :data-testid="`tr-${index}__td-payment-method`">
                <plain-label :ref="`tr-${index}__label-payment-method`" :test_id="`tr-${index}__label-payment-method`"
                  :value="row.payment_method" />
              </td>
              <td :data-testid="`tr-${index}__td-ref`">
                <overview-label :ref="`tr-${index}__label-ref`" :test_id="`tr-${index}__label-ref`"
                  :value="row.reference" :limit_text="8" />
              </td>
              <td :data-testid="`tr-${index}__td-paid-date`">
                <plain-label :ref="`tr-${index}__label-paid-date`" :test_id="`tr-${index}__label-paid-date`"
                  :value="row.paid_date" />
              </td>
              <td :data-testid="`tr-${index}__td-payment-receipt`" :ref="`tr-${index}__td-payment-receipt`">
                <active-button v-if="row.payment_receipt" text="Lihat" type="outline" variant="grey"
                  :test_id="`tr-${index}__btn-preview-image`" :ref="`tr-${index}__btn-preview-image`"
                  @click="toggleModalImage(row)" />
                <span v-else class="font-size-10" :data-testid="`tr-${index}__label-unavailable`">
                  Tidak tersedia
                </span>
              </td>
              <td :data-testid="`tr-${index}__td-amount`">
                <price-label :ref="`tr-${index}__label-amount`" :test_id="`tr-${index}__label-amount`"
                  :value="row.amount" :has_label="true" />
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colspan="2" class="bg-primary">Total</th>
              <td v-for="empty in 12" :key="empty">-</td>
              <td>
                <price-label :has_label="true" :value="data.total ? data.total.amount : 0" />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </content-table-view>

    <plain-modal v-model="modal.modal_preview" @close="toggleModalImage" :test_id="`modal-preview-receipt`">
      <div>
        <img :src="selected_data.payment_receipt" class="img-fluid rounded"
          :data-testid="`modal-preview-receipt__image`" />
      </div>
      <div class="text-right mt-2">
        <active-button text="Tutup" type="outline" additional_class="px-5" variant="grey"
          :test_id="`modal-preview-receipt__btn-close`" :ref="`modal-preview-receipt__btn-close`"
          @click="toggleModalImage()" />
        <a :href="selected_data.payment_receipt" target="_blank" class="btn btn-primary btn-md text-dark px-5"
          :data-testid="`modal-preview-receipt__btn-download`" :id="`modal-preview-receipt__btn-download`">
          Unduh<i class="ic-link-01 ml-1"></i>
        </a>
      </div>
    </plain-modal>
  </div>
</template>
