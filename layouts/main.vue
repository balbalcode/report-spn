<script>
export default {
  components: {},
  props: {
    title: { default: "" },
  },
};
</script>

<template>
  <div id="layout-wrapper">
    <slot />
  </div>
</template>
