<template>
  <div>
    <print-screen-counter-report/>
  </div>
</template>

<script>
export default {
  components: {PrintScreenCounterReport: () => import("@/components/organisms/report/counter/PrintScreenCounterReport")}
}
</script>
