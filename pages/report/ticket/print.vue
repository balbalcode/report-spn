<template>
  <div>
    <print-screen-lost-ticket-report/>
  </div>
</template>

<script>
export default {
  components: {
    PrintScreenLostTicketReport: () => import("@/components/organisms/report/ticket/PrintScreenLostTicketReport")
  }
}
</script>