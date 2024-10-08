<template>
  <div>
    <print-screen-report-overstay/>
  </div>
</template>

<script>
export default {
  components: {PrintScreenReportOverstay: () => import("@/components/organisms/report/overstay/PrintScreenReportOverstay")}
}
</script>