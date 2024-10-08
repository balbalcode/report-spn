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

    <input-date-group additional_class_group="mb-2" format="MMM YYYY" value_type="YYYY-MM" type="month"
      v-model="form.month" label="Periode Laporan" placeholder="Pilih Periode" disabled_date="after-this-month"
      :test_id="`${id}__month`" :ref="`${id}__month`" is_submitted :is_error="$v.form.month.$error"
      :error_message="[{ state: $v.form.month.required, message: 'Periode tidak boleh kosong' }]" />
    <hr>

    <input-checkbox-group :options="options.transaction_type" v-model="form.transaction_type" label="Tipe Transaksi"
      is_submitted :test_id="`${id}__transaction-type`" :ref="`${id}__transaction-type`" has_button_clear
      has_button_select_all :is_error="$v.form.transaction_type.$error"
      :error_message="[{ state: $v.form.transaction_type.required, message: 'Tipe transaksi tidak boleh kosong' }]" />
    <hr>

    <input-tag-group v-model="form.emails" label="Email" :is_error="$v.form.emails.$error" :test_id="`${id}__emails`"
      :ref="`${id}__emails`" tag_separator=",; " placeholder="Ketik Email.." :is_disabled="true" is_submitted
      :error_message="[
        { state: $v.form.emails.notEmpty, message: 'Email tidak boleh kosong' },
        { state: !$v.form.emails.$each.$error, message: 'Input harus berformat email' }]" />
    <hr>

    <disabled-button v-if="helper.is_loading" additional_class="w-100" :ref="`${id}__btn-loading`"
      :test_id="`${id}__btn-loading`" />
    <active-button v-else additional_class="w-100" :ref="`${id}__btn-submit`" :test_id="`${id}__btn-submit`"
      @click="processSubmitForm()" />
  </div>
</template>

<script>
import { required, email } from "vuelidate/lib/validators"
import { reportMethods } from "@/store/helperActions";
import reportConstants from "@/constants/report"

export default {
  components: {
    ContentTitle: () => import("@utilities/atoms/title/ContentTitle"),
    ContentDivider: () => import("@utilities/atoms/utility/ContentDivider"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
    DisabledButton: () => import("@utilities/atoms/button/DisabledButton"),
    InputDateGroup: () => import("@utilities/molecules/input-group/InputDateGroup"),
    InputTagGroup: () => import("@utilities/molecules/input-group/InputTagGroup"),
    InputCheckboxGroup: () => import("@utilities/molecules/input-group/InputCheckboxGroup"),
  },

  data: () => ({
    id: "form-request-vehicle-validation-report",
    form: {
      month: "",
      transaction_type: [],
      emails: []
    },
    helper: {
      is_loading: false
    },
    options: {
      transaction_type: reportConstants.transaction_type()
    }
  }),

  validations: {
    form: {
      month: { required },
      transaction_type: { required },
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

  methods: {
    requestAllVehicleValidationReport: reportMethods.requestAllVehicleValidationReport,

    passCloseToParent() {
      this.$emit("close")
    },

    setPayloadRequestDownload() {
      return {
        spot_id: this.$utility.getSpotId(),
        month: this.form.month,
        emails: this.form.emails,
        transaction_type: this.form.transaction_type
      }
    },

    setDefaultEmail() {
      const user = this.$utility.getUserLoggedIn();
      this.form.emails = [user.email];
    },

    async processSubmitForm() {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        await this.processRequestDownload()
      }
    },

    async processRequestDownload() {
      this.helper.is_loading = true
      try {
        const payload = this.setPayloadRequestDownload()
        await this.requestAllVehicleValidationReport(payload)
        this.passCloseToParent()
      } catch (error) {
        this.$utility.fireToast("Gagal mengirim laporan", "dark", error.message)
      }
      this.helper.is_loading = false
    }
  }
}
</script>