<template>
  <div>
    <print-screen-problem-ticket-report/>
  </div>
</template>

<script>
export default {
  components: {
    PrintScreenProblemTicketReport: () => import("@/components/organisms/report/problem-ticket/PrintScreenProblemTicketReport")
  }
}
</script>