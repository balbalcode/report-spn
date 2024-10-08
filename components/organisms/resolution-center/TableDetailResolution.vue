<script>
import resolution_center_constants from "~/constants/resolution-center"
export default {
  components: {
    PlainLabel: () => import("@utilities/atoms/label/PlainLabel"),
    OverviewLabel: () => import("@utilities/atoms/label/OverviewLabel"),
    ParkingImageDetail: () => import("@/components/organisms/resolution-center/ParkingImageDetail")
  },
  props: {
    data: {default: ""},
  },
  data: () => ({
    transaction_status: resolution_center_constants.transaction_status
  }),
  computed: {
    image_list() {
      let image_list = {
        image_url: [""],
        image_out_url: [""]
      }
      if (this.data.image_list) {
        if (this.data.image_list.image_url && this.data.image_list.image_url.length)
          image_list.image_url = this.data.image_list.image_url
        if (this.data.image_list.image_out_url && this.data.image_list.image_out_url.length)
          image_list.image_out_url = this.data.image_list.image_out_url
      }
      return image_list
    }
  },
}
</script>
<template>
  <div>
    <div class="row">
      <div class="col-12">
        <h4 class="font-weight-bolder">Detail Transaksi</h4>
        <label class="mr-3">ID Transaksi : <strong>{{ data.id }}</strong></label>
        <label class="mr-3">
          Lokasi: <strong>{{ data.spot_detail.name }}</strong>
        </label>
        <label class="mr-3">
          <span v-if="data.ref_id && data.ref_type === 'FINDER'">
            Plat Nomor: <strong>{{ data.ref_detail.values.motorcycle_detail.license_plate }}</strong>
          </span>
          <span v-else v-b-tooltip
              title="Hal ini terjadi mungkin karna petugas/sistem belum memasukkan plat nomor kendaraan"
              class="mx-auto text-center font-weight-bold">Plat belum tersedia! <i class="bx bx-error-circle"></i></span>
        </label>
        <label v-if="data.emoney_card_id">
          E-Card: <strong>{{ data.emoney_card_id }}</strong>
        </label>
      </div>
    </div>
    <hr class="mt-0">
    <parking-image-detail :data="image_list" />
    <div class="row mt-3">
      <div class="col-12">
        <h5 class="font-weight-bolder">Detail Resolution</h5>
        <div class="table-responsive rounded-top table-freeze mb-0">
          <table class="table table-striped table-borderless mb-0 custom-tbl">
            <thead class="thead-freeze bg-gray-70">
              <tr>
                <th class="text-center">Transaksi</th>
                <th v-if="data.ref_id && data.ref_type === 'FINDER'" class="text-center">Finder</th>
                <th class="text-center">Status</th>
                <th class="text-center">Waktu Masuk Transaksi</th>
                <th v-if="data.ref_id && data.ref_type === 'FINDER'" class="text-center">Waktu Masuk Finder</th>
                <th class="text-center">Waktu Keluar Transaksi</th>
                <th v-if="data.ref_id && data.ref_type === 'FINDER'" class="text-center">Waktu Keluar Finder</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center">
                  <overview-label :has_space="false" :value="data.id" limit_text="6" :is_italic="false"/>
                </td>
                <td v-if="data.ref_id && data.ref_type === 'FINDER'" class="text-center">
                  <overview-label :has_space="false" :value="data.ref_id" limit_text="6" :is_italic="false"/>
                </td>
                <td class="text-center">
                  <plain-label :value="transaction_status(data.status)"/>
                </td>
                <td class="text-center">
                  <plain-label :value="$utility.formatLocalTimezone(data.time_in, 'DD/MM/YYYY HH:mm:ss')"/>
                </td>
                <td v-if="data.ref_id && data.ref_type === 'FINDER'" class="text-center">
                  <plain-label :value="data.ref_detail.values.time_in ? $utility.formatLocalTimezone(data.ref_detail.values.time_in, 'DD/MM/YYYY HH:mm:ss') : '-'"/>
                </td>
                <td class="text-center">
                  <plain-label :value="data.time_out ? $utility.formatLocalTimezone(data.time_out, 'DD/MM/YYYY HH:mm:ss') : '-'"/>
                </td>
                <td v-if="data.ref_id && data.ref_type === 'FINDER'" class="text-center">
                  <plain-label :value="data.ref_detail.values.time_out ? $utility.formatLocalTimezone(data.ref_detail.values.time_out, 'DD/MM/YYYY HH:mm:ss') : '-'"/>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div 
      class="row my-3" 
      v-if="data.prediction.lpr_in.license_plate && data.prediction.lpr_out.license_plate" 
      data-testid="wrapper--detail_lpr"
    >
      <div class="col-12">
        <h5 class="font-weight-bolder">Detail LPR</h5>
        <div class="table-responsive rounded-top table-freeze mb-0">
          <table class="table table-striped table-borderless mb-0 custom-tbl">
            <thead class="thead-freeze bg-gray-70">
              <tr>
                <th class="text-center">Jenis</th>
                <th class="text-center">Plat</th>
                <th class="text-center">Akurasi</th>
                <th class="text-center">Proses Time</th>
                <th class="text-center">Response Time</th>
                <th class="text-center">Kendaraan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center">Masuk</td>
                <td class="text-center">{{ data.prediction.lpr_in.license_plate }}</td>
                <td class="text-center">{{ data.prediction.lpr_in.accuracy }}%</td>
                <td class="text-center">{{ data.prediction.lpr_in.processed_time }}</td>
                <td class="text-center">{{ data.prediction.lpr_in.response_time }}</td>
                <td class="text-center">{{ data.prediction.lpr_in.vehicle }}</td>
              </tr>
              <tr>
                <td class="text-center">Keluar</td>
                <td class="text-center">{{ data.prediction.lpr_out.license_plate }}</td>
                <td class="text-center">{{ data.prediction.lpr_out.accuracy }}%</td>
                <td class="text-center">{{ data.prediction.lpr_out.processed_time }}</td>
                <td class="text-center">{{ data.prediction.lpr_out.response_time }}</td>
                <td class="text-center">{{ data.prediction.lpr_out.vehicle }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>