<template>
  <div>
    <content-table-view :test_id="`wrapper__${id}`" :is_loading="helper.is_loading" :is_error="helper.is_error"
      :is_init="helper.is_init" :length="data.rows.length" empty-caption="Laporan Belum Tersedia" @reload="processGetData">
      <div class="col-12 p-0 rounded">
        <table class="d-block table table-striped table-sticky-header report-table" :data-testid="id">
          <thead class="thead-primary">
            <tr>
              <th class="cell-sticky" :data-testid="`${id}__thead__th-id`"
                style="top: 1px; left: 0px; width: 94px; z-index: 3;">
                ID Transaksi</th>
              <th class="cell-sticky" :data-testid="`${id}__thead__th-license-plate`"
                style="top: 1px; left: 94px; z-index: 3;">
                Plat</th>
              <th class="cell-sticky" :data-testid="`${id}__thead__th-time-in`" style="top: 1px;">Masuk</th>
              <th class="cell-sticky" :data-testid="`${id}__thead__th-time-out`" style="top: 1px;">Keluar</th>
              <th class="cell-sticky" :data-testid="`${id}__thead__th-duration`" style="top: 1px; width: 5%;">Durasi</th>
              <th class="cell-sticky" :data-testid="`${id}__thead__th-stnk`" style="top: 1px;">Nomor STNK</th>
              <th class="cell-sticky" :data-testid="`${id}__thead__th-stnk-image`" style="top: 1px;">Foto STNK</th>
              <th class="cell-sticky" :data-testid="`${id}__thead__th-vehicle-type`" style="top: 1px;">Jenis Kendaraan
              </th>
              <th class="cell-sticky" :data-testid="`${id}__thead__th-fine-type`" style="top: 1px;">Tipe Denda</th>
              <th class="cell-sticky" :data-testid="`${id}__thead__th-officer`" style="top: 1px;">Petugas</th>
              <th class="cell-sticky" :data-testid="`${id}__thead__th-parking-price`" style="top: 1px;">Tarif Parkir</th>
              <th class="cell-sticky" :data-testid="`${id}__thead__th-overstay-price`" style="top: 1px;">Tarif Inap</th>
              <th class="cell-sticky" :data-testid="`${id}__thead__th-fine-price`" style="top: 1px;">Denda</th>
              <th class="cell-sticky" :data-testid="`${id}__thead__th-total-price`" style="top: 1px;">Total Bayar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in data.rows" :key="`row-${index}`"
              :class="{ 'selected-row': row.id == selected_data.id }">
              <td class="cell-sticky" style="left: 0px; width: 94px; z-index: 2;"
                :data-testid="`${id}__tr-${index}__td-id`">
                <overview-label :has_space="false" :value="row.transaction_id" limit_text="6" :is_italic="false"
                  :test_id="`${id}__tr-${index}__label-id`" :ref="`${id}__tr-${index}__label-id`" />
              </td>
              <td class="cell-sticky" style="left: 94px; z-index: 2;"
                :data-testid="`${id}__tr-${index}__td-license-plate`">{{ row.license_plate }}</td>
              <td :data-testid="`${id}__tr-${index}__td-time-in`">{{ row.time_in }}</td>
              <td :data-testid="`${id}__tr-${index}__td-time-out`">{{ row.time_out }}</td>
              <td :data-testid="`${id}__tr-${index}__td-duration`">{{ row.total_hours }}</td>
              <td :data-testid="`${id}__tr-${index}__td-stnk`">{{ row.stnk_number }}</td>
              <td :data-testid="`${id}__tr-${index}__td-stnk-image`">
                <active-button v-if="row.photo_url" size="sm" type="outline" text="Lihat STNK"
                  :test_id="`${id}__tr-${index}__btn-preview-stnk`" :ref="`${id}__tr-${index}__btn-preview-stnk`"
                  @click="toggleModalImage(row)" />
                <span v-else :data-testid="`${id}__tr-${index}__no-stnk-image`" class="font-size-10 text-muted">
                  Tidak ada Gambar
                </span>
              </td>
              <td :data-testid="`${id}__tr-${index}__td-vehicle-type`">{{ row.vehicle_code }}</td>
              <td :data-testid="`${id}__tr-${index}__td-fine-type`">{{ row.fine_type }}</td>
              <td :data-testid="`${id}__tr-${index}__td-officer`">{{ row.officer_name }}</td>
              <td :data-testid="`${id}__tr-${index}__td-parking-price`">{{ row.parking_price }}</td>
              <td :data-testid="`${id}__tr-${index}__td-overstay-price`">{{ row.overnight_price }}</td>
              <td :data-testid="`${id}__tr-${index}__td-fine-price`">{{ row.fine }}</td>
              <td :data-testid="`${id}__tr-${index}__td-total-price`">{{ row.total_price }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colspan="2" class="bg-primary cell-sticky" style="left: 0px; z-index: 2;">Total</th>
              <td colspan="8"></td>
              <td :data-testid="`${id}__tfoot__td-parking-price`">{{ data.total.parking_price }}</td>
              <td :data-testid="`${id}__tfoot__td-overstay-price`">{{ data.total.overnight_price }}</td>
              <td :data-testid="`${id}__tfoot__td-fine-price`">{{ data.total.fine }}</td>
              <td :data-testid="`${id}__tfoot__td-total-price`">{{ data.total.total_price }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </content-table-view>

    <div v-if="pagination.total_data > 0" class="d-flex justify-content-end">
      <card-pagination-view :per_page="pagination.per_page" :total_data="pagination.total_data"
        additional_class="mt-3 " :current_page="pagination.current_page" @update="passUpdatePagination"/>
    </div>

    <plain-modal v-model="modal.modal_preview" @close="toggleModalImage" :test_id="`${id}__modal-preview-stnk`">
      <div>
        <img :src="selected_data.photo_url" class="img-fluid rounded" :data-testid="`${id}__modal-preview-stnk__image`" />
      </div>
      <div class="mt-2">
        <active-button additional_class="w-100" text="Tutup" :test_id="`${id}__modal-preview-stnk__btn-close`"
          :ref="`${id}__modal-preview-stnk__btn-close`" @click="toggleModalImage()" />
      </div>
    </plain-modal>
  </div>
</template>

<script>
import { reportMethods } from "@/store/helperActions";
import price_constant from "@/constants/price"

export default {
  components: {
    ContentTableView: () => import("@utilities/molecules/content-view/ContentTableView"),
    CardPaginationView: () => import("@utilities/molecules/card-view/CardPaginationView"),
    PlainModal: () => import("@utilities/atoms/modal/PlainModal"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
    PriceLabel: () => import("@utilities/atoms/label/PriceLabel"),
    OverviewLabel: () => import("@utilities/atoms/label/OverviewLabel"),
    ContentImage: () => import("@utilities/atoms/image/ContentImage"),
  },
  props: {
    is_searching: { default: false },
    month: { default: "" },
    officer: { default: () => ([]) },
  },

  data: () => ({
    id: "report-lost-ticket__table",
    data: {
      rows: [],
      total: {}
    },
    selected_data: {},
    modal: {
      modal_preview: false,
    },
    pagination: {
      current_page: 1,
      per_page: 10,
      total_data: 0
    },
    helper: {
      spot_timezone: "",
      is_loading: false,
      is_error: false,
      is_init: false
    },
    vehicle_map: {},
    fine_type_map: price_constant.fine_type_map()
  }),

  watch: {
    is_searching: {
      async handler(value) {
        this.helper.is_init = false
        if (value === true) await this.passUpdatePagination(1);
      },
    },
  },

  async mounted() {
    this.helper.is_init = true
    this.vehicle_map = await this.$utility.getVehicleMap()
  },

  methods: {
    ...reportMethods,

    passFormatDownloadReport(data) {
      let payload = { content: [] }
      if (data) {
        if (data.rows && data.rows.length > 0) {
          this.data.rows = this.formatContentReport(data.rows)
          payload.content = [...this.data.rows]
        }
        if (data.total && data.total.parking_price) {
          this.data.total = this.formatTotalReport(data.total)
          payload.content.push(this.data.total)
        }
      }
      this.$emit("ready", payload)
    },

    async passUpdatePagination(page) {
      this.pagination.current_page = page
      await this.processGetData()
    },

    setPayloadGet() {
      const payload = {
        filter: [
          { key: "month", value: this.month },
          { key: "spot_id", value: this.$utility.getSpotId() },
          { key: "status", value: "all" },
          { key: "page", value: this.pagination.current_page },
          { key: "per_page", value: this.pagination.per_page }
        ]
      }
      if (this.officer && this.officer.length) {
        const officer = this.officer.map(item => item.value).join(",")
        payload.filter.push({ key: "officer_id", value: officer })
      }
      return payload
    },

    formatContentReport(rows) {
      try {
        return rows.map(row => ({
          id: row.id,
          transaction_id: row.transaction_id,
          license_plate: row.license_plate.toUpperCase(),
          time_in: this.$utility.formatLocalTimezone(row.transaction_detail.time_in, 'DD/MM/YYYY HH:mm:ss'),
          time_out: this.$utility.formatLocalTimezone(row.transaction_detail.time_out, 'DD/MM/YYYY HH:mm:ss'),
          total_hours: this.processCountDuration(row.total_hours),
          submitter: row.photo_url ? "Aplikasi Kasir" : "Kasir",
          stnk_number: row.stnk_number ? row.stnk_number : "-",
          photo_url: row.photo_url,
          vehicle_code: this.vehicle_map[row.transaction_detail.vehicle_code],
          fine_type: this.fine_type_map[row.type],
          officer_name: row.officer_detail.name,
          parking_price: this.$utility.convertToRupiah(row.parking_price),
          overnight_price: this.$utility.convertToRupiah(row.overnight_price),
          fine: this.$utility.convertToRupiah(row.fine),
          total_price: this.$utility.convertToRupiah(row.total_price),
        }));
      } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatContentReport in TableLostTicketReport`)
        return []
      }
    },

    toggleModalImage(selected_data = null) {
      if (selected_data && selected_data.photo_url) {
        this.selected_data = selected_data
        this.modal.modal_preview = true
      } else {
        this.modal.modal_preview = false
        this.selected_data = {}
      }
    },

    processCountDuration(totalHours = 0) {
      const duration = parseInt(totalHours)
      if (duration >= 24) {
        const totalDays = Math.floor(duration / 24)
        let durationText = `${totalDays} Hari`

        const overDaysTime = duration % 24
        if (overDaysTime > 0) durationText = `${durationText} ${overDaysTime} Jam`

        return durationText
      } else {
        return `${duration} Jam`
      }
    },

    formatTotalReport(total) {
      try {
        return {
          transaction_id: "Total",
          parking_price: this.$utility.convertToRupiah(total.parking_price),
          fine: this.$utility.convertToRupiah(total.fine),
          overnight_price: this.$utility.convertToRupiah(total.overnight_price),
          total_price: this.$utility.convertToRupiah(total.total_price),
        }
      } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatTotalReport in TableLostTicketReport`)
        return {}
      }
    },

    async processGetData() {
      this.helper.is_loading = true
      this.helper.is_error = false
      this.data = { rows: [], total: {} }
      try {
        const payload = this.setPayloadGet()
        const data = await this.getLostTicketReport(payload)
        this.pagination.total_data = data.total_values
        this.passFormatDownloadReport(data)
      } catch (error) {
        this.data = { rows: [], total: {} }
        this.helper.is_error = true
        this.passFormatDownloadReport()
      }
      this.helper.is_loading = false
    },
  }
}
</script>
