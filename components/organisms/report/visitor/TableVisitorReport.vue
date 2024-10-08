<script>
import { reportMethods } from "~/store/helperActions";
export default {
  components: {
    ContentTableView: () =>
      import("@utilities/molecules/content-view/ContentTableView"),
    ContentSpan: () => import("@utilities/atoms/utility/ContentSpan"),
    PriceLabel: () => import("@utilities/atoms/label/PriceLabel"),
    PlainLabel: () => import("@utilities/atoms/label/PlainLabel"),
    PlainModal: () => import("@utilities/atoms/modal/PlainModal"),
    OverviewLabel: () => import("@utilities/atoms/label/OverviewLabel"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
  },
  props: {
    is_searching: { default: false },
    date: { default: new Date() },
  },
  data: () => ({
    selected_data :{},
    data: {
      rows: [],
      total: {},
    },
    modal: {
      modal_preview: false,
    },
    helper: {
      is_loading: false,
      is_error: false,
    },
  }),
  watch: {
    is_searching: function (value) {
      if (value) this.processGetData();
    },
  },
  computed: {
    column_list: function () {
      if (Array.isArray(this.column)) {
        let result = [];
        this.column.forEach((item) => {
          result.push(item.value);
        });
        return result;
      } else return [];
    },
    report: function () {
      let data = {};
      return this.data.concat(data);
    },
  },
  async mounted() {
    if (this.is_searching) await this.processGetData();
  },
  methods: {
    ...reportMethods,
    passErrorToParent(error) {
      this.$emit("error", { state: true, message: error });
    },
    passFormatDownloadReport() {
      let payload = { header: {}, content: [] };
      if (this.data.length > 0) {
        payload = {
          header: this.formatHeaderReport(),
          content: this.formatContentReport(),
        };
      }
      this.$emit("ready", payload);
    },
    setPayloadGet() {
      return {
        date: this.date,
        spot_id: this.$utility.getSpotId(),
        opener: this.$route.path,
      };
    },
    toggleModalPreview(selected = {}) {
      this.selected_data = selected
      this.modal.modal_preview = !this.modal.modal_preview;
    },
    formatDefaultDate() {
      return this.$utility.formatDateMoment(new Date(), "YYYY-MM");
    },
    formatHeaderReport() {
      return {
        "No": "number",
        "Tanggal": "date",
        "Identitas": "identity_type",
        "Gambar Identitas": "image_url",
        "Jenis Kendaraan": "vehicle_type",
        "Plat Nomor": "license_plate",
        "Nama": "name",
        "Nomor kartu": "card_number",
        "Tujuan": "purpose",
        "Note": "notes",
        "Alamat": "address",
      };
    },
    formatContentReport(){
      try {
        let visitor = []
        this.data.map((opt, index) => {
          visitor.push({
            "number": index + 1,
            "date": this.$utility.formatDateMoment(opt.created_at, "DD/MM/YYYY HH:mm"),
            "identity_type": opt.identity_type,
            "name": opt.name,
            "license_plate": opt.license_plate,
            "image_url": opt.image_url ?? `${this.$utility.getAssetUrl()}/motorcycle.png`,
            "purpose": opt.purpose,
            "vehicle_type": opt.vehicle_type,
            "card_number": opt.card_number,
            "notes": opt.notes,
            "address": opt.address,
          })
        })
        this.data = visitor
        return visitor
      } catch(error){
        this.$utility.setErrorContextSentry(error)
        this.$sentry.captureMessage(`${error.message} at formatContentReport in TableVisitorReport`)
        this.$utility.fireToast(
            "Gagal Memformat laporan",
            "primary",
            "Kami gagal memuat laporan pengunjung, anda tidak dapat melanjutkan proses. Mohon muat ulang halaman ini",
        )
        throw error
      }
    },
    async processGetData() {
      this.helper.is_loading = true;
      this.helper.is_error = false;
      try {
        let payload = this.setPayloadGet();
        this.data = await this.getVisitorReportByDate(payload);
        this.passFormatDownloadReport();
        this.helper.is_loading = false;
      } catch (error) {
        this.helper.is_loading = false;
        this.helper.is_error = true;
      }
    },
  },
};
</script>
<template>
  <div>
    <plain-modal v-model="modal.modal_preview">
      <div class="my-2 text-center">
        <img :src="(selected_data.hasOwnProperty('image_url')) ? selected_data.image_url : $utility.getAssetUrl()" 
           alt="identification card" class="img-fluid rounded" />
      </div>
      <active-button text="Tutup" additional_class="w-100 mt-1" size="sm" variant="secondary" type="outline"
                     @click="toggleModalPreview" />
    </plain-modal>
    <div class="row" v-if="helper.is_loading">
      <content-span />
    </div>
    <div class="row" v-else-if="helper.is_error">
      <content-span
        :has_animation="false"
        image="error.png"
        size="xl"
        caption="Gagal memuat data"
        has_reload_button
        @reload="processGetData"
      />
    </div>
    <div class="row" v-else-if="data.length < 1">
      <content-span
        :has_animation="false"
        image="empty.png"
        size="xl"
        caption="Laporan belum tersedia"
      />
    </div>
    <div class="row py-1 px-3 mt-3" v-else>
      <div class="col-12 p-0 rounded">
        <table
          class="d-block table table-striped table-sticky-header report-table"
        >
          <thead class="thead-primary">
            <tr>
              <th width="2%" class="cell-sticky" style="top: 1px">No</th>
              <th class="cell-sticky" style="top: 1px">Tanggal</th>
              <th class="cell-sticky" style="top: 1px">Identitas</th>
              <th class="cell-sticky" style="top: 1px">Jenis Kendaraan</th>
              <th class="cell-sticky" style="top: 1px">Plat Nomor</th>
              <th class="cell-sticky" style="top: 1px">Nama</th>
              <th class="cell-sticky" style="top: 1px">Tujuan</th>
              <th class="cell-sticky" style="top: 1px">Nomor Kartu</th>
              <th class="cell-sticky" style="top: 1px">Note</th>
              <th class="cell-sticky" style="top: 1px">Alamat</th>
            </tr>
          </thead>
          <tbody>
            
            <tr v-for="(row, index) in data" :key="index">
              <td>{{ row.number }}</td>
              <td class="text-left">{{ row.date }}</td>
              <td>
                <span class="text-primary cursor-pointer" @click="toggleModalPreview(row)" v-b-tooltip.bottom title="Klik untuk melihat foto">
                  {{ row.identity_type }}
                </span>
              </td>
              <td class="text-left">{{ row.vehicle_type }}</td>
              <td class="text-left">{{ row.license_plate }}</td>
              <td class="text-left">{{ row.name }}</td>
              <td class="text-left">{{ row.purpose }}</td>
              <td class="text-left">{{ row.card_number }}</td>
              <td class="text-left">{{ row.notes }}</td>
              <td class="text-left">{{ row.address }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
