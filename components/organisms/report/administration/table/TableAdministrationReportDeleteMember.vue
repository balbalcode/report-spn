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
      membership_type: "",
      is_loading: false,
      is_error: false
    },
    administration_type: constant_report.administration_type(),
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

    passErrorToParent(error = "something error!") {
      this.$emit("error", {state: true, message: error})
    },

    passFormatDownloadReport() {
      let payload = { header: {}, content: [] }
      if (this.data.rows.length > 0) {
        this.report = this.formatContentReport()
        payload = {
          header: this.formatHeaderReport(),
          content: this.report
        }
      }
      this.$emit("ready", payload)
    },

    async setMemberType() {
      this.helper.membership_type = await this.$utility.getSpotMembershipType()
    },

    setPayloadGet() {
      return {
        filter: [
          { key: "month", value: this.month },
          { key: "spot_id", value: this.$utility.getSpotId() },
          { key: "administration", value: this.administration.value },
          { key: "name", value: this.name },
          { key: "type", value: this.helper.membership_type.toLowerCase() }
        ]
      }
    },

    formatHeaderReport(){
      let merger_header = {}
      if(this.helper.membership_type === "CARD"){
        merger_header = {
          "RFID":  "rf_id",
          "Nomor Kartu": "card_id",
        }
      } else {
        merger_header = {
          "Plat 3": "third_license_plate",
        }
      }

      let header = {
        "Tanggal": "date",
        "Nama": "name",
        "Jenis Administrasi": "type",
        "Plat 1": "license_plate",
        "Plat 2": "second_license_plate",
        ...merger_header,
        "Nomor Identitas": "identification_number",
        "Email": "email",
        "User": "user",
        "Catatan": "note",
      }

      return header
    },

    formatContentReport() {
      try {
        if (!this.data.rows) return []
        let data = this.data.rows
        return data.map((item) => {
          let row = {
            "date": item.date,
            "type": this.administration.text,
            "name": item.name,
            "identification_number": item.identification_number,
            "email": item.email,
            "note": "-",
            "user": item.mgmt_user_detail && item.mgmt_user_detail.name ? item.mgmt_user_detail.name : "",
          }
          if(this.helper.membership_type === 'CARD'){
            row["rf_id"] = item.card.rf_id
            row["card_id"] = item.card.card_id
            row["license_plate"] = item.card.license_plate
            row["second_license_plate"] = item.card.second_license_plate
          } else {
            row["license_plate"] = item.motorcycle[0].license_plate
            row["second_license_plate"] = (item.motorcycle[1]) ? item.motorcycle[1].license_plate : "-"
            row["third_license_plate"] = (item.motorcycle[2]) ? item.motorcycle[2].license_plate : "-"
          }
          if (item.message) {
            try {
              let message = JSON.parse(item.message)
              if (message.note) row.note = message.note
            } catch (error) {
              row.note = ""
              this.$utility.fireToast(
                "Catatan dan alasan gagal dimuat",
                "dark",
                "Kami tidak dapat memuat data Catatan dan Alasan pada daftar transaksi yang anda inginkan"
              )
              this.$utility.setErrorContextSentry(error)
              this.$sentry.captureMessage(`error ${error.message} at formatContentReport in TableAdministrationReport`)
            }
          }
          return row
        })
        } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatContentReport in TableAdministrationReport`)
        this.passErrorToParent(error)
        this.report = []
        return []
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
        <table class="d-block table table-striped table-sticky-header report-table" id="tableReportData">
          <thead class="thead-primary">
          <tr>
            <th rowspan="2" class="cell-sticky" style="top: 1px; left: 0; min-width: 67px; z-index: 3;">Tanggal</th>
            <th rowspan="2" class="cell-sticky" style="top: 1px; left: 67px; z-index: 3;">Nama</th>
            <th width="10%" rowspan="2" class="cell-sticky" style="top: 1px;">Jenis Administrasi</th>
            <th width="8%" rowspan="2" class="cell-sticky" style="top: 1px;">Plat 1</th>
            <th width="8%" rowspan="2" class="cell-sticky" style="top: 1px;">Plat 2</th>
            <th width="8%" rowspan="2" class="cell-sticky" style="top: 1px;" v-if="helper.membership_type ==='LICENSE_PLATE'">Plat 3</th>
            <th rowspan="2" class="cell-sticky" style="top: 1px;" v-if="helper.membership_type === 'CARD'">RFID</th>
            <th rowspan="2" class="cell-sticky" style="top: 1px;" v-if="helper.membership_type === 'CARD'">Nomor kartu</th>
            <th rowspan="2" class="cell-sticky" style="top: 1px;">Nomor Identitas</th>
            <th rowspan="2" class="cell-sticky" style="top: 1px;">Email</th>
            <th rowspan="2" class="cell-sticky" style="top: 1px;">User Management</th>
            <th rowspan="2" class="cell-sticky" style="top: 1px;">Catatan</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(row, index) in report" :key="`row-${index}`">
            <td class="cell-sticky" style="left: 0; min-width: 67px; z-index: 2;">{{ row.date }}</td>
            <td class="cell-sticky" style="left: 67px; z-index: 2;">{{ row.name }}</td>
            <td>{{ row.type }}</td>
            <td>{{ row.license_plate }}</td>
            <td>{{ row.second_license_plate }}</td>
            <td v-if="helper.membership_type ==='LICENSE_PLATE'">{{ row.third_license_plate }}</td>
            <td v-if="helper.membership_type === 'CARD'">{{ row.rf_id }}</td>
            <td v-if="helper.membership_type === 'CARD'">{{ row.card_id }}</td>
            <td>{{ row.identification_number }}</td>
            <td>{{ row.email }}</td>
            <td>{{ row.user }}</td>
            <td>{{ row.note }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
