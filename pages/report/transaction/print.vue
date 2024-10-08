<template>
  <div>
    <print-screen-transaction-report/>
  </div>
</template>

<script>
export default {
  components: {PrintScreenTransactionReport: () => import("@/components/organisms/report/transaction/PrintScreenTransactionReport")}
}
</script>
