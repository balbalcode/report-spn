<script>
export default {
  props: {
    size: {type: String, default: 'md'},
    is_showed: {type: Boolean, required: true}
  },
  components: {
    ContentSpan: () => import("@utilities/atoms/utility/ContentSpan"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
  },
  methods: {
    passReloadToParent() {
      this.$emit("reload");
    },
  },
};
</script>

<template>
  <div class="wrapper h-100" :class="{'p-2':is_showed}">
    <slot />
    <div v-if="is_showed" class="text-center rounded content-reload text-light w-100 h-100 d-flex align-items-center justify-content-center">
      <div>
        <content-span v-if="size!=='sm'" :size="size" :has_animation="false" caption="" />
        <h4 class="font-weight-bold">Gagal memuat data</h4>
        <p class="font-size-12">Silakan muat ulang</p>
        <active-button
          variant="primary"
          additional_class="border"
          text="Muat Ulang"
          size="sm"
          text_color="text-light"
          @click="passReloadToParent"
          id="btn-reload"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  position: relative;
}
.content-reload {
  z-index: 3;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  top: 0px;
  left: 0px;
}
</style>