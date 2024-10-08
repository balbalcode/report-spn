<template>
  <div>
    <content-table-view
      :length="data.length"
      :is_loading="helper.is_loading"
      :is_error="helper.is_error"
      :is_init="helper.is_init"
      :test_id="`${id}__wrapper`"
      :ref="`${id}__wrapper`"
      @reload="processGetData"
    >
      <div class="table-responsive rounded-top mb-0">
        <table
          class="d-block table table-striped table-sticky-header report-table"
          :id="id"
          :data-testid="id"
        >
          <thead class="thead-freeze bg-primary">
            <tr class="border-bottom-table">
              <th
                class="text-left text-dark cell-sticky"
                style="top: 1px"
                width="30%"
                :data-testid="`${id}__tr-head__td-shift`"
              >
                Shift
              </th>
              <th
                class="text-left text-dark cell-sticky"
                style="top: 1px"
                width="30%"
                :data-testid="`${id}__tr-head__td-officer`"
              >
                Petugas
              </th>
              <th
                class="text-right text-dark cell-sticky"
                style="top: 1px"
                width="50%"
                :data-testid="`${id}__tr-head__td-paid-casual`"
              >
                Kasual
              </th>
              <th
                class="text-right text-dark cell-sticky"
                style="top: 1px"
                width="50%"
                :data-testid="`${id}__tr-head__td-paid-lost-ticket`"
              >
                Tiket Hilang
              </th>
              <th
                class="text-right text-dark cell-sticky"
                style="top: 1px"
                width="50%"
                :data-testid="`${id}__tr-head__td-paid-total`"
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in data" :key="index">
              <td
                class="text-left"
                :data-testid="`${id}__tr-${index}__td-shift`"
              >
                {{ row.shift }}
              </td>
              <td
                class="text-left"
                :data-testid="`${id}__tr-${index}__td-officer`"
              >
                {{ row.officer }}
              </td>
              <td
                class="text-right"
                :data-testid="`${id}__tr-${index}__td-casual`"
              >
                {{ row.casual }}
              </td>
              <td
                class="text-right"
                :data-testid="`${id}__tr-${index}__td-lost-ticket`"
              >
                {{ row.lost_ticket }}
              </td>
              <td
                class="text-right"
                :data-testid="`${id}__tr-${index}__td-total`"
              >
                {{ row.total }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="bg-gray-70">
              <th class="text-left" :data-testid="`${id}__tr-foot__th-total`">
                Total
              </th>
              <th></th>
              <th class="text-right" :data-testid="`${id}__tr-foot__th-casual`">
                {{ total.casual }}
              </th>
              <th
                class="text-right"
                :data-testid="`${id}__tr-foot__th-lost-ticket`"
              >
                {{ total.lost_ticket }}
              </th>
              <th class="text-right" :data-testid="`${id}__tr-foot__th-total`">
                {{ total.total }}
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </content-table-view>

    <!-- Pagination -->
    <div class="row">
      <div class="col-12 text-right">
        <card-pagination-view
          :per_page="pagination.per_page"
          :total_data="pagination.total_data"
          :ref="`${id}__pagination`"
          :test_id="`${id}__pagination`"
          additional_class="mt-3 "
          :current_page="pagination.current_page"
          @update="passUpdatePagination"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    ContentTableView: () =>
      import("@utilities/molecules/content-view/ContentTableView"),
    CardPaginationView: () =>
      import("@utilities/molecules/card-view/CardPaginationView"),
  },
  props: {
    id: { default: "" },
    is_searching: { default: false },
    month: { default: "" },
    timezone: { default: "" },
    officer: { default: () => [] },
    get_report: { type: Function, required: true },
  },
  data: () => ({
    data: [],
    total: {},
    pagination: {
      current_page: 1,
      per_page: 25,
      total_data: 0,
    },
    version: "v4",
    helper: {
      is_init: false,
      is_loading: false,
      is_error: false,
    },
  }),
  watch: {
    is_searching: function (value) {
      if (value) {
        this.helper.is_init = false;
        this.passUpdatePagination(1);
      }
    },
  },
  async mounted() {
    this.helper.is_init = true;
    this.setVersion();
  },
  methods: {
    async passUpdatePagination(page) {
      this.pagination.current_page = page;
      await this.processGetData();
    },

    passFormatDownloadReport() {
      const total_page = Math.ceil(
        parseInt(this.pagination.total_data) /
          parseInt(this.pagination.per_page)
      );
      this.$emit("ready", {
        content: [...this.data, this.total],
        page: this.pagination.current_page,
        total_page,
      });
    },

    getPayloadGet() {
      const payload = {
        filter: [
          { key: "page", value: this.pagination.current_page },
          { key: "per_page", value: this.pagination.per_page },
          { key: "month", value: this.month },
          { key: "spot_id", value: this.$utility.getSpotId() },
        ],
        version: this.version,
      };

      if (this.officer && this.officer.length) {
        payload.filter.push({
          key: "officer_id",
          value: this.$utility.encodeReportFilterUrl(this.officer, "id"),
        });
      }

      if (this.timezone) {
        payload.filter.push({ key: "timezone", value: this.timezone });
      }

      return payload;
    },

    setVersion() {
      if (this.$route.query.version) {
        this.version = this.$route.query.version;
      }
    },

    processSortData() {
      this.data = this.data.sort((a, b) => {
        // splitting data to 3 part. e.g 2024-04-06 - Shift 4 (15:00 - 23:00) "will be 2024-04-06", "Shift 4 (15:00", "23:00)"
        const datePrev = a.shift.split(" - ");
        const dateNext = b.shift.split(" - ");
        const dateA = datePrev[0];
        const dateB = dateNext[0];

        const shiftNumberA = parseInt(datePrev[1].match(/\d+/));
        const shiftNumberB = parseInt(dateNext[1].match(/\d+/));

        if (dateA !== dateB) {
          return dateA.localeCompare(dateB); // comparing string not in date format, its
        } else {
          // comparing shift if the date are same
          return shiftNumberA - shiftNumberB;
        }
      });
    },

    formatData(rows, total) {
      try {
        this.data = rows.map((row) => ({
          shift: row.shift,
          officer: row.officer,
          casual: this.$utility.convertToRupiah(row.casual),
          lost_ticket: this.$utility.convertToRupiah(row.lost_ticket),
          total: this.$utility.convertToRupiah(row.total),
        }));

        this.processSortData();

        this.total.shift = "Total";
        this.total.casual = this.$utility.convertToRupiah(total.casual);
        this.total.lost_ticket = this.$utility.convertToRupiah(
          total.lost_ticket
        );
        this.total.total = this.$utility.convertToRupiah(total.total);
      } catch (error) {
        this.data = [];
        this.total = {};
        this.$utility.setErrorContextSentry(error);
        this.$sentry.captureMessage(
          `${error.message} at formatData in TableReportByOfficer`
        );
      }
    },

    async processGetData() {
      this.helper.is_loading = true;
      this.helper.is_error = false;
      try {
        this.data = [];
        this.total = {};
        let payload = this.getPayloadGet();
        const response = await this.get_report(payload);
        this.pagination.total_data = response.total_values;
        this.formatData(response.values.rows, response.values.total);
      } catch (error) {
        this.pagination.total_data = 0;
        this.helper.is_error = true;
      }
      this.passFormatDownloadReport();
      this.helper.is_loading = false;
    },
  },
};
</script>
