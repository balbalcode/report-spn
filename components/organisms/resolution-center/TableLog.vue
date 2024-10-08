<script>
import resolution_center_constants from "~/constants/resolution-center"

export default {
  components: {
    SquareCard: () => import("@utilities/atoms/card/SquareCard"),
    ContentTableView: () => import("@utilities/molecules/content-view/ContentTableView"),
    OverviewLabel: () => import("@utilities/atoms/label/OverviewLabel"),
    PlainLabel: () => import("@utilities/atoms/label/PlainLabel")
  },
  props: {
    id: {default: ""},
    log_name: {default: ""},
    get_logs: {type: Function, required: true}
  },
  data: () => ({
    logs: [],
    helper: {
      is_loading: false,
      is_error: false,
    },
    log_status: resolution_center_constants.log_status
  }),
  async mounted() {
    await this.processGetData()
  },
  watch: {
    id: {
      async handler () {
        await this.processGetData()
      }
    }
  },
  methods: {
    passErrorToParent(error) {
      this.$emit("error", error)
    },

    setPayloadGet() {
      return {
        id: this.id
      }
    },

    async processGetData() {
      this.helper.is_loading = true
      try {
        let payload = this.setPayloadGet()
        this.logs = await this.get_logs(payload)
      } catch (error) {
        this.logs = []
        this.helper.is_error = true
        this.passErrorToParent(error)
      }
      this.helper.is_loading = false
    },
  }

}
</script>
<template>
  <div class="row">
    <square-card :has_shadow="false" :has_border="false" additional_class="pt-0">
      <h5 class="font-weight-bolder" :id="`${log_name}__header`">Log {{log_name}}</h5>
      <p class="mb-2" :id="`${log_name}__id`">ID {{log_name}}: {{id}}</p>
      <content-table-view :length="logs.length" :is_loading="helper.is_loading" :is_error="helper.is_error">
        <div class="table-responsive rounded-top table-freeze mb-0">
          <table class="table table-striped table-borderless mb-0 custom-tbl" :id="`table-log__${log_name}`">
            <thead class="thead-freeze bg-gray-70">
              <tr class="border-bottom-table">
                <th class="text-center text-dark">Log</th>
                <th class="text-center text-dark">Tanggal Dibuat</th>
                <th class="text-center text-dark">Tipe</th>
                <th class="text-center text-dark">Message</th>
                <th class="text-center text-dark">Petugas</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(log, index) in logs" :key="index">
                <td class="text-center">
                  <overview-label :ref="`${log_name}__row__${index}__id`" :value="log.id" limit_text="8"
                    :is_italic="false"/>
                </td>
                <td class="text-center" :id="`${log_name}__row__${index}__timestamp`">
                  {{ $utility.formatLocalTimezone(log.timestamp, 'DD/MM/YYYY HH:mm:ss') }}
                </td>
                <td class="text-center" :id="`${log_name}__row__${index}__type`">
                  {{ log_status(log.type) }}
                </td>
                <td class="text-left">
                  <overview-label :ref="`${log_name}__row__${index}__message`" :value="log.message" limit_text="45"
                    :has_space="false" :is_italic="false"/>
                </td>
                <td class="text-center">
                  <plain-label :value="log.officer_detail ? log.officer_detail.name : '-'"
                    :ref="`${log_name}__row__${index}__officer`"/>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </content-table-view>
    </square-card>
  </div>
</template>
