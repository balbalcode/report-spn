<template>
  <div>
    <print-screen-visitor-report/>
  </div>
</template>

<script>
export default {
  components: {PrintScreenVisitorReport: () => import("@/components/organisms/report/visitor/PrintScreenVisitorReport")}
}
</script>
