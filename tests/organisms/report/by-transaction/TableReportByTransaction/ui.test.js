import { createLocalVue, shallowMount } from "@vue/test-utils";

import utility from "@/plugins/utilities"
import TableReportByTransaction from "@/components/organisms/report/by-transaction/TableReportByTransaction";
import { transaction_types } from "@/constants/v3.report"
import {
  dataReal, dateRange, formattedContent, formattedHeader, getReportData, payloadGetWithType,
  payloadGetWithoutType, type, spotId, vehicles, payloadGetWithVersion, month, formattedTotal, calculatedTotal, dataReal1, dataDummy,
} from "./mock";
import { BSpinner, BToast } from "bootstrap-vue";

const id = "table-report-by-transaction"
let wrapper;
const localVue = createLocalVue();
localVue.component("b-toast", BToast);
localVue.component("b-spinner", BSpinner);

const mocks = {
  $utility: {
    getFormattedVehicle: () => [],
    getSpotId: () => "",
    formatListParameterPayload: () => "",
    formatDateMoment: () => "",
    setErrorContextSentry() { },
    fireToast() { },
    convertToRupiah: () => "",
    formatLocalTimezone: () => "",
    getAssetUrl: () => "",
  },
  $sentry: {
    captureMessage() { },
  },
  $route: {},
};
let mocksFn = {};

describe("ui.TableReportByTransaction.vue", () => {
  beforeEach(() => {
    mocksFn = {};
    mocksFn['get_report'] = jest.fn()
    mocksFn["setBatchReport"] = jest.spyOn(TableReportByTransaction.methods, "setBatchReport").mockImplementation();
    mocks.$utility.getFormattedVehicle = mocksFn["$utility.getFormattedVehicle"] = jest.fn().mockReturnValueOnce(vehicles);
    wrapper = shallowMount(TableReportByTransaction, { mocks, localVue, propsData: { get_report: mocksFn['get_report'] } });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('test row dummy', () => {
    it.each([
      {
        case: "given row dummy, batchReport.isLoadingBatch true, batchReport.isWorkingBatch true, row-reload should exist and row-failed shouldn't exist",
        rowReloadExists: true, rowFailedExists: false,
        fnMocked: { 'batchReport.isLoadingBatch': { returnValue: true }, 'batchReport.isWorkingBatch': { returnValue: true } }
      }, {
        case: "given row dummy, batchReport.isLoadingBatch true, batchReport.isWorkingBatch false, row-reload shouldn't exist and row-failed should exist",
        rowReloadExists: false, rowFailedExists: true,
        fnMocked: { 'batchReport.isLoadingBatch': { returnValue: true }, 'batchReport.isWorkingBatch': { returnValue: false } }
      }, {
        case: "given row dummy and batchReport.isLoadingBatch false, row-reload shouldn't exist and row-failed should exist",
        rowReloadExists: false, rowFailedExists: true,
        fnMocked: { 'batchReport.isLoadingBatch': { returnValue: false }, 'batchReport.isWorkingBatch': { returnValue: true } }
      }
    ])('$case', async ({ fnMocked, rowReloadExists, rowFailedExists }) => {
      wrapper.vm.batchReport.isLoadingBatch = mocksFn['batchReport.isLoadingBatch'] =
        jest.fn().mockReturnValue(fnMocked['batchReport.isLoadingBatch'].returnValue)
      wrapper.vm.batchReport.isWorkingBatch = mocksFn['batchReport.isWorkingBatch'] =
        jest.fn().mockReturnValue(fnMocked['batchReport.isWorkingBatch'].returnValue)
      wrapper.vm.helper.is_init = false
      wrapper.vm.data.rows = [...dataDummy.rows]
      await wrapper.vm.$nextTick()

      const rowReload = wrapper.find(`table[data-testid='${id}'] [data-testid='row-0__reload']`)
      expect(rowReload.exists()).toBe(rowReloadExists)
      const rowFailed = wrapper.find(`table[data-testid='${id}'] [data-testid='row-0__failed']`)
      expect(rowFailed.exists()).toBe(rowFailedExists)
    })
  })

  it("given real data, should show data on table", async () => {
    wrapper.vm.$utility.convertToRupiah = utility.convertToRupiah
    wrapper.vm.$utility.formatDateMoment = utility.formatDateMoment

    wrapper.setProps({ vehicle: vehicles, column: transaction_types("income"), transaction_types: transaction_types("income") })
    await wrapper.vm.$nextTick()
    wrapper.vm.helper.is_init = false
    await wrapper.vm.$nextTick()
    wrapper.vm.data.rows = [...dataReal.rows]
    await wrapper.vm.$nextTick()

    const rows = wrapper.findAll(`table[data-testid='${id}'] tbody tr`)
    expect(rows.length).toBe(dataReal.rows.length)

    for (let indexRow = 0; indexRow < rows.length; indexRow++) {
      const data = rows.at(indexRow).findAll("td")

      expect(data.at(0).text()).toContain(dataReal.rows[indexRow].date)
      expect(data.at(1).text()).toContain(dataReal.rows[indexRow].days)

      const transactionStart = 2
      expect(data.at(transactionStart).text()).toContain(`${dataReal.rows[indexRow].casual.MT1}`)
      expect(data.at(transactionStart + 1).text()).toContain(`${dataReal.rows[indexRow].casual.MB1}`)
      expect(data.at(transactionStart + 2).text()).toContain(`${dataReal.rows[indexRow].cashier_product.MT1}`)
      expect(data.at(transactionStart + 3).text()).toContain(`${dataReal.rows[indexRow].cashier_product.MB1}`)
      expect(data.at(transactionStart + 4).text()).toContain(`${dataReal.rows[indexRow].lost_ticket.MT1}`)
      expect(data.at(transactionStart + 5).text()).toContain(`${dataReal.rows[indexRow].lost_ticket.MB1}`)
      expect(data.at(transactionStart + 6).text()).toContain(`${dataReal.rows[indexRow].administration.MT1}`)
      expect(data.at(transactionStart + 7).text()).toContain(`${dataReal.rows[indexRow].administration.MB1}`)

      const totalStart = 10
      expect(data.at(totalStart).text()).toContain(`${dataReal.rows[indexRow].total.casual}`)
      expect(data.at(totalStart + 1).text()).toContain(`${dataReal.rows[indexRow].total.cashier_product}`)
      expect(data.at(totalStart + 2).text()).toContain(`${dataReal.rows[indexRow].total.lost_ticket}`)
      expect(data.at(totalStart + 3).text()).toContain(`${dataReal.rows[indexRow].total.administration}`)

      expect(data.at(14).text()).toContain(`${dataReal.rows[indexRow].grand_total}`)
    }
  })

  describe("test row total", () => {
    it.each([
      { case: "given empty total, shouldn't exist", data: dataDummy, exists: false },
      { case: "given filled total, should exist", data: dataReal, exists: true }
    ])('$case', async ({ data, exists }) => {
      wrapper.vm.data.rows = [...data.rows]
      await wrapper.vm.$nextTick()
      wrapper.vm.data.total = data.total
      await wrapper.vm.$nextTick()
      wrapper.vm.helper.is_init = false
      await wrapper.vm.$nextTick()

      const rowTotal = wrapper.find(`table[data-testid='${id}'] [data-testid='row-total']`)
      expect(rowTotal.exists()).toBe(exists)
    })
  })
});
