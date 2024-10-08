<script>
export default {
  head: () => ({
    title: `Laporan Pendapatan - Per Petugas | ${process.env.APP_TITLE}`,
  }),
  components: {
    ReportByOfficer: () =>
      import("@/components/templates/report/v3/ReportByOfficer"),
  },
};
</script>
<template>
  <report-by-officer
    id="report-income__by-officer"
    report_key="income"
    report_title="Laporan Pendapatan"
  />
</template>
