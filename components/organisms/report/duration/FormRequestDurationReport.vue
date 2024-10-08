<template>
  <div>
    <div class="d-flex">
      <div class="px-lg-2">
        <i @click="passCloseToParent()" :id="`${id}__btn-close`" :data-testid="`${id}__btn-close`"
          class="bx bx-x cursor-pointer bx-sm"></i>
      </div>
      <div class="flex-grow-1 text-center px-0 pr-lg-5">
        <p class="my-0 font-size-18 font-weight-semibold">Kirim Laporan</p>
      </div>
    </div>
    <hr>

    <input-date-group additional_class_group="mb-2" format="DD MMM YYYY" value_type="YYYY-MM-DD" type="date"
      :is_range="true" v-model="form.date_range" label="Rentang Tanggal" placeholder="Pilih Rentang Tanggal"
      disabled_date="after-today" :test_id="`${id}__date-range`" :ref="`${id}__date-range`" is_submitted
      :is_error="$v.form.date_range.$error"
      :error_message="[{ state: $v.form.date_range.required, message: 'Rentang tanggal tidak boleh kosong' }]" />
    <hr>

    <p class="text-muted font-size-12 mt-2" v-if="helper.is_loading_product" :data-testid="`${id}__loader-product`">
      Sedang menyiapkan opsi produk untuk anda
      <span class="spinner-border spinner-border-sm"></span>
    </p>
    <input-select-group v-else :options="options.product" v-model="form.product" label="Produk" is_multiple is_nullable
      :test_id="`${id}__product`" :ref="`${id}__product`" has_button_clear has_button_select_all search_by="name" />
    <hr>

    <p class="text-muted font-size-12 mt-2" v-if="helper.is_loading_vehicle" :data-testid="`${id}__loader-vehicle`">
      Sedang menyiapkan opsi kendaraan untuk anda
      <span class="spinner-border spinner-border-sm"></span>
    </p>
    <input-checkbox-group v-else :options="options.vehicle" v-model="form.vehicle" label="Kendaraan"
      :test_id="`${id}__vehicle`" :ref="`${id}__vehicle`" has_button_clear has_button_select_all />
    <hr>

    <input-tag-group v-model="form.emails" label="Email" :is_error="$v.form.emails.$error" :test_id="`${id}__emails`"
      :ref="`${id}__emails`" tag_separator=",; " placeholder="Ketik Email.." :is_disabled="true" is_submitted
      :error_message="[
        { state: $v.form.emails.notEmpty, message: 'Email tidak boleh kosong' },
        { state: !$v.form.emails.$each.$error, message: 'Input harus berformat email' }]" />
    <hr>

    <disabled-button v-if="helper.is_loading_submit" additional_class="w-100" :ref="`${id}__btn-loading`"
      :test_id="`${id}__btn-loading`" />
    <active-button v-else additional_class="w-100" :ref="`${id}__btn-submit`" :test_id="`${id}__btn-submit`"
      @click="processSubmitForm()" />
  </div>
</template>

<script>
import { required, email } from "vuelidate/lib/validators"
import { reportMethods } from "@/store/helperActions";

export default {
  components: {
    ContentTitle: () => import("@utilities/atoms/title/ContentTitle"),
    ContentDivider: () => import("@utilities/atoms/utility/ContentDivider"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
    DisabledButton: () => import("@utilities/atoms/button/DisabledButton"),
    InputDateGroup: () => import("@utilities/molecules/input-group/InputDateGroup"),
    InputTagGroup: () => import("@utilities/molecules/input-group/InputTagGroup"),
    InputCheckboxGroup: () => import("@utilities/molecules/input-group/InputCheckboxGroup"),
    InputSelectGroup: () => import("@utilities/molecules/input-group/InputSelectGroup"),
  },

  data: () => ({
    id: "form-request-duration-report",
    form: {
      date_range: "",
      vehicle: [],
      product: [],
      emails: []
    },
    helper: {
      is_loading_submit: false,
      is_loading_product: false,
      is_loading_vehicle: false
    },
    options: {
      vehicle: [],
      product: []
    }
  }),

  validations: {
    form: {
      date_range: { required },
      emails: {
        notEmpty: function (value) {
          return value.length > 0;
        },
        $each: { email },
      },
    }
  },

  created() {
    this.setDefaultEmail();
  },

  async mounted() {
    await this.formatVehicleOptions()
    await this.formatProductOptions()
  },

  methods: {
    requestAllQuantityDurationReport: reportMethods.requestAllQuantityDurationReport,

    passCloseToParent() {
      this.$emit("close")
    },

    setPayloadRequestDownload() {
      let product = []
      if (this.form.product && this.form.product.length) {
        product = this.form.product.map(item => item.id)
      }

      return {
        spot_id: this.$utility.getSpotId(),
        emails: this.form.emails,
        date_range: this.form.date_range.join("_"),
        vehicle: this.form.vehicle,
        product
      }
    },

    setDefaultEmail() {
      const user = this.$utility.getUserLoggedIn();
      this.form.emails = [user.email];
    },

    async formatVehicleOptions() {
      this.helper.is_loading_vehicle = true
      try {
        this.options.vehicle = await this.$utility.getFormattedVehicle()
      } catch (error) {
        this.options.vehicle = []
        this.$utility.fireToast(
          "Gagal memuat jenis kendaraan",
          "primary",
          "Sistem gagal memuat data jenis kendaraan, anda tidak dapat melanjutkan proses. Mohon muat ulang halaman ini untuk melanjutkan",
        )
      }
      this.helper.is_loading_vehicle = false
    },

    async formatProductOptions() {
      this.helper.is_loading_product = true
      try {
        this.options.product = await this.$utility.getOptionProductMembership()
        this.options.product.unshift({ id: "NON_MEMBER", name: "Non-Member" })
      } catch (error) {
        this.options.product = []
        this.$utility.fireToast(
          "Gagal memuat produk",
          "primary",
          "Sistem gagal mendapatkan data produk, anda tidak dapat melanjutkan proses. Mohon muat ulang halaman ini"
        )
      }
      this.helper.is_loading_product = false
    },

    async processSubmitForm() {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        await this.processRequestDownload()
      }
    },

    async processRequestDownload() {
      this.helper.is_loading_submit = true
      try {
        const payload = this.setPayloadRequestDownload()
        await this.requestAllQuantityDurationReport(payload)
        this.passCloseToParent()
      } catch (error) {
        this.$utility.fireToast("Gagal mengirim laporan", "dark", error.message)
      }
      this.helper.is_loading_submit = false
    }
  }
}
</script>