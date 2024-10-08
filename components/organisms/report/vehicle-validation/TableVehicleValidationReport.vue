<template>
  <div>
    <content-table-view :test_id="`wrapper__${id}`" :is_loading="helper.is_loading" :is_error="helper.is_error"
      :length="report.length" empty-caption="Laporan Belum Tersedia">
      <div class="col-12 mt-3 mx-0 px-1 py-2" v-html="filter_title" />
      <div class="col-12 p-0 rounded">
        <table class="d-block table table-striped table-sticky-header report-table" :data-testid="id" :id="id">
          <thead class="thead-primary">
            <tr>
              <th class="cell-sticky text-left" style="top: 1px; width:3%;" :data-testid="`${id}__th-number`">No.</th>
              <th class="cell-sticky text-left" style="top: 1px; width:5%;" :data-testid="`${id}__th-id`">Transaksi</th>
              <th class="cell-sticky text-left" style="top: 1px; width:5%;" :data-testid="`${id}__th-license-plate`">
                Plat Nomor</th>
              <th class="cell-sticky text-left" style="top: 1px; width:5%;" :data-testid="`${id}__th-rfid`"
                v-if="transaction_type.value !== 'NON_MEMBER'">RF ID</th>
              <th class="cell-sticky text-left" style="top: 1px; width:5%;" :data-testid="`${id}__th-vhc-member`"
                v-if="transaction_type.value !== 'NON_MEMBER'">Kendaraan Member</th>
              <th class="cell-sticky text-left" style="top: 1px; width:5%;" :data-testid="`${id}__th-vhc-in`"
                v-if="transaction_type.value !== 'MEMBER' || gate_type.value !== 'OUT'">Kendaraan Masuk</th>
              <th class="cell-sticky text-left" style="top: 1px; width:5%;" :data-testid="`${id}__th-vhc-out`"
                v-if="transaction_type.value !== 'MEMBER' || gate_type.value !== 'IN'">Kendaraan Keluar</th>
              <th class="cell-sticky text-center" style="top: 1px; width:5%;"
                 :data-testid="`${id}__th-ststus`">Status</th>
              <th class="cell-sticky text-left" style="top: 1px; width:20%;" :data-testid="`${id}__th-time-in`"
                v-if="transaction_type.value !== 'MEMBER' || gate_type.value !== 'OUT'">Waktu Masuk Transaksi</th>
              <th class="cell-sticky text-left" style="top: 1px; width:20%;" :data-testid="`${id}__th-time-out`"
                v-if="transaction_type.value !== 'MEMBER' || gate_type.value !== 'IN'">Waktu Keluar Transaksi</th>
              <th class="cell-sticky text-left" style="top: 1px; width:20%;" :data-testid="`${id}__th-paid-at`">Waktu
                Bayar</th>
              <th class="cell-sticky text-right" style="top: 1px; width:20%;" :data-testid="`${id}__th-amount`">Tarif
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in report" :key="`row-${index}`" class="cursor-pointer"
              :class="{ 'selected-row': row.id === selected_data.id }" @click="toggleModalDetail(index)">
              <td class="text-left" :data-testid="`${id}__tr-${index}__tr-number`">{{ index + pagination.start }}</td>
              <td class="text-left" :data-testid="`${id}__tr-${index}__tr-id`">
                <overview-label additional_class="my-0" :has_space="false" :value="row.transaction_id" limit_text="6"
                  :ref="`label-transaction-id-${index}`" :is_italic="false" />
              </td>
              <td class="text-left" :data-testid="`${id}__tr-${index}__tr-license-plate`">{{ row.license_plate }}</td>
              <td class="text-left" :data-testid="`${id}__tr-${index}__tr-rfid`"
                v-if="transaction_type.value !== 'NON_MEMBER'">{{ row.rf_id }}</td>
              <td class="text-left" :data-testid="`${id}__tr-${index}__tr-vhc-member`"
                v-if="transaction_type.value !== 'NON_MEMBER'">{{ row.vehicle_code_member }}</td>
              <td class="text-left" :data-testid="`${id}__tr-${index}__th-vhc-in`"
                v-if="transaction_type.value !== 'MEMBER' || gate_type.value !== 'OUT'">{{
                  row.vehicle_code }}</td>
              <td class="text-left" :data-testid="`${id}__tr-${index}__th-vhc-out`"
                v-if="transaction_type.value !== 'MEMBER' || gate_type.value !== 'IN'">{{
                  row.vehicle_code_out }}</td>
              <td class="text-center" :data-testid="`${id}__tr-${index}__th-status`">{{ row.status }}</td>
              <td class="text-left" :data-testid="`${id}__tr-${index}__th-time-in`"
                v-if="transaction_type.value !== 'MEMBER' || gate_type.value !== 'OUT'">{{
                  row.time_in }}</td>
              <td class="text-left" :data-testid="`${id}__tr-${index}__th-time-out`"
                v-if="transaction_type.value !== 'MEMBER' || gate_type.value !== 'IN'">{{
                  row.time_out }}</td>
              <td class="text-left" :data-testid="`${id}__tr-${index}__th-paid-at`">{{ row.paid_at }}</td>
              <td class="text-right" :data-testid="`${id}__tr-${index}__th-amount`">{{ row.amount }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-12 text-right">
        <card-pagination-view :per_page="pagination.per_page" :total_data="pagination.total_data" additional_class="mt-3 "
          :current_page="pagination.current_page" :test_id="`${id}__pagination`" @update="passUpdatePagination" />
      </div>
    </content-table-view>

    <plain-modal size="xl" v-model="modal.detail" @close="resetSelectedData" :test_id="`${id}__modal-detail`">
      <parking-image-detail :data="selected_data.image_list" />
      <div class="row mt-2">
        <div class="col-12 col-lg-6 col-xl-4">
          <div class="row mb-2 pb-1">
            <div class="col-6 font-weight-bold">No.</div>
            <div class="col-6" :data-testid="`${id}__modal-detail__number`">{{ selected_data.order }}</div>
          </div>
          <div class="row mb-2 pb-1">
            <div class="col-6 font-weight-bold">Transaksi</div>
            <div class="col-6 text-truncate" :data-testid="`${id}__modal-detail__id`">{{ selected_data.id }}</div>
          </div>
          <div class="row mb-2 pb-1">
            <div class="col-6 font-weight-bold">Plat Nomor</div>
            <div class="col-6" :data-testid="`${id}__modal-detail__license-plate`">{{ selected_data.license_plate }}</div>
          </div>
          <div class="row mb-2 pb-1">
            <div class="col-6 font-weight-bold">RF ID</div>
            <div class="col-6" :data-testid="`${id}__modal-detail__rfid`">{{ selected_data.rf_id }}</div>
          </div>
        </div>
        <div class="col-12 col-lg-6 col-xl-4">
          <div class="row mb-2 pb-1">
            <div class="col-6 font-weight-bold">Kendaraan Member</div>
            <div class="col-6" :data-testid="`${id}__modal-detail__vhc-member`">{{ selected_data.vehicle_code_member }}
            </div>
          </div>
          <div class="row mb-2 pb-1">
            <div class="col-6 font-weight-bold">Kendaraan Masuk</div>
            <div class="col-6" :data-testid="`${id}__modal-detail__vhc-in`">{{ selected_data.vehicle_code }}</div>
          </div>
          <div class="row mb-2 pb-1">
            <div class="col-6 font-weight-bold">Kendaraan Keluar</div>
            <div class="col-6" :data-testid="`${id}__modal-detail__vhc-out`">{{ selected_data.vehicle_code_out }}</div>
          </div>
          <div class="row mb-2 pb-1">
            <div class="col-6 font-weight-bold">Status</div>
            <div class="col-6" :data-testid="`${id}__modal-detail__status`">{{ selected_data.status }}</div>
          </div>
        </div>
        <div class="col-12 col-lg-6 col-xl-4">
          <div class="row mb-2 pb-1">
            <div class="col-6 font-weight-bold">Waktu Masuk Transaksi</div>
            <div class="col-6" :data-testid="`${id}__modal-detail__time-in`">{{ selected_data.time_in }}</div>
          </div>
          <div class="row mb-2 pb-1">
            <div class="col-6 font-weight-bold">Waktu Keluar Transaksi</div>
            <div class="col-6" :data-testid="`${id}__modal-detail__time-out`">{{ selected_data.time_out }}</div>
          </div>
        </div>
      </div>
      <div class="text-right mt-3 pt-1">
        <active-button @click="toggleModalDetail(selected_data.index - 1)"
          :is_disabled="selected_data.order == pagination.start" type="outline" variant="secondary" text="Sebelumnya"
          additional_class="mr-2" :test_id="`${id}__modal-detail__btn-prev`" />
        <active-button @click="toggleModalDetail(selected_data.index + 1)"
          :is_disabled="selected_data.order == pagination.end" text="Selanjutnya"
          :test_id="`${id}__modal-detail__btn-next`" />
      </div>
    </plain-modal>

    <toast-last-sync :last_sync="helper.last_sync" id="last-sync-report-vehicle-validation"
      test_id="last-sync-report-vehicle-validation" />
  </div>
</template>

<script>
import { reportMethods } from "@/store/helperActions";
import constant_resolution_center from "@/constants/resolution-center"

export default {
  components: {
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
    PlainModal: () => import("@utilities/atoms/modal/PlainModal"),
    OverviewLabel: () => import("@utilities/atoms/label/OverviewLabel"),
    CardPaginationView: () => import("@utilities/molecules/card-view/CardPaginationView"),
    ContentTableView: () => import("@utilities/molecules/content-view/ContentTableView"),
    ToastLastSync: () => import("@/components/organisms/report/_shared/ToastLastSync"),
    ParkingImageDetail: () => import("@/components/organisms/resolution-center/ParkingImageDetail")
  },

  props: {
    is_searching: { default: false },
    month: { default: "" },
    transaction_type: { default: "" },
    gate_type: { default: "" },
  },

  data: () => ({
    id: "report-vehicle-validation__table",
    data: {
      rows: [],
    },
    report: [],
    selected_data: {},
    helper: {
      last_sync: null,
      is_loading: false,
      is_error: false,
    },
    modal: {
      detail: false,
    },
    pagination: {
      start: 0,
      end: 0,
      per_page: 10,
      current_page: 1,
      total_data: 0
    },
    vehicle_map: {},
    transaction_status: constant_resolution_center.transaction_status
  }),

  computed: {
    filter_title() {
      this.pagination.end = this.pagination.start - 1 + this.report.length
      let text = `
        Menampilkan
          <b>&nbsp;${this.pagination.start}-${this.pagination.end}&nbsp;</b>
        dari
          <b>&nbsp;${this.pagination.total_data}&nbsp;</b>
        transaksi
      `
      return text
    }
  },

  watch: {
    is_searching: {
      async handler(value) {
        if (value) this.passUpdatePagination(1)
      },
    },
  },

  async mounted() {
    await this.setVehicleMap()
    await this.processGetData()
  },

  methods: {
    ...reportMethods,

    async passUpdatePagination(data) {
      this.pagination.current_page = data
      await this.processGetData()
    },

    setPayloadGet() {
      const payload = {
        filter: [
          { key: 'month', value: this.month ?? "" },
          { key: 'spot_id', value: this.$utility.getSpotId() }
        ],
        pagination: {
          current_page: this.pagination.current_page,
          per_page: this.pagination.per_page
        }
      }
      if (this.transaction_type.value)
        payload.filter.push({ key: 'transaction_type', value: this.transaction_type.value })
      if (this.transaction_type.value === "MEMBER" && this.gate_type.value)
        payload.filter.push({ key: "gate_type", value: this.gate_type.value })
      return payload
    },

    async setVehicleMap() {
      this.vehicle_map = await this.$utility.getVehicleMap()
      this.vehicle_map["MT"] = "Motor"
      this.vehicle_map["MB"] = "Mobil"
    },

    setNumber() {
      this.pagination.start = 1 + (parseInt(this.pagination.current_page) - 1) * parseInt(this.pagination.per_page)
    },

    resetSelectedData() {
      this.selected_data = {}
    },

    toggleModalDetail(index) {
      if (isFinite(index) && this.report[index]) {
        this.selected_data = { ...this.report[index] }
        this.selected_data.index = index
        this.selected_data.order = index + this.pagination.start
        this.modal.detail = true
      } else {
        this.selected_data = {}
        this.modal.detail = false
      }
    },

    formatShownReport() {
      if (this.data.rows.length > 0) {
        this.report = this.formatContentReport(this.data.rows);
      }
    },

    formatContentReport(rows) {
      try {
        return rows.map(row => {
          let data_row = {
            id: row.id,
            transaction_id: row.transaction_id,
            rf_id: row.rf_id ?? "-",
            vehicle_code_member: row.vehicle_code_member ? this.vehicle_map[row.vehicle_code_member] : "-",
            vehicle_code: row.vehicle_code ? this.vehicle_map[row.vehicle_code] : "-",
            vehicle_code_out: row.vehicle_code_out ? this.vehicle_map[row.vehicle_code_out] : "-",
            time_in: "-",
            time_out: "-",
            paid_at: "-",
            status: "-",
            amount: "-",
            license_plate: row.license_plate ?? "-",
            image_list: {
              image_url: [''],
              image_out_url: [''],
            }
          }
          if (row.transaction_detail) {
            const transaction = row.transaction_detail
            data_row.time_in = this.$utility.formatLocalTimezone(transaction.time_in, "DD/MM/YYYY HH:mm") ?? "-"
            data_row.time_out = this.$utility.formatLocalTimezone(transaction.time_out, "DD/MM/YYYY HH:mm") ?? "-"
            data_row.paid_at = this.$utility.dateUTCToLocal(transaction.paid_at, 'DD/MM/YYYY HH:mm') ?? "-",
              data_row.status = this.transaction_status(transaction.status) ?? "-"
            data_row.amount = this.$utility.convertToRupiah(transaction.amount) ?? "-"
            if (transaction.image_list) {
              const image_list = transaction.image_list
              if (image_list.image_url && image_list.image_url.length)
                data_row.image_list.image_url = image_list.image_url
              if (image_list.image_out_url && image_list.image_out_url.length)
                data_row.image_list.image_out_url = image_list.image_out_url
            }
          }
          return data_row
        })
      } catch (error) {
        this.$utility.setErrorContextSentry(error);
        this.$sentry.captureMessage(
          `${error.message} at formatContentReport in TableTransactionReport`
        );
        throw error
      }
    },

    async processGetData() {
      this.helper.is_loading = true;
      this.helper.is_error = false;
      try {
        const payload = this.setPayloadGet();
        const data = await this.getVehicleValidationReport(payload);
        this.helper.last_sync = data.last_sync
        this.data.rows = data.rows
        this.pagination.total_data = data.total
        this.formatShownReport();
        this.setNumber()
        this.$emit("ready", data.total)
      } catch (error) {
        this.helper.is_error = true;
        this.data.rows = []
        this.pagination.total_data = 0
        this.helper.last_sync = ''
      }
      this.helper.is_loading = false;
    },
  },
};
</script>
