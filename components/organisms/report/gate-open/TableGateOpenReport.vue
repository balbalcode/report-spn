<template>
  <div>
    <div class="row" v-if="helper.is_loading">
      <content-span/>
    </div>

    <div class="row" v-else-if="helper.is_error">
      <content-span
          :has_animation="false"
          image="error.png" size="xl"
          caption="Gagal memuat data"
          has_reload_button
          @reload="processGetData"
      />
    </div>

    <div class="row" v-else-if="report.length < 1">
      <content-span :has_animation="false" image="empty.png" size="xl" caption="Silakan atur filter untuk melihat laporan "/>
    </div>

    <div v-else class="mt-3">
      <div class="row py-1 px-3">
        <div class="col-12 p-0 rounded">
          <table class="d-block table table-striped table-sticky-header report-table" id="table-gate-open-report">
            <thead class="thead-primary">
            <tr>
              <th class="cell-sticky text-left" style="top: 1px;">No.</th>
              <th class="cell-sticky text-left" style="top: 1px; width: 20%;">Tanggal</th>
              <th class="cell-sticky text-left" style="top: 1px; width: 15%;">Pintu</th>
              <th class="cell-sticky text-left" style="top: 1px; width: 20%;">Petugas</th>
              <th class="cell-sticky text-left" style="top: 1px; width: 20%;">Alasan</th>
              <th class="cell-sticky text-left" style="top: 1px; width: 40%;">Gambar</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, index) in report" :key="`row-${index}`" @click="toggleModalImage(row)">
              <td class="text-left">{{ start + index }}.</td>
              <td class="text-left">{{ row.date }}</td>
              <td class="text-left">{{ row.gate_code }}</td>
              <td class="text-left">{{ row.officer_name }}</td>
              <td class="text-left">{{ row.reason }}</td>
              <td class="text-left">
                <overview-label additional_class="my-0 cursor-pointer" :has_space="false" :is_italic="false"
                  limit_text="40" :value="row.image" :id="`table-gate-open-report__row-${index}__image`"
                  :ref="`table-gate-open-report__row-${index}__image`"/>
             </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <plain-modal size="lg" v-model="modal.image">
        <div class="row mx-0 bg-gray-90">
          <content-image :value="selected.image" additional_class="object-contain align-middle mx-auto"
            :is_responsive="true"/>
        </div>
        <active-button @click="toggleModalImage()" text="Tutup" additional_class="w-100 mt-3" type="outline"
          variant="grey" id="btn-close-modal" ref="btn-close-modal"/>
      </plain-modal>
    </div>
  </div>
</template>

<script>
import {reportMethods} from "@/store/helperActions";
export default {
  props: {
    month: { default: "", type: String },
    page: { default: 1, type: Number },
    per_page: { default: 20, type: Number },
    is_searching: { default: false, type: Boolean }
  },
  components: {
    ContentSpan: () => import("@utilities/atoms/utility/ContentSpan"),
    OverviewLabel: () => import("@utilities/atoms/label/OverviewLabel"),
    ContentImage: () => import("@utilities/atoms/image/ContentImage"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
    PlainModal: () => import("@utilities/atoms/modal/PlainModal")
  },
  data: () => ({
    report: [],
    helper: {
      is_error: false,
      is_loading: false,
      last_sync: "",
    },
    modal: {
      image: false
    },
    selected: {}
  }),
  computed: {
    start() {
      return 1 + (parseInt(this.page) - 1) * parseInt(this.per_page)
    }
  },
  watch: {
    async is_searching(value) {
      if (value) await this.processGetData()
    }
  },
  methods: {
    getGateOpenReport: reportMethods.getGateOpenReport,

    getPayloadGetData() {
      return {
        filter: [
          { key: "spot_id", value: this.$utility.getSpotId() },
          { key: "month", value: this.month },
          { key: "page", value: this.page },
          { key: "per_page", value: this.per_page },
        ],
      }
    },

    passFormatDownloadReport(data) {
      let spot = this.$utility.getSelectedSpot()
      const end = this.start + this.per_page - 1
      const name = `Laporan Palang Pintu ${spot.text} Bulan ${this.month} (${this.start} s.d. ${end})`
      const total_data = data.total
      this.report = this.formatReport(data.data)

      const payload = { name, total_data, content: this.report }
      this.$emit("ready", payload)
    },

    formatReport(data) {
      let rows = []
      if (data.length) {
        data.forEach(row => {
          rows.push({
            date: this.$utility.dateUTCToLocal(row.created_at, "MMM DD YYYY HH:mm:ss"),
            officer_name: row.officer_name,
            reason: row.reason,
            gate_code: row.gate_code,
            image: this.$utility.mergeBaseAssetUrl(row.image)
          })
        })
      }
      return rows
    },

    toggleModalImage(data) {
      if (data) {
        this.selected = data
        this.modal.image = true
      } else {
        this.selected = {}
        this.modal.image = false
      }
    },

    async processGetData() {
      this.helper.is_loading = true;
      this.helper.is_error = false;
      try {
        const payload = this.getPayloadGetData();
        const data = await this.getGateOpenReport(payload);
        this.passFormatDownloadReport(data)
      } catch (error) {
        this.helper.is_error = true;
        this.report = []
      }
      this.helper.is_loading = false;
    },
  }
}
</script>