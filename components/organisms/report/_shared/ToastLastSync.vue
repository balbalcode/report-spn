<template>
  <b-toast no-auto-hide :visible="!!last_sync" :id="id" :ref="id" toaster="b-toaster-bottom-right"
    body-class="toast-last-sync" header-class="d-none" variant="primary" :data-testid="test_id ? test_id : id">
    <template slot="default">
      <div class="d-flex flex-row">
        <div class="text-dark">
            <span class="rounded-circle bg-primary font-weight-bold" style="padding: .2em .7em">
              !
            </span>
        </div>
        <div class="align-self-lg-center align-middle text-white flex-grow-1 ml-1 font-size-12"
          :id="`${id}__info-text`">
          Terakhir diperbarui {{ $utility.formatLocalTimezone(last_sync, 'DD/MM/YYYY HH:mm:ss') }}
        </div>
        <div class="align-self-lg-center align-middle text-white float-right">
          <i class="bx bx-x cursor-pointer" @click="$bvToast.hide(id)"
            :id="`${id}__btn-close`"></i>
        </div>
      </div>
    </template>
  </b-toast>
</template>

<script>
export default {
  props: {
    last_sync: { default: "" },
    id: { default: "" },
    test_id: { default: "" }
  }
}
</script>