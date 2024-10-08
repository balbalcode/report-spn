<template>
  <div>
    <print-screen-membership-card />
  </div>
</template>

<script>
export default {
  components: {PrintScreenMembershipCard: () => import("@/components/organisms/report/membership/card/PrintScreenMembershipCard")}
}
</script>