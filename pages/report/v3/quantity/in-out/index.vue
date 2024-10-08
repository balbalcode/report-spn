<script>
export default {
  head: () => ({
    title: `Laporan Kuantitas - Keluar Masuk | ${process.env.APP_TITLE}`
  }),
  components: {
    ReportInOut: () => import("@/components/templates/report/v3/ReportInOut")
  },
}
</script>
<template>
  <report-in-out report_key="quantity" report_title="Laporan Kuantitas" />
</template>
