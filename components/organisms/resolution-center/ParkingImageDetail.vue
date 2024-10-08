<template>
  <div>
    <div class="row">
      <template v-for="gate in gates">
        <div class="col-12 col-lg-6" v-for="(url, index) in data[gate.value]" :key="`photo-${gate.value}-${index}`">
          <h6 class="font-weight-bold text-center">{{ gate.text }} Kamera {{ index + 1 }}</h6>
          <div class="row mx-0 mb-2 bg-gray-80" style="height: 200px;">
            <content-image :value="url" additional_class="h-100 object-contain align-middle mx-auto"/>
          </div>
          <active-button @click="toggleModalPreview(url)" size="sm" additional_class="w-100 mb-3" text="Lihat ukuran penuh"/>
        </div>
      </template>
    </div>
    <plain-modal size="lg" v-model="modal.modal_image">
      <div class="row mx-0 bg-gray-90">
        <content-image :value="selected_url" :is_responsive="true" additional_class="object-contain align-middle mx-auto"/>
      </div>
      <active-button @click="toggleModalPreview" text="Tutup" additional_class="w-100 mt-3" type="outline" variant="grey"/>
    </plain-modal>
  </div>
</template>

<script>
import resolution_constants from "@/constants/resolution-center"
export default {
  components: {
    ContentImage: () => import("@utilities/atoms/image/ContentImage"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
    PlainModal: () => import("@utilities/atoms/modal/PlainModal"),
  },
  props: {
    data: { default() {
      return {
        image_url: [],
        image_out_url: [],
      }
    }}
  },
  data: () => ({
    modal: {
      modal_image: false
    },
    gates: resolution_constants.image_parts(),
    selected_url: "",
  }),
  methods: {
    toggleModalPreview(url) {
      if (url) this.selected_url = url
      else this.selected_url = ""
      this.modal.modal_image = !this.modal.modal_image
    },
  }
}
</script>

<style>
.object-contain {
  object-fit: contain;
}
</style>