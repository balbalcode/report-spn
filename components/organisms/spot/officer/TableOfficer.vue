<script>
import { officerMethods } from "~/store/helperActions";
import officer_constant from "~/constants/officer"

export default {
  components: {
    DropdownButton: () => import("@utilities/atoms/button/DropdownButton"),
    ContentTableView: () => import("@utilities/molecules/content-view/ContentTableView"),
    PriceLabel: () => import("@utilities/atoms/label/PriceLabel"),
    PlainLabel: () => import("@utilities/atoms/label/PlainLabel"),
    ActiveButton: () => import("@utilities/atoms/button/ActiveButton"),
    ModalConfirmation: () => import("@utilities/molecules/modal-view/ModalConfirmationView"),
    CardPaginationView: () => import("@utilities/molecules/card-view/CardPaginationView"),
    LabelStatusGroup: () => import("@utilities/molecules/label-group/LabelStatusGroup"),
  },
  props: {
    is_searching: { default: false },
    filter: { default: () => ({}) }
  },
  data: () => ({
    id: "table-officer",
    data: [],
    selected_data: {},
    options: {
      type: officer_constant.type()
    },
    pagination: {
      per_page: "10",
      current_page: "1",
      total_data: "10"
    },
    modal: {
      modal_delete: false,
      modal_kick: false
    },
    helper: {
      is_loading: false,
      is_error: false
    }
  }),
  watch: {
    is_searching(value) {
      if (value) this.passUpdatePagination(1)
    }
  },
  async mounted() {
    await this.processGetData()
  },
  methods: {
    ...officerMethods,

    passErrorToParent(error) {
      this.$emit("error", { state: true, message: error })
    },

    passEditToParent(data) {
      this.$emit("edit", data)
    },

    passReadyToParent() {
      this.$emit("ready")
    },

    async passUpdatePagination(page) {
      this.pagination.current_page = page
      await this.processGetData()
    },

    setPayloadGet() {
      const payload = {
        filter: [
          { key: "spot_id", value: this.$utility.getSpotId() }
        ],
        pagination: {
          current_page: this.pagination.current_page,
          per_page: this.pagination.per_page
        },
      }
      if (this.filter.name)
        payload.filter.push({ key: "name", value: this.filter.name })
      if (this.filter.role && this.filter.role.value)
        payload.filter.push({ key: "role", value: this.filter.role.value })
      return payload
    },

    setPayloadKick() {
      return {
        spot_id: this.$utility.getSpotId(),
        officer_id: this.selected_data.id,
        opener: this.$route.path
      }
    },

    setPayloadDelete() {
      return {
        id: this.selected_data.id,
        opener: this.$route.path
      }
    },

    formatTypeLabelOfficer(spots) {
      const spot_id = this.$utility.getSpotId()
      const spot = this.$utility.findConstantData("spot_id", spots, spot_id)
      let type_officer = ""
      if (spot && spot.role && spot.role.length) {
        type_officer = spot.role.map(role => `${officer_constant.type_map(role)}`).join(", ")
      }
      return type_officer
    },

    toggleModalDelete() {
      this.modal.modal_delete = !this.modal.modal_delete
    },

    toggleModalKick() {
      this.modal.modal_kick = !this.modal.modal_kick
    },

    processConfirmDelete(data) {
      this.toggleModalDelete()
      if (data) {
        this.selected_data = data
      } else {
        this.selected_data = {}
      }
    },

    processConfirmKick(data) {
      this.toggleModalKick()
      if (data) {
        this.selected_data = data
      } else {
        this.selected_data = {}
      }
    },

    processCancelDelete() {
      this.selected_data = {}
      this.modal.modal_delete = false
    },

    processCancelKick() {
      this.selected_data = {}
      this.modal.modal_kick = false
    },

    async processGetData() {
      this.helper.is_loading = true
      try {
        let payload = await this.setPayloadGet()
        let data = await this.getOfficer(payload)
        this.data = data.values
        this.pagination.total_data = data.total_values
        this.passReadyToParent()
      } catch (error) {
        this.passErrorToParent(error)
        this.helper.is_error = true
      }
      this.helper.is_loading = false
    },

    async processDeleteData() {
      try {
        let payload = this.setPayloadDelete()
        await this.deleteOfficer(payload)
        await this.processGetData()
        this.toggleModalDelete()
      } catch (error) {
        this.helper.is_error = true
        this.passErrorToParent(error)
      }
    },

    async processKickOfficer() {
      try {
        let payload = this.setPayloadKick()
        await this.kickOfficer(payload)
        await this.processGetData()
        this.toggleModalKick()
      } catch (error) {
        this.helper.is_error = true
        this.passErrorToParent(error)
      }
    }
  },

}
</script>
<template>
  <div>
    <content-table-view :length="data.length" :is_loading="helper.is_loading" :is_error="helper.is_error"
      :id="`wrapper__${id}`" :data-testid="`wrapper__${id}`">
      <div class="table-responsive rounded-top table-freeze mb-0">
        <table class="table table-striped table-borderless mb-0 custom-tbl" :id="id" :data-testid="id">
          <thead class="thead-freeze bg-gray-70">
            <tr class="border-bottom-table">
              <th class="text-dark text-left">Username</th>
              <th class="text-dark text-left">Identitas</th>
              <th class="text-dark text-left">Tipe</th>
              <th class="text-dark text-center">Status</th>
              <th class="text-dark text-center">Opsi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(officer, index) in data" :key="index"
              :class="{ 'selected-row': officer.id === selected_data.id }">
              <td class="align-middle"> {{ officer.username }}</td>
              <td class="align-middle">
                <plain-label additional_class="mb-0" :value="officer.name" :is_bold="true" />
                <br>
                <i class="bx bxs-phone text-primary"></i>
                <plain-label :value="['', '0'].includes(officer.phone) ? 'Nomor belum dimasukkan' : officer.phone" />
              </td>
              <td>
                <plain-label :value="formatTypeLabelOfficer(officer.spots)" />
              </td>
              <td class="text-center">
                <label-status-group :default_format_status="officer.activation" :is_default_format="true" />
              </td>
              <td class="text-center">
                <dropdown-button text="" size="sm" variant="gray" type="outline" additional_class="p-0"
                  caret="font-size-20 bx bx-dots-vertical-rounded" :has_custom_action="true"
                  :ref="`${id}__tr-${index}__btn-option`" :test_id="`${id}__tr-${index}__btn-option`">
                  <active-button icon="bx bxs-pencil" icon_size="16" icon_color="text-primary" text="Edit petugas"
                    additional_class="border-0 w-100 text-left  p-2 bg-transparent" :id="`btn-edit_officer_${index}`"
                    align="rtl" @click="passEditToParent(officer)" :ref="`${id}__tr-${index}__btn-edit`"
                    :test_id="`${id}__tr-${index}__btn-edit`" />
                </dropdown-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </content-table-view>
    <b-row>
      <b-col cols="12" lg="12" class="text-right">
        <card-pagination-view :per_page="pagination.per_page" :total_data="pagination.total_data" additional_class="mt-3 "
          :current_page="pagination.current_page" @update="passUpdatePagination" :test_id="`${id}__pagination`"
          :ref="`${id}__pagination`" />
      </b-col>
    </b-row>
    <modal-confirmation v-model="modal.modal_delete" submit_button_text="Submit" :test_id="`${id}__modal-delete`"
      :ref="`${id}__modal-delete`" :text="`Apakah anda yakin untuk menghapus data petugas ${selected_data.username} ?`"
      @cancel="processCancelDelete" @submit="processDeleteData" />
    <modal-confirmation v-model="modal.modal_kick" submit_button_text="Submit"
      :text="`Apakah anda yakin untuk menghapus petugas ${selected_data.username} dari lokasi ini ?`"
      :test_id="`${id}__modal-kick`" :ref="`${id}__modal-kick`" @cancel="processCancelKick"
      @submit="processKickOfficer" />
  </div>
</template>
