<template>
  <div class="text-center">
    <content-span size="lg" :has_animation="false" caption=""/>
    <h4 class="font-weight-bold mt-n4">Oops.. Halaman ini sedang dalam pengembangan</h4>
    <p class="font-size-12">
      Kami mungkin sedang mengembangkan lebih lanjut halaman ini, nantikan halaman ini pada pekan berikutnya
    </p>
  </div>
</template>

<script>
export default {
  name: "ContentMaintenance",
  components: {ContentSpan: () => import("@utilities/atoms/utility/ContentSpan")}
}
</script>