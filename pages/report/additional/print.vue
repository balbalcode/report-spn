<template>
  <div>
    <print-screen-service-quantity-report/>
  </div>
</template>

<script>
export default {
  components: {PrintScreenServiceQuantityReport: () => import("@/components/organisms/report/additional/PrintScreenServiceQuantityReport")}
}
</script>