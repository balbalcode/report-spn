<script>
import {
  additionalServiceMethods,
  officerMethods,
  productMethods,
  userMethods,
} from "~/store/helperActions";
import constant_resolution_center from "@/constants/resolution-center";
import constant_report from "@/constants/report";
import constant_general from "@/constants/general";
import constant_officer from "@/constants/officer";

const leave_type_list = constant_officer.leave_type();
const leave_reason_list = constant_officer.leave_reason();

export default {
  components: {
    PlainModal: () => import("@utilities/atoms/modal/PlainModal"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
    DateInput: () => import("@utilities/atoms/input/DateInput"),
    SelectInput: () => import("@utilities/atoms/input/SelectInput"),
    CheckboxInput: () => import("@utilities/atoms/input/CheckboxInput"),
    RadioInput: () => import("@utilities/atoms/input/RadioInput"),
    InputSelectGroup: () =>
      import("@utilities/molecules/input-group/InputSelectGroup"),
    InputCheckboxGroup: () =>
      import("@utilities/molecules/input-group/InputCheckboxGroup"),
    ModalFilterView: () =>
      import("@utilities/molecules/modal-view/ModalFilterView"),
  },
  props: {
    id: { default: "", type: String },
    filter: { default: () => ({}) },
    align: { default: "ltr" },
    open_on_init: { default: false, type: Boolean },
    btn_modal_type: { default: "outline" },
    is_disabled: { default: false, type: Boolean },
    is_not_update_init: { default: false, type: Boolean },
    has_administration_type: { default: false, type: Boolean },
    has_problem_media: { default: false, type: Boolean },
    has_leave_type: { default: false, type: Boolean },
    has_vehicle: { default: false, type: Boolean },
    has_period: { default: false, type: Boolean },
    has_shift: { default: false, type: Boolean },
    has_type: { default: false, type: Boolean },
    has_pos: { default: false, type: Boolean },
    has_timezone: { default: false, type: Boolean },
    has_user: { default: false, type: Boolean },
    has_officer: { default: false, type: Boolean },
    is_single_officer: { default: false, type: Boolean },
    has_product: { default: false, type: Boolean },
    is_single_product: { default: false, type: Boolean },
    has_spot: { default: false, type: Boolean },
    has_location: { default: false, type: Boolean },
    is_single_location: { default: false, type: Boolean },
    is_required_location: { default: false, type: Boolean },
    is_init_all_column: { type: Boolean },
    is_init_all_vehicle: { type: Boolean },
    has_date: { default: false, type: Boolean },
    has_date_range: { default: false, type: Boolean },
    has_time_range: { default: false, type: Boolean },
    has_column_setting: { default: false, type: Boolean },
    has_service: { default: false, type: Boolean },
    has_reason: { default: false, type: Boolean },
    has_transaction_status: { default: false, type: Boolean },
    has_transaction_type: { default: false, type: Boolean },
    has_non_member: { default: false, type: Boolean },
    has_all_member: { default: false, type: Boolean },
    option_column: { default: () => [] },
  },
  data: () => ({
    month: "",
    date: "",
    date_range: [],
    time_range: ["00:00", "23:59"],
    timezone: "",
    leave_type: [],
    leave_reason: [],
    vehicle: [],
    reason: [],
    user: [],
    officer: [],
    column: [],
    product: [],
    administration_type: constant_report.administration_type(0),
    transaction_type: {},
    gate_type: {},
    transaction_status: constant_resolution_center.transaction_status_type(1),
    service: [],
    location: [],
    problem_media: constant_report.problem_media(),
    shift: constant_report.by_shift(0),
    type: constant_report.report_type(0),
    pos: constant_report.by_pos(0),
    helper: {
      old_gate_type: {},
      is_rendering: true,
      gate_type: false,
      limit_options: 20,
      tooltip: {
        state: false,
        text: "",
        old_text: "",
      },
      search: {
        user: "",
        officer: "",
      },
      loading: {
        user: false,
        officer: false,
      },
      prefix_product: "NON_MEMBER",
    },
    options: {
      prefix_product: [
        { text: "Non Membership", value: "NON_MEMBER" },
        { text: "Membership", value: "MEMBER" },
      ],
      shift: constant_report.by_shift(),
      type: constant_report.report_type(),
      pos: constant_report.by_pos(),
      timezones: constant_general.global_timezone(),
      administration_type: constant_report.administration_type(),
      transaction_status: constant_resolution_center.transaction_status_type(),
      reason: constant_resolution_center.reason_type(),
      leave_type: leave_type_list,
      leave_reason: [],
      problem_media: constant_report.problem_media(),
      transaction_type: constant_report.transaction_type(),
      gate_type: constant_report.gate_type(),
      vehicle: [],
      user: [],
      officer: [],
      product: [],
      service: [],
      location: [],
    },
    modal: {
      modal_filter: false,
    },
  }),
  validations: {
    location: {
      maxLength: function (value) {
        return (
          !this.has_location || this.is_single_location || value.length <= 10
        );
      },
    },
    product: {
      maxLength: function (value) {
        if (!this.has_product) return true;
        else {
          if (
            this.helper.prefix_product === "NON_MEMBER" &&
            this.has_non_member
          ) {
            return true;
          } else {
            if (this.is_single_product) {
              return true;
            } else {
              return value.length <= 10;
            }
          }
        }
      },
      required: function (value) {
        if (!this.has_product) return true;
        else {
          if (
            this.helper.prefix_product === "NON_MEMBER" &&
            this.has_non_member
          ) {
            return true;
          } else {
            if (this.is_single_product) {
              return value.hasOwnProperty("value");
            } else {
              return value.length > 0;
            }
          }
        }
      },
    },
    user: {
      maxLength: function (value) {
        return !this.has_user || value.length <= 10;
      },
    },
    officer: {
      maxLength: function (value) {
        return (
          !this.has_officer || this.is_single_officer || value.length <= 10
        );
      },
    },
    leave_type: {
      minLength: function (value) {
        return !this.has_leave_type || value.length > 0;
      },
    },
  },
  watch: {
    transaction_type(value) {
      if (value.value === "MEMBER") {
        this.gate_type = this.helper.old_gate_type;
        this.helper.gate_type = true;
      } else {
        this.helper.old_gate_type = this.gate_type;
        this.gate_type = {};
        this.helper.gate_type = false;
      }
    },
    leave_type(value) {
      this.toggleClearOptionLeaveReason();
      if (Array.isArray(value)) {
        this.options.leave_reason = leave_reason_list.filter((reason) =>
          value.includes(reason.type)
        );
      }
    },
    "helper.prefix_product": function (value) {
      if (value === "MEMBER" && !this.is_single_product) {
        this.product = [];
      } else {
        this.product = {};
      }
    },
  },
  async created() {
    this.processGenerateCaption();
    this.processClearFilter();
    this.setDefaultFilter();
    if (!this.is_not_update_init) this.passUpdateToParent();
    await this.processGetOptions();
    this.setDefaultLocation();
  },
  methods: {
    ...productMethods,
    ...userMethods,
    ...additionalServiceMethods,
    ...officerMethods,

    passUpdateToParent() {
      this.$v.$touch();
      if (!this.$v.$error) {
        let payload = this.setPayloadParent();
        this.$emit("update", payload);
      }
    },

    passErrorToParent(error) {
      this.$emit("error", { state: true, message: error });
    },

    setDefaultFilter() {
      const today = new Date();
      if (this.has_period)
        this.month = this.$utility.formatDateMoment(today, "YYYY-MM");
      if (this.has_date)
        this.date = this.$utility.formatDateMoment(today, "YYYY-MM-DD");
      if (this.has_date_range) {
        const formattedToday = this.$utility.formatDateMoment(
          today,
          "YYYY-MM-DD"
        );
        this.date_range = [formattedToday, formattedToday];
      }
      if (this.has_timezone) this.timezone = this.$utility.getSpotTimezone();
      if (this.has_column_setting) this.setDefaultColumn();
      if (this.has_vehicle) this.setDefaultVehicle();
    },

    setDefaultLocation() {
      if (this.is_single_location) {
        if (this.is_required_location && this.options.location.length > 0)
          this.location = this.options.location[0];
        else this.location = {};
      } else {
        if (this.is_required_location && this.options.location.length > 0)
          this.location = [this.options.location[0]];
        else this.location = [];
      }
    },

    setDefaultColumn() {
      if (this.is_init_all_column) this.column = this.option_column;
    },

    setDefaultVehicle() {
      if (this.is_init_all_vehicle) this.vehicle = this.options.vehicle;
    },

    setPayloadParent() {
      try {
        let payload = {};
        if (this.has_period) payload.month = this.month ?? "";
        if (this.has_date) payload.date = this.date ?? "";
        if (this.has_date_range) payload.date_range = this.date_range ?? "";
        if (this.has_time_range)
          payload.time_range = this.formatPayloadTimeRange();
        if (this.has_spot) payload.spot_id = this.$utility.getSpotId();
        if (this.has_vehicle) payload.vehicle = this.vehicle ?? "";
        if (this.has_product) {
          payload.product =
            this.options.product.length > 5
              ? this.product
              : this.product.map((opt) => {
                  return { value: opt };
                });
        }
        if (this.has_user) {
          payload.user =
            this.is_single_user && this.user?.id ? [this.user] : this.user;
        }
        if (this.has_officer) {
          payload.officer =
            this.is_single_officer && this.officer?.id
              ? [this.officer]
              : this.officer;
        }
        if (this.has_leave_type) {
          payload.leave_type = this.leave_type ?? [];
          payload.leave_reason = this.leave_reason ?? [];
        }
        if (this.has_shift) payload.shift = this.shift ?? "";
        if (this.has_type) payload.type = this.type ?? "";
        if (this.has_pos) payload.pos = this.pos ?? "";
        if (this.has_column_setting) payload.column = this.column ?? "";
        if (this.has_service) payload.service = this.service ?? "";
        if (this.has_location) payload.location = this.location ?? "";
        if (this.has_timezone) payload.timezone = this.timezone ?? "";
        if (this.has_administration_type)
          payload.administration_type = this.administration_type ?? "";
        if (this.has_transaction_type)
          payload.transaction_type = this.transaction_type ?? "";
        if (this.helper.gate_type) payload.gate_type = this.gate_type ?? "";
        if (this.has_transaction_status)
          payload.transaction_status = this.transaction_status ?? "";
        if (this.has_reason) payload.reason = this.reason ?? "";
        if (this.has_gate) payload.gate = this.gate ?? "";
        if (this.has_balance_status)
          payload.balance_status = this.balance_status ?? "";
        if (this.has_problem_media)
          payload.problem_media = this.problem_media ?? "";
        return payload;
      } catch (error) {
        this.$utility.setErrorContextSentry(error);
        this.$sentry.captureMessage(
          `${error.message} at setPayloadParent in FilterReport`
        );
        this.passErrorToParent(error);
      }
    },

    setPayloadProduct() {
      if (this.helper.prefix_product === "NON_MEMBER") {
        return [{ value: "NON_MEMBER" }];
      }
      if (this.is_single_product) return this.product;
      else {
        return this.options.product.length > 5
          ? this.product
          : this.product.map((opt) => {
              return { value: opt };
            });
      }
    },

    setPayloadGetOptionOfficer() {
      return {
        filter: [
          { key: "spot_id", value: this.$utility.getSpotId() },
          { key: "data_type", value: "selectbox" },
          { key: "name", value: this.helper.search.officer },
        ],
      };
    },

    setPayloadGetOptionUser() {
      return {
        filter: [
          { key: "spot_id", value: this.$utility.getSpotId() },
          { key: "data_type", value: "selectbox" },
          { key: "name", value: this.helper.search.user },
        ],
      };
    },

    setPayloadGetOptionService() {
      return {
        spot_id: this.$utility.getSpotId(),
      };
    },

    setSearchOfficer(search) {
      this.helper.search.officer = search;
    },

    setSearchUser(search) {
      this.helper.search.user = search;
    },

    toggleSelectOptionColumn() {
      this.column = this.option_column;
    },
    toggleSelectOptionLeaveReason() {
      this.leave_reason = this.options.leave_reason.map((opt) => opt.value);
    },
    toggleSelectOptionVehicle() {
      this.vehicle = this.options.vehicle;
    },
    toggleClearOptionLeaveReason() {
      this.leave_reason = [];
    },
    toggleClearOptionVehicle() {
      this.vehicle = [];
    },
    toggleClearOptionColumn() {
      this.column = [];
    },
    toggleClearOptionOfficer() {
      this.officer = this.is_single_officer ? "" : [];
    },
    toggleSelectOptiongate() {
      this.gate = this.options.gate;
    },
    toggleClearOptiongate() {
      this.gate = [];
    },

    async formatOptionsProduct() {
      const products = await this.$utility.getOptionProductMembership();
      this.options.product = products.map((product) => ({
        text: product.name,
        value: product.id,
      }));
      if (this.has_all_member)
        this.options.product.unshift({
          text: "Semua Member",
          value: "ALL_MEMBER",
        });
    },

    formatPayloadTimeRange() {
      return {
        start:
          this.time_range[0] && this.time_range[0] !== "None"
            ? this.time_range[0]
            : "",
        end:
          this.time_range[1] && this.time_range[1] !== "None"
            ? this.time_range[1]
            : "",
      };
    },

    async formatOptionsVehicle() {
      try {
        const data = await this.$utility.getVehicle();
        this.options.vehicle = [];
        let default_value = [];
        const vehicle_groups = ["mt", "mb", "kl"];

        vehicle_groups.forEach((vehicle_group, index) => {
          if (data[vehicle_group] && Array.isArray(data[vehicle_group])) {
            const vehicles = data[vehicle_group].map((vehicle) => ({
              text: vehicle.name,
              value: vehicle.code,
              alias: vehicle.alias,
            }));
            default_value = default_value.concat(vehicles);
          }
        });
        this.vehicle = default_value;
        this.options.vehicle = default_value;
      } catch (error) {
        this.options.vehicle = [];
        this.$utility.setErrorContextSentry(error);
        this.$sentry.captureMessage(
          `${error.message} at formatOptionsVehicle in FilterReport`
        );
        this.passErrorToParent(error);
      }
    },

    formatOptionsService(data) {
      let arr_service = [];
      data.forEach((item) => {
        arr_service.push({
          text: item.name,
          value: item.alias,
        });
      });
      this.options.service = arr_service;
      this.service = arr_service;
    },

    processResetUser() {
      this.user = [];
    },

    processResetTransactionType() {
      this.transaction_type = {};
    },

    processResetGateType() {
      this.gate_type = {};
    },

    async processGetOptions() {
      if (this.has_vehicle) await this.formatOptionsVehicle();
      if (this.has_product) await this.formatOptionsProduct();
      if (this.has_service) await this.processGetService();
      if (this.has_location) await this.processGetLocation();
      if (this.has_column_setting) this.column = this.option_column;
      if (this.has_administration_type)
        this.administration_type = this.options.administration_type[0];
      this.helper.is_rendering = false;
    },

    async processGetOfficer() {
      this.helper.loading.officer = true;
      try {
        let payload = this.setPayloadGetOptionOfficer();
        let { values } = await this.getOfficer(payload);
        this.options.officer = values;
        document.querySelector(`input#filter-opt__${this.id}-officer`).focus()
        await this.$nextTick()
      } catch (error) {
        this.options.officer = [];
        this.$utility.setErrorContextSentry(error);
        this.$sentry.captureMessage(
          `${error.message} at processGetOfficer in FilterReport`
        );
        this.passErrorToParent(error);
      }
      this.helper.loading.officer = false;
    },

    async processGetUser() {
      this.helper.loading.user = true;
      try {
        let payload = this.setPayloadGetOptionUser();
        let { values } = await this.getUser(payload);
        this.options.user = values;
        document.querySelector(`input#filter-opt__${this.id}-user`).focus()
        await this.$nextTick()
      } catch (error) {
        this.options.user = [];
        this.$utility.setErrorContextSentry(error);
        this.$sentry.captureMessage(
          `${error.message} at processGetUser in FilterReport`
        );
        this.passErrorToParent(error);
      }
      this.helper.loading.user = false;
    },

    async processGetService() {
      try {
        let payload = this.setPayloadGetOptionService();
        let data = await this.getAdditional(payload);
        this.formatOptionsService(data);
      } catch (error) {
        this.$utility.setErrorContextSentry(error);
        this.$sentry.captureMessage(
          `${error.message} at processGetService in FilterReport`
        );
        this.passErrorToParent(error);
      }
    },

    processGetLocation() {
      try {
        this.options.location = JSON.parse(localStorage.getItem("spots"));
      } catch (error) {
        this.$utility.setErrorContextSentry(error);
        this.$sentry.captureMessage(
          `${error.message} at processGetService in FilterReport`
        );
        this.passErrorToParent(error);
      }
    },

    processClearFilter() {
      this.vehicle = [];
      this.user = [];
      this.date_range = [];
      this.officer = [];
      this.column = [];
      this.product = [];
      this.leave_reason = [];
      this.leave_type = [];
      this.administration_type = {};
      this.timezone = "";
      this.transaction_type = {};
      this.gate_type = {};
      this.service = [];
      this.shift = {};
      this.pos = {};
      this.reason = [];
      this.helper.prefix_product = "NON_MEMBER";
    },

    processGenerateCaption() {
      let payload = [];
      if (this.has_period) payload.push("Periode");
      if (this.has_date) payload.push("Tanggal");
      if (this.has_date_range) payload.push("Rentang Tanggal");
      if (this.has_time_range) payload.push("Durasi");
      if (this.has_vehicle) payload.push("Jenis Kendaraan");
      if (this.has_product) payload.push("Produk");
      if (this.has_user) payload.push("Admin/Pengguna");
      if (this.has_officer) payload.push("Petugas");
      if (this.has_leave_type) payload.push("Tipe Izin, Alasan Izin");
      if (this.has_shift) payload.push("Shift");
      if (this.has_type) payload.push("Jenis Laporan");
      if (this.has_pos) payload.push("Pos");
      if (this.has_column_setting) payload.push("Visibilitas Kolom");
      if (this.has_service) payload.push("Layanan Tambahan");
      if (this.has_location) payload.push("Daftar Lokasi");
      if (this.has_administration_type) payload.push("Tipe Administrasi");
      if (this.has_timezone) payload.push("Zona Waktu");
      if (this.has_transaction_type) payload.push("Tipe Transaksi");
      if (this.helper.gate_type) payload.push("Tipe Palang/Gate");
      if (this.has_transaction_status) payload.push("Status Transaksi");
      if (this.has_reason) payload.push("Alasan");

      this.helper.tooltip.text = payload.join(", ");
    },
  },
};
</script>
<template>
  <modal-filter-view
    :id="id"
    :test_id="id"
    :ref="id"
    :align="align"
    :open_on_init="open_on_init"
    :is_disabled="is_disabled"
    :close_on_apply="!$v.$invalid"
    :preview_text="helper.tooltip.text"
    :btn_modal_type="btn_modal_type"
    @clear="processClearFilter"
    @apply="passUpdateToParent"
  >
    <template #content>
      <!-- period filter -->
      <div
        :id="`filter-report__${id}-period`"
        :data-testid="`filter-report__${id}-period`"
        :ref="`filter-report__${id}-period`"
        v-if="has_period"
        class="w-100 border-bottom py-3"
      >
        <div class="col-12 px-0 mx-0">
          <p class="font-weight-bold my-0 font-size-14">Periode Laporan</p>
          <p class="text-muted my-0 font-size-12">
            Atur laporan bulanan sesuai dengan kebutuhan anda
          </p>
        </div>
        <div class="col-12 pt-3 px-0">
          <date-input
            v-model="month"
            type="month"
            placeholder="Pilih Periode"
            disabled_date="after-this-month"
            value_type="YYYY-MM"
            format="MMM-YYYY"
            btn_variant="default"
            btn_type="outline"
            :id="`filter-opt-period__${id}`"
            :test_id="`filter-opt-period__${id}`"
            :ref="`filter-opt-period__${id}`"
          />
        </div>
      </div>
      <!-- end of period filter -->

      <!-- datefilter -->
      <div
        :id="`filter-report__${id}-date`"
        :data-testid="`filter-report__${id}-date`"
        :ref="`filter-report__${id}-date`"
        v-if="has_date"
        class="w-100 border-bottom py-3"
      >
        <div class="col-12 px-0 mx-0">
          <p class="font-weight-bold my-0 font-size-14">Tanggal Laporan</p>
          <p class="text-muted my-0 font-size-12">
            Atur tanggal laporan harian sesuai dengan kebutuhan anda
          </p>
        </div>
        <div class="col-12 pt-3 px-0">
          <date-input
            v-model="date"
            type="date"
            placeholder="Pilih Tanggal"
            value_type="YYYY-MM-DD"
            format="DD-MM-YYYY"
            btn_variant="default"
            btn_type="outline"
            :id="`filter-opt-date__${id}`"
            :test_id="`filter-opt-date__${id}`"
            :ref="`filter-opt-date__${id}`"
          />
        </div>
      </div>
      <!-- end of date filter -->

      <!-- date range filter -->
      <div
        :id="`filter-report__${id}-date-range`"
        :data-testid="`filter-report__${id}-date-range`"
        :ref="`filter-report__${id}-date-range`"
        v-if="has_date_range"
        class="w-100 border-bottom py-3"
      >
        <div class="col-12 px-0 mx-0">
          <p class="font-weight-bold my-0 font-size-14">Tanggal Laporan</p>
          <p class="text-muted my-0 font-size-12">
            Atur tanggal laporan harian sesuai dengan kebutuhan anda
          </p>
        </div>
        <div class="col-12 pt-3 px-0">
          <date-input
            v-model="date_range"
            placeholder="Pilih Rentang Tanggal"
            type="date"
            :is_range="true"
            value_type="YYYY-MM-DD"
            format="DD-MM-YYYY"
            btn_variant="default"
            btn_type="outline"
            disabled_date=""
            :id="`filter-opt-date-range__${id}`"
            :test_id="`filter-opt-date-range__${id}`"
            :ref="`filter-opt-date-range__${id}`"
          />
        </div>
      </div>
      <!-- end of date range filter -->

      <!-- time range filter -->
      <div
        :id="`filter-report__${id}-duration`"
        :data-testid="`filter-report__${id}-duration`"
        :ref="`filter-report__${id}-duration`"
        v-if="has_time_range"
        class="w-100 border-bottom py-3"
      >
        <div class="col-12 px-0 mx-0">
          <p class="font-weight-bold my-0 font-size-14">Durasi Laporan</p>
          <p class="text-muted my-0 font-size-12">
            Atur durasi laporan harian sesuai dengan kebutuhan anda
          </p>
        </div>
        <div class="col-12 pt-3 px-0">
          <date-input
            v-model="time_range"
            placeholder="Pilih Rentang Waktu"
            type="time"
            value_type="format"
            format="HH:mm"
            btn_variant="default"
            btn_type="outline"
            :is_range="true"
            :id="`filter-opt-time-range__${id}`"
            :test_id="`filter-opt-time-range__${id}`"
            :ref="`filter-opt-time-range__${id}`"
          />
        </div>
      </div>
      <!-- end of time range filter -->

      <!-- location filter -->
      <div
        :id="`filter-report__${id}-location`"
        :data-testid="`filter-report__${id}-location`"
        :ref="`filter-report__${id}-location`"
        v-if="has_location"
        class="w-100 border-bottom py-3"
      >
        <div class="col-12 px-0 mx-0">
          <p class="font-weight-bold my-0 font-size-14">Lokasi Parkir</p>
          <p class="text-muted my-0 font-size-12">
            Atur laporan per lokasi parkir sesuai dengan kebutuhan anda
            <span v-if="!is_single_location">, maksimal 10 lokasi</span>
          </p>
        </div>
        <div class="col-12 pt-3 px-0">
          <input-select-group
            label="Atur Lokasi"
            :id="`filter-opt__${id}-location`"
            :test_id="`filter-opt__${id}-location`"
            :ref="`filter-opt__${id}-location`"
            :placeholder="`${
              location && location.length > 0 ? ' ' : 'Pilih Lokasi'
            }`"
            v-model="location"
            btn_variant="default"
            btn_type="outline"
            :options="options.location"
            :is_multiple="!is_single_location"
            is_nullable
            is_searchable
            is_submitted
            :is_error="$v.location.$error"
            :error_message="[
              {
                state: $v.location.maxLength,
                message: 'Lokasi yang dipilih tidak boleh lebih dari 10',
              },
            ]"
            :has_button_clear="
              !is_single_location &&
              !is_required_location &&
              location.length > 0
            "
            selected_caption="Lokasi dipilih"
            additional_class_label="d-none"
          />
        </div>
      </div>
      <!-- end of location filter -->

      <!-- column filter -->
      <div
        :id="`filter-report__${id}-column`"
        :data-testid="`filter-report__${id}-column`"
        :ref="`filter-report__${id}-column`"
        v-if="has_column_setting"
        class="w-100 border-bottom py-3"
      >
        <div class="col-12 px-0 mx-0">
          <p class="font-weight-bold my-0 font-size-14">Kolom Laporan</p>
          <p class="text-muted my-0 font-size-12">
            Atur visibilitas kolom pada laporan yang akan ditampilkan sesuai
            dengan kebutuhan anda
          </p>
        </div>
        <div class="col-12 pt-3 px-0">
          <div
            :id="`filter-opt-column__${id}`"
            :data-testid="`filter-opt-column__${id}`"
            :ref="`filter-opt-column__${id}`"
            class="d-flex flex-wrap"
            v-if="option_column.length > 0"
          >
            <template v-if="option_column.length > 5">
              <select-input
                label="Kolom Laporan"
                :placeholder="`${
                  column && column.length > 0 ? ' ' : 'Pilih Kolom Laporan'
                }`"
                v-model="column"
                :ref="`filter-select-column__${id}`"
                :id="`filter-select-column__${id}`"
                :test_id="`filter-select-column__${id}`"
                btn_variant="default"
                btn_type="outline"
                :options="option_column"
                is_multiple
                is_nullable
                is_searchable
                selected_caption="Kolom dipilih"
              />
            </template>
            <template v-else>
              <checkbox-input
                v-for="(option, idx) in option_column"
                :ref="`filter-opt-column__${id}-${idx}`"
                :id="`filter-opt-column__${id}-${idx}`"
                :test_id="`filter-opt-column__${id}-${idx}`"
                :key="`filter-opt-column__${id}-${idx}`"
                v-model="column"
                :options="[{ text: option.text, value: option }]"
              />
            </template>
            <div class="w-100 d-block text-right">
              <p
                :id="`btn-select-all-column__${id}`"
                :data-testid="`btn-select-all-column__${id}`"
                :ref="`btn-select-all-column__${id}`"
                @click="toggleSelectOptionColumn()"
                v-if="column.length < option_column.length"
                class="text-right my-2 text-primary text-underline font-size-12 cursor-pointer"
              >
                Pilih Semua
              </p>
              <p
                :id="`btn-clear-all-column__${id}`"
                :date-testid="`btn-clear-all-column__${id}`"
                :ref="`btn-clear-all-column__${id}`"
                @click="toggleClearOptionColumn()"
                v-else
                class="text-right my-2 text-primary text-underline font-size-12 cursor-pointer"
              >
                Hapus Semua
              </p>
            </div>
          </div>
          <p
            :id="`blank-filter-column__${id}`"
            :data-testid="`blank-filter-column__${id}`"
            :ref="`blank-filter-column__${id}`"
            class="my-0 text-muted"
            v-else
          >
            Opsi belum dimasukkan <i class="bx bx-error-circle"></i>
          </p>
        </div>
      </div>
      <!-- end of column filter -->

      <!-- timezone filter -->
      <div
        :id="`filter-report__${id}-timezone`"
        :data-testid="`filter-report__${id}-timezone`"
        :ref="`filter-report__${id}-timezone`"
        v-if="has_timezone"
        class="w-100 border-bottom py-3"
      >
        <div class="px-2 pb-3">
          <div class="row px-1">
            <div class="col-12 pb-3 px-0 mx-0">
              <p class="font-weight-bold my-0 font-size-14">Zona Waktu</p>
              <p class="text-muted my-0 font-size-12">
                Atur laporan berdasarkan zona waktu sesuai dengan kebutuhan anda
              </p>
            </div>
            <b-col class="border py-2 border-right-0 rounded-left">
              <div class="custom-control custom-radio custom-control-inline">
                <input
                  type="radio"
                  id="opt_wib"
                  data-testid="opt_wib"
                  v-model="timezone"
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
                  v-model="timezone"
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
                  v-model="timezone"
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
      </div>
      <!-- end of timezone filter-->

      <!-- administration type filter -->
      <div
        :id="`filter-report__${id}-administration-type`"
        :data-testid="`filter-report__${id}-administration-type`"
        :ref="`filter-report__${id}-administration-type`"
        v-if="has_administration_type"
        class="w-100 border-bottom py-3"
      >
        <div class="col-12 px-0 mx-0">
          <p class="font-weight-bold my-0 font-size-14">Tipe Administrasi</p>
          <p class="text-muted my-0 font-size-12">
            Atur laporan berdasarkan tipe administrasi sesuai dengan kebutuhan
            anda
          </p>
        </div>
        <div class="col-12 pt-3 px-0">
          <div
            class="d-flex flex-wrap"
            :id="`filter-opt-administration_type__${id}`"
            :data-testid="`filter-opt-administration_type__${id}`"
            :ref="`filter-opt-administration_type__${id}`"
          >
            <radio-input
              v-for="(option, idx) in options.administration_type"
              :ref="`filter-opt-administration_type__${id}-${idx}`"
              :id="`filter-opt-administration_type__${id}-${idx}`"
              :test_id="`filter-opt-administration_type__${id}-${idx}`"
              :key="`filter-opt-administration_type__${id}-${idx}`"
              v-model="administration_type"
              :options="[{ text: option.text, value: option }]"
            />
          </div>
        </div>
      </div>
      <!-- end of administration type filter-->

      <!-- service filter -->
      <div
        :id="`filter-report__${id}-service`"
        :data-testid="`filter-report__${id}-service`"
        :ref="`filter-report__${id}-service`"
        v-if="has_service"
        class="w-100 border-bottom py-3"
      >
        <div class="col-12 px-0 mx-0">
          <p class="font-weight-bold my-0 font-size-14">Jenis Layanan</p>
          <p class="text-muted my-0 font-size-12">
            Atur laporan berdasarkan jenis layanan sesuai dengan kebutuhan anda
          </p>
        </div>
        <div class="col-12 pt-3 px-0">
          <div
            :id="`filter-opt-service__${id}`"
            :data-testid="`filter-opt-service__${id}`"
            :ref="`filter-opt-service__${id}`"
            class="d-flex flex-wrap"
            v-if="options.service.length > 0"
          >
            <checkbox-input
              v-for="(option, idx) in options.service"
              :ref="`filter-opt-service__${id}-${idx}`"
              :id="`filter-opt-service__${id}-${idx}`"
              :test_id="`filter-opt-service__${id}-${idx}`"
              :key="`filter-opt-service__${id}-${idx}`"
              v-model="service"
              :options="[{ text: option.text, value: option }]"
            />
          </div>
          <p
            :id="`blank-filter-service__${id}`"
            :data-testid="`blank-filter-service__${id}`"
            :ref="`blank-filter-service__${id}`"
            class="my-0 text-muted"
            v-else
          >
            Jenis layanan belum tersedia, mohon hubungi tim IT
            <i class="bx bx-error-circle"></i>
          </p>
        </div>
      </div>
      <!-- end of service filter  -->

      <!-- vehicle filter -->
      <div
        :id="`filter-report__${id}-vehicle`"
        :data-testid="`filter-report__${id}-vehicle`"
        :ref="`filter-report__${id}-vehicle`"
        v-if="has_vehicle"
        class="w-100 border-bottom py-3"
      >
        <div class="col-12 px-0 mx-0">
          <p class="font-weight-bold my-0 font-size-14">Jenis Kendaraan</p>
          <p class="text-muted my-0 font-size-12">
            Atur laporan berdasarkan jenis kendaraan sesuai dengan kebutuhan
            anda
          </p>
        </div>
        <div class="col-12 pt-3 px-0">
          <div
            :id="`filter-opt-vehicle__${id}`"
            :data-testid="`filter-opt-vehicle__${id}`"
            :ref="`filter-opt-vehicle__${id}`"
            class="d-flex flex-wrap"
            v-if="options.vehicle.length > 0"
          >
            <template v-if="options.vehicle.length > 5">
              <select-input
                label="Atur Jenis Kendaraan"
                :placeholder="`${
                  vehicle && vehicle.length > 0 ? ' ' : 'Pilih Jenis Kendaraan'
                }`"
                v-model="vehicle"
                :ref="`filter-select-vehicle__${id}`"
                :id="`filter-select-vehicle__${id}`"
                :test_id="`filter-select-vehicle__${id}`"
                btn_variant="default"
                btn_type="outline"
                :options="options.vehicle"
                is_multiple
                is_nullable
                is_searchable
                selected_caption="Jenis dipilih"
              />
            </template>
            <template v-else>
              <checkbox-input
                v-for="(option, idx) in options.vehicle"
                :ref="`filter-opt-vehicle__${id}-${idx}`"
                :id="`filter-opt-vehicle__${id}-${idx}`"
                :test_id="`filter-opt-vehicle__${id}-${idx}`"
                :key="`filter-opt-vehicle__${id}-${idx}`"
                v-model="vehicle"
                :options="[{ text: option.text, value: option }]"
              />
            </template>
            <div class="w-100 d-block text-right">
              <p
                :id="`btn-select-all-vehicle__${id}`"
                :data-testid="`btn-select-all-vehicle__${id}`"
                :ref="`btn-select-all-vehicle__${id}`"
                @click="toggleSelectOptionVehicle()"
                v-if="vehicle.length < options.vehicle.length"
                class="text-right my-2 text-primary text-underline font-size-12 cursor-pointer"
              >
                Pilih Semua
              </p>
              <p
                :id="`btn-clear-all-vehicle__${id}`"
                :data-testid="`btn-clear-all-vehicle__${id}`"
                :ref="`btn-clear-all-vehicle__${id}`"
                @click="toggleClearOptionVehicle()"
                v-else
                class="text-right my-2 text-primary text-underline font-size-12 cursor-pointer"
              >
                Hapus Semua
              </p>
            </div>
          </div>
          <p class="my-0 text-muted" v-else>
            Jenis kendaraan belum tersedia, harap masukkan jenis kendaraan
            terlebih dahulu pada laman
            <span
              :id="`blank-filter-vehicle__${id}`"
              :ref="`blank-filter-vehicle__${id}`"
              class="cursor-pointer text-primary"
              @click="$router.push('/spots/edit/?pane=vehicle')"
            >
              atur jenis kendaraan</span
            >
            <i class="bx bx-error-circle"></i>
          </p>
        </div>
      </div>
      <!-- end of vehicle filter -->

      <!-- product filter -->
      <div
        :id="`filter-report__${id}-product`"
        :date-testid="`filter-report__${id}-product`"
        :ref="`filter-report__${id}-product`"
        v-if="has_product"
        class="w-100 border-bottom py-3"
      >
        <div class="col-12 px-0 mx-0">
          <p class="font-weight-bold my-0 font-size-14">Produk Membership</p>
          <p class="text-muted my-0 font-size-12">
            Atur laporan berdasarkan produk membership sesuai dengan kebutuhan
            anda<span v-if="!is_single_product">, maksimal 10 produk</span>
          </p>
        </div>
        <div class="col-12 pt-3 px-0" v-if="has_non_member">
          <radio-input
            :ref="`prefix-opt-product__${id}`"
            :id="`prefix-opt-product__${id}`"
            :test_id="`prefix-opt-product__${id}`"
            :key="`prefix-opt-product__${id}`"
            v-model="helper.prefix_product"
            :options="options.prefix_product"
          />
        </div>
        <div
          class="col-12 pt-3 px-0"
          :ref="`wrapper-filter-product__${id}`"
          :id="`wrapper-filter-product__${id}`"
          :data-testid="`wrapper-filter-product__${id}`"
          v-if="
            !has_non_member ||
            (has_non_member && helper.prefix_product === 'MEMBER')
          "
        >
          <div
            :id="`filter-opt-product__${id}`"
            :data-testid="`filter-opt-product__${id}`"
            :ref="`filter-opt-product__${id}`"
            v-if="options.product.length > 0"
          >
            <template v-if="is_single_product || options.product.length > 5">
              <input-select-group
                label="Atur Produk"
                :placeholder="`${
                  product && product.length > 0 ? ' ' : 'Pilih Produk'
                }`"
                v-model="product"
                :ref="`filter-select-product__${id}`"
                :id="`filter-select-product__${id}`"
                :test_id="`filter-select-product__${id}`"
                btn_variant="default"
                btn_type="outline"
                :options="options.product"
                :is_multiple="!is_single_product"
                is_nullable
                is_searchable
                is_submitted
                :is_error="$v.product.$error"
                :error_message="[
                  {
                    state: $v.product.maxLength,
                    message: 'Produk yang dipilih tidak boleh lebih dari 10',
                  },
                  {
                    state: $v.product.required,
                    message: 'Produk tidak boleh kosong',
                  },
                ]"
                :has_button_clear="!is_single_product && product.length > 0"
                additional_class_label="d-none"
                selected_caption="Produk dipilih"
              />
            </template>
            <template v-else>
              <input-checkbox-group
                :ref="`filter-opt-product__${id}`"
                :id="`filter-opt-product__${id}`"
                :test_id="`filter-opt-product__${id}`"
                :key="`filter-opt-product__${id}`"
                is_submitted
                v-model="product"
                :options="options.product"
                :has_button_clear="!is_single_product && product.length > 0"
                :is_error="$v.product.$error"
                :error_message="[
                  {
                    state: $v.product.required,
                    message: 'Produk tidak boleh kosong',
                  },
                ]"
                has_button_select_all
                additional_class_label="d-none"
              />
            </template>
          </div>
          <p class="my-0 text-muted" v-else>
            Produk belum tersedia, masukkan produk terlebih dahulu pada laman
            <span
              :id="`blank-filter-product__${id}`"
              :data-testid="`blank-filter-product__${id}`"
              :ref="`blank-filter-product__${id}`"
              class="cursor-pointer text-primary"
              @click="$router.push('/spots/product')"
              >pengaturan produk</span
            >
            <i class="bx bx-error-circle"></i>
          </p>
        </div>
      </div>
      <!-- end of product filter -->

      <!-- problem media filter -->
      <div
        :id="`filter-report__${id}-problem-media`"
        :data-testid="`filter-report__${id}-problem-media`"
        :ref="`filter-report__${id}-problem-media`"
        v-if="has_problem_media"
        class="w-100 border-bottom py-3"
      >
        <div class="col-12 px-0 mx-0">
          <p class="font-weight-bold my-0 font-size-14">Media</p>
          <p class="text-muted my-0 font-size-12">
            Atur laporan berdasarkan media laporan masalah sesuai dengan
            kebutuhan anda
          </p>
        </div>
        <div class="col-12 pt-3 px-0">
          <div
            :id="`filter-opt-problem-media__${id}`"
            :data-testid="`filter-opt-problem-media__${id}`"
            :ref="`filter-opt-problem-media__${id}`"
            class="d-flex flex-wrap"
            v-if="options.problem_media.length > 0"
          >
            <checkbox-input
              v-for="(option, idx) in options.problem_media"
              :ref="`filter-opt-problem-media__${id}-${idx}`"
              :id="`filter-opt-problem-media__${id}-${idx}`"
              :test_id="`filter-opt-problem-media__${id}-${idx}`"
              :key="`filter-opt-problem-media__${id}-${idx}`"
              v-model="problem_media"
              :options="[{ text: option.text, value: option }]"
            />
          </div>
        </div>
      </div>
      <!-- end of problem media filter -->

      <!-- reason filter -->
      <div
        :id="`filter-report__${id}-reason`"
        :data-testid="`filter-report__${id}-reason`"
        :ref="`filter-report__${id}-reason`"
        v-if="has_reason"
        class="w-100 border-bottom py-3"
      >
        <div class="col-12 px-0 mx-0">
          <p class="font-weight-bold my-0 font-size-14">
            Alasan Tiket Bermasalah
          </p>
          <p class="text-muted my-0 font-size-12">
            Atur laporan berdasarkan alasan tiket yang bermasalah sesuai dengan
            kebutuhan anda
          </p>
        </div>
        <div class="col-12 pt-3 px-0">
          <div
            :id="`filter-opt-reason__${id}`"
            :data-testid="`filter-opt-reason__${id}`"
            :ref="`filter-opt-reason__${id}`"
            class="d-flex flex-wrap"
            v-if="options.reason.length > 0"
          >
            <checkbox-input
              v-for="(option, idx) in options.reason"
              :ref="`filter-opt-reason__${id}-${idx}`"
              :id="`filter-opt-reason__${id}-${idx}`"
              :test_id="`filter-opt-reason__${id}-${idx}`"
              :key="`filter-opt-reason__${id}-${idx}`"
              v-model="reason"
              :options="[{ text: option.text, value: option }]"
            />
          </div>
          <p
            :id="`blank-filter-reason__${id}`"
            :data-testid="`blank-filter-reason__${id}`"
            :ref="`blank-filter-reason__${id}`"
            class="my-0 text-muted"
            v-else
          >
            Alasan tiket bermasalah belum tersedia, mohon hubungi tim IT
            <i class="bx bx-error-circle"></i>
          </p>
        </div>
      </div>
      <!-- end of filter reason -->

      <!-- transaction status filter -->
      <div
        :id="`filter-report__${id}-transaction-status`"
        :data-testid="`filter-report__${id}-transaction-status`"
        :ref="`filter-report__${id}-transaction-status`"
        v-if="has_transaction_status"
        class="w-100 border-bottom py-3"
      >
        <div class="col-12 px-0 mx-0">
          <p class="font-weight-bold my-0 font-size-14">Status Transaksi</p>
          <p class="text-muted my-0 font-size-12">
            Atur laporan berdasarkan status transaksi sesuai dengan kebutuhan
            anda
          </p>
        </div>
        <div class="col-12 pt-3 px-0">
          <div
            :id="`filter-opt-transaction_status__${id}`"
            :data-testid="`filter-opt-transaction_status__${id}`"
            :ref="`filter-opt-transaction_status__${id}`"
            class="d-flex flex-wrap"
            v-if="options.transaction_status.length > 0"
          >
            <radio-input
              v-for="(option, idx) in options.transaction_status"
              :ref="`filter-opt-transaction_status__${id}-${idx}`"
              :id="`filter-opt-transaction_status__${id}-${idx}`"
              :test_id="`filter-opt-transaction_status__${id}-${idx}`"
              :key="`filter-opt-transaction_status__${id}-${idx}`"
              v-model="transaction_status"
              :options="[{ text: option.text, value: option }]"
            />
          </div>
          <p
            :id="`blank-filter-transaction_status__${id}`"
            :data-testid="`blank-filter-transaction_status__${id}`"
            :ref="`blank-filter-transaction_status__${id}`"
            class="my-0 text-muted"
            v-else
          >
            Status transaksi belum tersedia, mohon hubungi tim IT
            <i class="bx bx-error-circle"></i>
          </p>
        </div>
      </div>
      <!-- end of transaction status filter -->

      <!-- transaction type filter -->
      <div
        :id="`filter-report__${id}-transaction-type`"
        :data-testid="`filter-report__${id}-transaction-type`"
        :ref="`filter-report__${id}-transaction-type`"
        v-if="has_transaction_type"
        class="w-100 border-bottom py-3"
      >
        <div class="col-12 px-0 mx-0">
          <p class="font-weight-bold my-0 font-size-14">Tipe Transaksi</p>
          <p class="text-muted my-0 font-size-12">
            Atur laporan berdasarkan tipe transaksi sesuai dengan kebutuhan anda
          </p>
        </div>
        <div class="col-12 pt-3 px-0">
          <div
            :id="`filter-opt-transaction_type__${id}`"
            :ref="`filter-opt-transaction_type__${id}`"
            class="d-flex flex-wrap"
            v-if="options.transaction_type.length > 0"
          >
            <radio-input
              v-for="(option, idx) in options.transaction_type"
              :ref="`filter-opt-transaction_type__${id}-${idx}`"
              :id="`filter-opt-transaction_type__${id}-${idx}`"
              :test_id="`filter-opt-transaction_type__${id}-${idx}`"
              :key="`filter-opt-transaction_type__${id}-${idx}`"
              v-model="transaction_type"
              :options="[{ text: option.text, value: option }]"
            />
          </div>
          <p
            :id="`blank-filter-transaction_type__${id}`"
            :data-testid="`blank-filter-transaction_type__${id}`"
            :ref="`blank-filter-transaction_type__${id}`"
            class="my-0 text-muted"
            v-else
          >
            Tipe transaksi belum tersedia, mohon hubungi tim IT
            <i class="bx bx-error-circle"></i>
          </p>
        </div>
      </div>
      <!-- end of transaction type filter -->

      <!-- gate type filter -->
      <div
        :id="`filter-report__${id}-gate_type`"
        :data-testid="`filter-report__${id}-gate_type`"
        :ref="`filter-report__${id}-gate_type`"
        v-if="helper.gate_type"
        class="w-100 border-bottom py-3"
      >
        <div class="col-12 px-0 mx-0">
          <p class="font-weight-bold my-0 font-size-14">Tipe Palang/Gate</p>
          <p class="text-muted my-0 font-size-12">
            Atur laporan berdasarkan palang parkir sesuai dengan kebutuhan anda
          </p>
        </div>
        <div class="col-12 pt-3 px-0">
          <div
            :id="`filter-opt-gate_type__${id}`"
            :ref="`filter-opt-gate_type__${id}`"
            class="d-flex flex-wrap"
            v-if="options.gate_type.length > 0"
          >
            <radio-input
              v-for="(option, idx) in options.gate_type"
              :ref="`filter-opt-filter_opt_gate_type__${id}-${idx}`"
              :id="`filter-opt-filter_opt_gate_type__${id}-${idx}`"
              :test_id="`filter-opt-filter_opt_gate_type__${id}-${idx}`"
              :key="`filter-opt-filter_opt_gate_type__${id}-${idx}`"
              v-model="gate_type"
              :options="[{ text: option.text, value: option }]"
            />
          </div>
          <p
            :id="`blank-filter-gate_type__${id}`"
            :ref="`blank-filter-gate_type__${id}`"
            class="my-0 text-muted"
            v-else
          >
            Tipe gate/pintu belum tersedia, mohon hubungi tim IT
            <i class="bx bx-error-circle"></i>
          </p>
        </div>
      </div>
      <!-- end of gate type filter -->

      <!-- user type filter -->
      <div
        :id="`filter-report__${id}-user`"
        :data-testid="`filter-report__${id}-user`"
        :ref="`filter-report__${id}-user`"
        v-if="has_user"
        class="w-100 border-bottom py-3"
      >
        <div class="col-12 px-0 mx-0">
          <p class="font-weight-bold my-0 font-size-14">Admin/Pengguna</p>
          <p class="text-muted my-0 font-size-12">
            Atur laporan berdasarkan pengguna atau admin yang melakukan input
            data sesuai dengan kebutuhan anda, maksimal 10 pengguna. Cari
            menggunakan nama depan, minimal 3 karakter
          </p>
        </div>
        <div class="d-flex mt-3">
          <input-select-group
            v-model="user"
            label="Atur Admin/Pengguna"
            btn_variant="default"
            btn_type="outline"
            :options="options.user"
            is_preserve_search
            search_by="name"
            is_searchable
            is_multiple
            is_nullable
            is_submitted
            :has_button_clear="user.length > 0"
            additional_class_label="d-none"
            selected_caption="Admin/Pengguna dipilih"
            :placeholder="
              helper.search.user ? helper.search.user : 'Pilih Admin/Pengguna'
            "
            :id="`filter-opt__${id}-user`"
            class="mr-2"
            style="width: 90%"
            :test_id="`filter-opt__${id}-user`"
            :ref="`filter-opt__${id}-user`"
            :is_error="$v.user.$error"
            :error_message="[
              {
                state: $v.user.maxLength,
                message:
                  'Admin/Pengguna yang dipilih tidak boleh lebih dari 10',
              },
            ]"
            @search="setSearchUser"
          />
          <div>
            <active-button
              text="Cari"
              icon="ic-search-sm"
              align="rtl"
              :is_disabled="helper.search.user.length < 3"
              @click="processGetUser"
            />
          </div>
        </div>
        <div class="w-100 d-flex text-right">
          <p
            class="text-muted font-size-12 mt-2"
            v-if="helper.loading.user"
            data-testid="wrapper-caption_loading-user"
            id="wrapper-caption_loading-user"
          >
            Kami sedang menyiapkan opsi untuk anda
            <span class="spinner-border spinner-border-sm"></span>
          </p>
        </div>
      </div>
      <!-- end of user type filter -->

      <!-- officer filter -->
      <div
        :id="`filter-report__${id}-officer`"
        :data-testid="`filter-report__${id}-officer`"
        :ref="`filter-report__${id}-officer`"
        v-if="has_officer"
        class="w-100 border-bottom py-3"
      >
        <div class="col-12 px-0 mx-0">
          <p class="font-weight-bold my-0 font-size-14">Petugas Parkir/Kasir</p>
          <p class="text-muted my-0 font-size-12">
            Atur laporan berdasarkan petugas parkir atau petugas kasir yang
            bertugas sesuai dengan kebutuhan anda<span v-if="!is_single_officer"
              >, maksimal 10 petugas</span
            >. Cari menggunakan nama depan, minimal 3 karakter
          </p>
        </div>
        <div class="d-flex mt-3">
          <input-select-group
            v-model="officer"
            :options="options.officer"
            btn_variant="default"
            btn_type="outline"
            :placeholder="
              helper.search.officer
                ? helper.search.officer
                : 'Pilih Petugas Parkir/Kasir'
            "
            search_by="name"
            label="Atur Petugas Parkir/Kasir"
            selected_caption="Petugas dipilih"
            additional_class_label="d-none"
            :id="`filter-opt__${id}-officer`"
            :test_id="`filter-opt__${id}-officer`"
            :ref="`filter-opt__${id}-officer`"
            :has_button_clear="!is_single_officer && officer.length > 0"
            :is_multiple="!is_single_officer"
            is_nullable
            is_searchable
            is_preserve_search
            is_submitted
            :is_error="$v.officer.$error"
            class="mr-2"
            style="width: 90%"
            :error_message="[
              {
                state: $v.officer.maxLength,
                message: 'Petugas yang dipilih tidak boleh lebih dari 10',
              },
            ]"
            @search="setSearchOfficer"
          />
          <div>
            <active-button
              text="Cari"
              icon="ic-search-sm"
              align="rtl"
              :is_disabled="helper.search.officer.length < 3"
              @click="processGetOfficer"
            />
          </div>
        </div>
        <div class="w-100 d-flex text-right">
          <p
            class="text-muted font-size-12 mt-2"
            v-if="helper.loading.officer"
            data-testid="wrapper-caption_loading-officer"
            id="wrapper-caption_loading-officer"
          >
            Kami sedang menyiapkan opsi untuk anda
            <span class="spinner-border spinner-border-sm"></span>
          </p>
        </div>
      </div>
      <!-- end of officer filter -->

      <!-- leave filter -->
      <div
        :id="`filter-report__${id}-leave`"
        :data-testid="`filter-report__${id}-leave`"
        :ref="`filter-report__${id}-leave`"
        v-if="has_leave_type"
        class="w-100 border-bottom"
      >
        <div class="col-12 pt-3 px-0 mx-0">
          <input-checkbox-group
            :ref="`filter-opt-leave-type__${id}`"
            :id="`filter-opt-leave-type__${id}`"
            :test_id="`filter-opt-leave-type__${id}`"
            :key="`filter-opt-leave-type__${id}`"
            is_submitted
            v-model="leave_type"
            :options="options.leave_type"
            :has_button_clear="leave_type.length > 0"
            :has_button_select_all="
              leave_type.length < options.leave_type.length
            "
            :is_error="$v.leave_type.$error"
            :error_message="[
              {
                state: $v.leave_type.minLength,
                message: 'Tipe izin tidak boleh kosong',
              },
            ]"
            additional_class_label="font-size-14"
            label="Tipe Izin"
          />
        </div>
        <div
          class="col-12 pt-3 border-top px-0 mx-0"
          v-if="options.leave_reason.length > 0"
        >
          <input-checkbox-group
            :ref="`filter-opt-leave-reason__${id}`"
            :id="`filter-opt-leave-reason__${id}`"
            :test_id="`filter-opt-leave-reason__${id}`"
            :key="`filter-orpt-leave-reason__${id}`"
            is_submitted
            v-model="leave_reason"
            :options="options.leave_reason"
            :has_button_clear="leave_reason.length > 0"
            :has_button_select_all="
              leave_reason.length < options.leave_reason.length
            "
            additional_class_label="font-size-14"
            label="Alasan Izin"
          />
        </div>
      </div>
      <!-- end of leave filter  -->

      <!-- shift filter -->
      <div
        v-if="has_shift"
        :id="`filter-report__${id}-shift`"
        :data-testid="`filter-report__${id}-shift`"
        :ref="`filter-report__${id}-shift`"
        class="w-100 border-bottom py-3"
      >
        <div class="col-12 px-0 mx-0">
          <p class="font-weight-bold my-0 font-size-14">Jadwal Shift</p>
          <p class="text-muted my-0 font-size-12">
            Atur laporan berdasarkan jadwal shift pekerja sesuai dengan
            kebutuhan anda
          </p>
        </div>
        <div class="col-12 pt-3 px-0">
          <div
            :id="`filter-opt-shift__${id}`"
            :data-testid="`filter-opt-shift__${id}`"
            :ref="`filter-opt-shift__${id}`"
            class="d-flex flex-wrap"
            v-if="options.shift.length > 0"
          >
            <radio-input
              v-for="(option, idx) in options.shift"
              :ref="`filter-opt-shift__${id}-${idx}`"
              :id="`filter-opt-shift__${id}-${idx}`"
              :test_id="`filter-opt-shift__${id}-${idx}`"
              :key="`filter-opt-shift__${id}-${idx}`"
              v-model="shift"
              :options="[{ text: option.text, value: option }]"
            />
          </div>
          <p
            :id="`blank-filter-shift__${id}`"
            :ref="`blank-filter-shift__${id}`"
            class="my-0 text-muted"
            v-else
          >
            Shift petugas belum tersedia, mohon hubungi tim IT
            <i class="bx bx-error-circle"></i>
          </p>
        </div>
      </div>
      <!-- end of shift filter -->

      <!-- report type filter -->
      <div
        :id="`filter-report__${id}-report-type`"
        :data-testid="`filter-report__${id}-report-type`"
        :ref="`filter-report__${id}-report-type`"
        v-if="has_type"
        class="w-100 border-bottom py-3"
      >
        <div class="col-12 px-0 mx-0">
          <p class="font-weight-bold my-0 font-size-14">Tipe Laporan</p>
          <p class="text-muted my-0 font-size-12">
            Atur tipe laporan yang akan ditampilkan sesuai dengan kebutuhan anda
          </p>
        </div>
        <div class="col-12 pt-3 px-0">
          <div
            :id="`filter-opt-type__${id}`"
            :data-testid="`filter-opt-type__${id}`"
            :ref="`filter-opt-type__${id}`"
            class="d-flex flex-wrap"
            v-if="options.type.length > 0"
          >
            <radio-input
              v-for="(option, idx) in options.type"
              :ref="`filter-opt-type__${id}-${idx}`"
              :id="`filter-opt-type__${id}-${idx}`"
              :test_id="`filter-opt-type__${id}-${idx}`"
              :key="`filter-opt-type__${id}-${idx}`"
              v-model="type"
              :options="[{ text: option.text, value: option }]"
            />
          </div>
          <p
            :id="`blank-filter-type__${id}`"
            :data-testid="`blank-filter-type__${id}`"
            :ref="`blank-filter-type__${id}`"
            class="my-0 text-muted"
            v-else
          >
            Tipe Laporan belum tersedia, mohon hubungi tim IT
            <i class="bx bx-error-circle"></i>
          </p>
        </div>
      </div>
      <!-- end of report type filter -->

      <!-- pos transaction filter -->
      <div
        :id="`filter-report__${id}-station`"
        :data-testid="`filter-report__${id}-station`"
        :ref="`filter-report__${id}-station`"
        v-if="has_pos"
        class="w-100 border-bottom py-3"
      >
        <div class="col-12 px-0 mx-0">
          <p class="font-weight-bold my-0 font-size-14">Pos Transaksi</p>
          <p class="text-muted my-0 font-size-12">
            Atur laporan berdasarkan pos transaksi berlangsung
          </p>
        </div>
        <div class="col-12 pt-3 px-0">
          <div
            :id="`filter-opt-station__${id}`"
            :data-testid="`filter-opt-station__${id}`"
            :ref="`filter-opt-station__${id}`"
            class="d-flex flex-wrap"
            v-if="options.pos.length > 0"
          >
            <radio-input
              v-for="(option, idx) in options.pos"
              :ref="`filter-opt-pos__${id}-${idx}`"
              :id="`filter-opt-pos__${id}-${idx}`"
              :test_id="`filter-opt-pos__${id}-${idx}`"
              :key="`filter-opt-pos__${id}-${idx}`"
              v-model="pos"
              :options="[{ text: option.text, value: option }]"
            />
          </div>
          <p
            :id="`blank-filter-station__${id}`"
            :data-testid="`blank-filter-station__${id}`"
            :ref="`blank-filter-station__${id}`"
            class="my-0 text-muted"
            v-else
          >
            Pos transaksi belum tersedia, mohon hubungi tim IT
            <i class="bx bx-error-circle"></i>
          </p>
        </div>
      </div>
      <!-- end of pos transaction filter -->
    </template>
  </modal-filter-view>
</template>
<style lang="scss" scoped>
.text-underline {
  text-decoration: underline !important;
}
</style>
