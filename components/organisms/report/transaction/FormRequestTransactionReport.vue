<script>
import { required, requiredIf, email } from "vuelidate/lib/validators";
import { reportMethods } from "@/store/helperActions";
import report_constants from "@/constants/report";

export default {
  data: () => ({
    form: {
      period: "",
      date: "",
      date_range: "",

      with_filter: false,
      filter: "",
      vehicle: "",
      product: "",
      rf_id: "",
      license_plate: "",
      timezone: "",
      emails: [],
      time_type: "",
      is_submitted: false,
      is_loading: false,
    },
    options: {
      time_type: report_constants.time_type(),
      period: report_constants.period(),
      filter_transaction: report_constants.filter_transaction(),
      product: [],
      vehicle: [],
    },
  }),
  validations: {
    form: {
      date: {
        required: requiredIf(function () {
          return this.form.period === "daily";
        }),
      },
      date_range: {
        required: requiredIf(function () {
          return this.form.period === "date_range";
        }),
        validRange: function (value) {
          const days =
            (new Date(value[1]) - new Date(value[0])) / (1000 * 60 * 60 * 24);
          return this.form.period !== "date_range" || (days > 0 && days <= 31);
        },
      },
      emails: {
        notEmpty: function (value) {
          return value.length > 0;
        },
        $each: { email },
      },
      time_type: { required },
      period: { required },
    },
  },
  async mounted() {
    await this.setFilterOptions();
    this.timezone = this.$utility.getSpotTimezone();
  },
  created() {
    this.setDefaultEmail();
  },
  methods: {
    ...reportMethods,
    passErrorToParent(error) {
      this.$emit("error", error);
    },
    async setFilterOptions() {
      // Product options
      this.options.product = await this.$utility.getOptionProductMembership();
      this.options.product.unshift({ id: "NON_MEMBER", name: "Non Member" });
      // Vehicle options
      this.options.vehicle = await this.$utility.getFormattedVehicle();
    },
    setPayloadRequestReport() {
      let payload = {
        spot_id: this.$utility.getSpotId(),
        time_type: this.form.time_type,
        timezone: this.form.timezone,
        emails: this.form.emails,
        opener: this.$route.path,
      };
      if (this.form.period === "daily") payload.date = this.form.date;
      if (this.form.period === "date_range")
        payload.date_range = this.form.date_range;
      if (this.form.filter && this.form[this.form.filter]) {
        if (
          this.form.filter === "license_plate" ||
          this.form.filter === "rf_id"
        )
          payload[this.form.filter] = this.form[this.form.filter];
        else if (this.form.filter === "product")
          payload.product_id = this.form.product.id;
        else if (this.form.filter === "vehicle")
          payload.vehicle_code = this.form.vehicle.value;
      }
      return payload;
    },
    setDefaultEmail() {
      const user = this.$utility.getUserLoggedIn();
      this.form.emails = [user.email];
    },
    passCancelToParent() {
      this.$emit("cancel");
    },
    async processSubmitForm() {
      this.form.is_loading = true;
      this.form.is_submitted = true;
      this.$v.form.$touch();
      if (!this.$v.form.$invalid) {
        await this.processRequestReport();
        this.form.is_submitted = false;
      }
      this.form.is_loading = false;
    },
    async processRequestReport() {
      try {
        const payload = this.setPayloadRequestReport();
        await this.requestTransactionReport(payload);
      } catch (error) {
        this.passErrorToParent(error);
      }
      this.$emit("cancel");
    },
  },
  components: {
    InputTagGroup: () =>
      import("@utilities/molecules/input-group/InputTagGroup"),
    InputDateGroup: () =>
      import("@utilities/molecules/input-group/InputDateGroup"),
    InputRadioGroup: () =>
      import("@utilities/molecules/input-group/InputRadioGroup"),
    InputTextGroup: () =>
      import("@utilities/molecules/input-group/InputTextGroup"),
    InputSelectGroup: () =>
      import("@utilities/molecules/input-group/InputSelectGroup"),
    SwitchInput: () => import("@utilities/atoms/input/SwitchInput"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
    DisabledButton: () => import("@utilities/atoms/button/DisabledButton"),
    PlainLabel: () => import("@utilities/atoms/label/PlainLabel"),
    SquareCard: () => import("@utilities/atoms/card/SquareCard"),
  },
};
</script>
<template>
  <div class="p-2">
    <h5 class="text-dark font-weight-bolder">Request Download Laporan</h5>
    <square-card :has_shadow="false" :has_border="true">
      <!-- Data Transaksi -->
      <input-radio-group
        v-model="form.time_type"
        label="Data Transaksi"
        :is_submitted="form.is_submitted"
        :error_message="[
          {
            state: $v.form.time_type.required,
            message: 'Data Transaksi tidak boleh kosong',
          },
        ]"
        :is_error="$v.form.time_type.$error"
        :options="options.time_type"
        id="request-time-type"
      />

      <!-- Periode -->
      <input-radio-group
        v-model="form.period"
        label="Periode"
        :is_submitted="form.is_submitted"
        :error_message="[
          {
            state: $v.form.period.required,
            message: 'Periode tidak boleh kosong',
          },
        ]"
        :is_error="$v.form.period.$error"
        :options="options.period"
        id="request-period"
      />

      <!-- Date -->
      <input-date-group
        v-if="form.period === 'daily'"
        additional_class_group="mb-2"
        format="YYYY-MM-DD"
        value_type="format"
        type="date"
        v-model="form.date"
        label="Tanggal"
        placeholder="Pilih Tanggal"
        :is_submitted="form.is_submitted"
        :error_message="[
          {
            state: $v.form.date.required,
            message: 'Tanggal tidak boleh kosong',
          },
        ]"
        :is_error="$v.form.date.$error"
        disabled_date="after-today"
        id="request-date"
      />

      <!-- Date Range -->
      <input-date-group
        v-if="form.period === 'date_range'"
        additional_class_group="mb-2"
        format="YYYY-MM-DD"
        value_type="format"
        type="date"
        v-model="form.date_range"
        label="Rentang Tanggal"
        placeholder="Pilih Rentang Tanggal"
        :is_submitted="form.is_submitted"
        :error_message="[
          {
            state: $v.form.date_range.required,
            message: 'Rentang Tanggal tidak boleh kosong',
          },
          {
            state: $v.form.date_range.validRange,
            message: 'Selisih tanggal harus di antara 1 sampai 31 hari',
          },
        ]"
        :is_range="true"
        :is_error="$v.form.date_range.$error"
        disabled_date="after-today"
        id="request-date-range"
      />

      <div class="px-2 pb-3">
        <div class="row px-1">
          <b-col cols="12" lg="12" class="px-0 py-1">
            <p class="font-size-12 my-0 font-weight-bold">Zona Waktu</p>
          </b-col>
          <b-col class="border py-2 border-right-0 rounded-left">
            <div class="custom-control custom-radio custom-control-inline">
              <input
                type="radio"
                id="opt_wib"
                data-testid="opt_wib"
                v-model="form.timezone"
                name="rd"
                class="custom-control-input"
                value="Asia/Jakarta"
              />
              <label
                class="custom-control-label green"
                id="label-wib"
                for="opt_wib"
                >WIB</label
              >
            </div>
          </b-col>
          <b-col class="border py-2">
            <div class="custom-control custom-radio custom-control-inline">
              <input
                type="radio"
                id="opt_wita"
                data-testid="opt_wita"
                v-model="form.timezone"
                name="rd"
                class="custom-control-input"
                value="Asia/Ujung_Pandang"
              />
              <label
                class="custom-control-label green"
                id="label-wita"
                for="opt_wita"
                >WITA</label
              >
            </div>
          </b-col>
          <b-col class="border py-2 border-left-0 rounded-right">
            <div class="custom-control custom-radio custom-control-inline">
              <input
                type="radio"
                id="opt_wit"
                data-testid="opt_wit"
                v-model="form.timezone"
                name="rd"
                class="custom-control-input"
                value="Asia/Jayapura"
              />
              <label
                class="custom-control-label green"
                id="label-wit"
                for="opt_wit"
                >WIT</label
              >
            </div>
          </b-col>
        </div>
      </div>

      <!-- Toggle Filter -->
      <switch-input
        v-model="form.with_filter"
        id="toggle-filter"
        :has_text="true"
        additional_class="mb-3"
        checked_text="Dengan filter"
        unchecked_text="Tanpa filter"
      />

      <!-- Filter -->
      <template v-if="form.with_filter">
        <!-- Filter Options -->
        <input-radio-group
          v-model="form.filter"
          :is_submitted="form.is_submitted"
          additional_class_input="col-5"
          label="Filter"
          :options="options.filter_transaction"
          id="request-filter"
        />
        <!-- License Plate Filter -->
        <input-text-group
          v-if="form.filter === 'license_plate'"
          v-model="form.license_plate"
          id="request-license-plate"
          label="Plat Nomor"
          placeholder="X 9999 XXX"
        />
        <!-- RFID Filter -->
        <input-text-group
          v-if="form.filter === 'rf_id'"
          v-model="form.rf_id"
          id="request-rfid"
          label="RFID"
          placeholder="RFID"
        />
        <!-- Product Filter -->
        <input-select-group
          v-if="form.filter === 'product'"
          v-model="form.product"
          id="request-product"
          label="Produk"
          :options="options.product"
          search_by="name"
        />
        <!-- Vehicle Code Filter -->
        <input-select-group
          v-if="form.filter === 'vehicle'"
          v-model="form.vehicle"
          id="request-vehicle"
          label="Tipe Kendaraan"
          :options="options.vehicle"
        />
      </template>

      <!-- Email -->
      <plain-label
        value="Email"
        :is_bold="true"
        variant="dark"
        additional_class="mb-1"
      />
      <!-- <small class="d-block mb-2">Masukkan email pada kolom input dibawah ini, dapat lebih dari 1 email. Data akan dikirimkan ke alamat email yang tercantum.</small> -->
      <input-tag-group
        v-model="form.emails"
        label="Email"
        :is_error="$v.form.emails.$error"
        id="request-emails"
        :error_message="[
          {
            state: $v.form.emails.notEmpty,
            message: 'Email tidak boleh kosong',
          },
          {
            state: !$v.form.emails.$each.$error,
            message: 'Input harus berformat email',
          },
        ]"
        :is_disabled="true"
        additional_class_label="d-none"
        tag_separator=",; "
        placeholder="Ketik Email.."
        :is_submitted="form.is_submitted"
      />
      <div class="row">
        <div class="col-12 text-right">
          <active-button
            text="Batal"
            type="outline"
            variant="grey"
            additional_class="px-5"
            @click="passCancelToParent"
          />
          <disabled-button v-if="form.is_loading" additional_class="px-5" />
          <active-button
            v-else
            text="Kirim"
            @click="processSubmitForm"
            additional_class="px-5"
          />
        </div>
      </div>
    </square-card>
  </div>
</template>