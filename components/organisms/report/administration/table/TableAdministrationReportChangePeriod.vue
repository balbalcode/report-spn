<template>
  <div>
    <div class="row" v-if="helper.is_loading">
      <content-span ref="content-span-loading"/>
    </div>

    <div class="row" v-else-if="helper.is_error">
      <content-span image="error.png" size="xl" :has_animation="false" caption="Gagal memuat data"
        has_reload_button @reload="processGetData" ref="content-span-error"/>
    </div>

    <div class="row" v-else-if="data.rows.length < 1">
      <content-span image="empty.png" size="xl" :has_animation="false" caption="Laporan belum tersedia"
        ref="content-span-empty"/>
    </div>

    <div class="row py-1 px-3" v-else id="wrapper-table-report">
      <div class="col-12 p-0 rounded">
        <table class="d-block table table-striped table-sticky-header report-table">
          <thead class="thead-primary">
          <tr>
            <th rowspan="2" class="cell-sticky" style="top: 1px; left: 0; min-width: 67px; z-index: 3; width: 20%;">Tanggal</th>
            <th rowspan="2" class="cell-sticky" style="top: 1px;">Jenis Administrasi</th>
            <th v-for="data_type in ['Data Lama', 'Data Baru']" :key="`header-${data_type}`" colspan="1"
              class="cell-sticky" style="top: 1px; min-height: 44.5px; width: 33%;">
              {{ data_type }}
            </th>
            <th rowspan="2" class="cell-sticky" style="top: 1px; width: 10%;">Petugas</th>
          </tr>
          <tr>
            <template v-for="index in 2">
              <th :key="`th-end-date-${index}`" class="cell-sticky" style="top: 45.5px;">Tanggal Berakhir</th>
            </template>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(row, index) in report" :key="`row-${index}`">
            <td class="cell-sticky" style="left: 0; min-width: 67px; z-index: 2;">{{ row.date }}</td>
            <td>{{row.type}}</td>
            <td>{{row.previous_end_date}}</td>
            <td>{{row.updated_end_date}}</td>
            <td>{{row.user}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {reportMethods} from "~/store/helperActions";

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

    setPayloadGet() {
      return {
        filter: [
          { key: "month", value: this.month },
          { key: "spot_id", value: this.$utility.getSpotId() },
          { key: "administration", value: this.administration.value },
          { key: "type", value: this.membership_type.toLowerCase() }
        ]
      }
    },

    async setMemberType() {
      this.membership_type = await this.$utility.getSpotMembershipType()
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

    formatHeaderReport(){
      return {
        "Tanggal": "date",
        "Jenis Administrasi": "type",
        "Tanggal Berakhir (Lama)": "previous_end_date",
        "Tanggal Berakhir (Baru)": "updated_end_date",
        "Petugas": "user"
      }
    },

    formatContentReport() {
      try {
        if (!this.data.rows) return []
        let data = this.data.rows
        return data.map((item) => ({
          "date": this.$utility.dateUTCToLocal(item.created_at, "DD MMM YYYY HH:mm:ss"),
          "type": this.administration.text,
          "previous_end_date": this.$utility.formatLocalTimezone(item.previous_data.end_date),
          "updated_end_date": this.$utility.formatLocalTimezone(item.updated_data.end_date),
          "user": item.mgmt_user_detail && item.mgmt_user_detail.name ? item.mgmt_user_detail.name : "",
        }))
      } catch (error) {
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatContentReport in TableAdministrationReportChangeIdentity`)
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