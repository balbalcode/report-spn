<script>
import {reportMethods} from "~/store/helperActions";
import constant_report from "@/constants/report"

export default {
  components: {
    ContentSpan: () => import("@utilities/atoms/utility/ContentSpan"),
    ContentTableView: () => import("@utilities/molecules/content-view/ContentTableView"),
  },
  props: {
    is_searching: {default: false},
    month: {default: ""},
    name: {default: ""},
    administration: {default: () => ({value: ""})},
  },
  data: () => ({
    data: {
      rows: [],
      total: {}
    },
    report: [],
    helper: {
      is_loading: false,
      is_error: false
    },
    administration_type: constant_report.administration_type(),
    membership_type: "", // CARD or LICENSE_PLATE
  }),
  watch: {
    is_searching: {
      async handler(value) {
        if (value) await this.processGetData()
      }
    },
  },
  async mounted() {
    await this.setMemberType()
    if (this.is_searching) await this.processGetData()
  },
  methods: {
    ...reportMethods,

    passErrorToParent(error) {
      this.$emit("error", {state: true, message: error})
    },

    passFormatDownloadReport() {
      let payload = { header: {}, content: [] }
      if (this.data.rows.length > 0) {
        this.report = this.formatContentReport()
        const totals = this.formatTotalReport()
        payload = {
          header: constant_report.administration_report_header(this.membership_type),
          content: this.report.concat(totals)
        }
      }
      this.$emit("ready", payload)
    },

    async setMemberType() {
      this.membership_type = await this.$utility.getSpotMembershipType()
    },

    setPayloadGet() {
      return {
        filter: [
          { key: "month", value: this.month },
          { key: "spot_id", value: this.$utility.getSpotId() },
          { key: "administration", value: this.administration.value },
          { key: "name", value: this.name },
          { key: "type", value: this.membership_type.toLowerCase() }
        ]
      }
    },

    formatContentReport() {
      try {
        let data = this.data.rows
        return data.map((item) => {
          let row = {
            "date": item.date,
            "vehicle_name": item.vehicle_name,
            "type": this.administration.text,
            "name": "-",
            "identification_number": "-",
            "email": "-",
            "previous_license_plate": "-",
            "previous_second_license_plate": "-",
            "updated_license_plate": "-",
            "updated_second_license_plate": "-",
            "note": "-",
            "reason": "-",
            "user": item.mgmt_user_detail && item.mgmt_user_detail.name ? item.mgmt_user_detail.name : "",
            "amount": this.$utility.convertToRupiah(item.amount)
          }

          if (item.message) {
            try {
              let message = JSON.parse(item.message)
              if (message.note) row.note = message.note
              if (message.reason) row.reason = message.reason
            } catch (error) {
              row.note = ""
              row.reason = ""
              this.$utility.fireToast(
                "Catatan dan alasan gagal dimuat",
                "dark",
                "Kami tidak dapat memuat data Catatan dan Alasan pada daftar transaksi yang anda inginkan"
              )
              this.$utility.setErrorContextSentry(error)
              this.$sentry.captureMessage(`error ${error.message} at formatContentReport in TableAdministrationReport`)
            }
          }

          // check previous_data & updated_data
          for (let data_type of ["previous", "updated"]) {
            if (item[`${data_type}_data`]) {
              const data = item[`${data_type}_data`]

              // check name, identification_number & email
              for (let key of ["name", "identification_number", "email"]) {
                if (data[key]) row[key] = data[key]
              }

              // check card data (inside previous_data & updated_data)
              if (this.membership_type === "CARD") {
                if (data.card) {
                  const card = data.card
                  for (let key of ["rf_id", "card_id", "license_plate", "second_license_plate"]) {
                    if (card[key]) row[`${data_type}_${key}`] = card[key]
                  }
                } else {
                  row[`${data_type}_rf_id`] = "-"
                  row[`${data_type}_card_id`] = "-"
                }
              }

              // check motorcycle data (inside previous_data & updated_data)
              else if (this.membership_type === "LICENSE_PLATE") {
                if (data.motorcycle && data.motorcycle.length) {
                  const motorcycle = data.motorcycle
                  if (motorcycle[0] && motorcycle[0].license_plate)
                    row[`${data_type}_license_plate`] = motorcycle[0].license_plate
                  if (motorcycle[1] && motorcycle[1].license_plate)
                    row[`${data_type}_second_license_plate`] = motorcycle[1].license_plate
                  if (motorcycle[2] && motorcycle[2].license_plate)
                    row[`${data_type}_third_license_plate`] = motorcycle[2].license_plate
                } else {
                  row.third_license_plate = "-"
                }
              }
            }
          }

          return row
        })
      } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatContentReport in TableAdministrationReport`)
        this.passErrorToParent(error)
        return []
      }
    },

    formatTotalReport() {
      try {
        return {
          "date": 'Total',
          "amount": this.data.total.amount
        }
      } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatContentReport in TableAdministrationReport`)
        this.passErrorToParent(error)
        return {}
      }
    },

    async processGetData() {
      this.helper.is_loading = true
      this.helper.is_error = false
      try {
        let payload = this.setPayloadGet()
        this.data = await this.getAdministrationReport(payload)
        this.passFormatDownloadReport()
      } catch (error) {
        this.helper.is_loading = error
        this.data = {rows: [], total: {}}
        this.helper.is_error = true
      }
      this.helper.is_loading = false
    },
  }
}
</script>
<template>
  <div>
    <div class="row" v-if="helper.is_loading">
      <content-span/>
    </div>

    <div class="row" v-else-if="helper.is_error">
      <content-span image="error.png" size="xl" :has_animation="false" caption="Gagal memuat data" has_reload_button
                    @reload="processGetData"/>
    </div>

    <div class="row" v-else-if="data.rows.length < 1">
      <content-span image="empty.png" size="xl" :has_animation="false" caption="Laporan belum tersedia"/>
    </div>
    <div class="row py-1 px-3" v-else>
      <div class="col-12 p-0 rounded">
        <table class="d-block table table-striped table-sticky-header report-table">
          <thead class="thead-primary">
          <tr>
            <th rowspan="2" class="cell-sticky" style="top: 1px; left: 0; min-width: 67px; z-index: 3;">Tanggal</th>
            <th rowspan="2" class="cell-sticky" style="top: 1px; left: 67px; z-index: 3;">Nama</th>
            <th rowspan="2" class="cell-sticky" style="top: 1px;">Jenis Kendaraan</th>
            <th rowspan="2" class="cell-sticky" style="top: 1px;">Jenis Administrasi</th>
            <th rowspan="2" class="cell-sticky" style="top: 1px;">Nomor Identitas</th>
            <th rowspan="2" class="cell-sticky" style="top: 1px;">Email</th>
            <th v-for="data_type in ['Data Lama', 'Data Baru']" :key="`header-${data_type}`"
              :colspan="membership_type === 'CARD' ? 4 : membership_type === 'LICENSE_PLATE' ? 3 : 2"
              class="cell-sticky" style="top: 1px; min-height: 44.5px;"
            >
              {{ data_type }}
            </th>
            <th rowspan="2" class="cell-sticky" style="top: 1px;">User Management</th>
            <th rowspan="2" class="cell-sticky" style="top: 1px;">Catatan</th>
            <th rowspan="2" class="cell-sticky" style="top: 1px;">Alasan Perubahan Harga</th>
            <th rowspan="2" class="cell-sticky" style="top: 1px;">Biaya</th>
          </tr>
          <tr>
            <template v-for="index in 2">
              <template v-if="membership_type === 'CARD'">
                <th :key="`rf_id_header_${index}`" class="cell-sticky" style="top: 45.5px;">RF ID</th>
                <th :key="`card_id_header_${index}`" class="cell-sticky" style="top: 45.5px;">Nomor Kartu</th>
              </template>
              <th :key="`plate_1_header_${index}`" class="cell-sticky" style="top: 45.5px;">Plat 1</th>
              <th :key="`plate_2_header_${index}`" class="cell-sticky" style="top: 45.5px;">Plat 2</th>
              <template v-if="membership_type === 'LICENSE_PLATE'">
                <th :key="`plate_3_header_${index}`" class="cell-sticky" style="top: 45.5px;">Plat 3</th>
              </template>
            </template>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(row, index) in report" :key="`row-${index}`">
            <td class="cell-sticky" style="left: 0; min-width: 67px; z-index: 2;">{{ row.date }}</td>
            <td class="cell-sticky" style="left: 67px; z-index: 2;">{{ row.name }}</td>
            <td>{{ row.vehicle_name }}</td>
            <td>{{ row.type }}</td>
            <td>{{ row.identification_number }}</td>
            <td>{{ row.email }}</td>
            <template v-if="membership_type === 'CARD'">
              <td>{{ row.previous_rf_id }}</td>
              <td>{{ row.previous_card_id }}</td>
            </template>
            <td>{{ row.previous_license_plate }}</td>
            <td>{{ row.previous_second_license_plate }}</td>
            <template v-if="membership_type === 'LICENSE_PLATE'">
              <td>{{ row.previous_third_license_plate }}</td>
            </template>
            <template v-if="membership_type === 'CARD'">
              <td>{{ row.updated_rf_id }}</td>
              <td>{{ row.updated_card_id }}</td>
            </template>
            <td>{{ row.updated_license_plate }}</td>
            <td>{{ row.updated_second_license_plate }}</td>
            <template v-if="membership_type === 'LICENSE_PLATE'">
              <td>{{ row.updated_third_license_plate }}</td>
            </template>
            <td>{{ row.user }}</td>
            <td>{{ row.note }}</td>
            <td>{{ row.reason }}</td>
            <td>{{ row.amount }}</td>
          </tr>
          </tbody>
          <tfoot>
          <tr>
            <th colspan="2" class="bg-primary cell-sticky" style="left: 0px; z-index: 2;">Total</th>
            <td :colspan="membership_type === 'CARD' ? 15 : membership_type === 'LICENSE_PLATE' ? 13 : 11"></td>
            <td>{{ $utility.convertToRupiah(data.total.amount) }}</td>
          </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>
