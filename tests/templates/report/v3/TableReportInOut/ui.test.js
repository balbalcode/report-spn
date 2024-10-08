import { createLocalVue, shallowMount } from "@vue/test-utils";

import utility from "@/plugins/utilities"
import { parking_access } from "@/constants/v3.report"
import TableReportInOut from "@/components/templates/report/v3/TableReportInOut";
import {
  dataReal, dateRange, formattedContent, formattedHeader, getReportData, payloadGetWithType,
  payloadGetWithoutType, type, spotId, vehicles, payloadGetWithVersion, month, dataDummy,
} from "./mock";
import { BSpinner, BToast } from "bootstrap-vue";

let wrapper;
const localVue = createLocalVue()
localVue.component('b-toast', BToast)
localVue.component('b-spinner', BSpinner)

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
const id = "table-report-in-out"

describe("ui.TableReportInOut.vue", () => {
  beforeEach(() => {
    mocksFn = {};
    mocksFn['get_report'] = jest.fn()
    mocksFn["setVersion"] = jest.spyOn(TableReportInOut.methods, "setVersion").mockImplementation();
    mocksFn["setBatchReport"] = jest.spyOn(TableReportInOut.methods, "setBatchReport").mockImplementation();
    mocks.$utility.getFormattedVehicle = mocksFn["$utility.getFormattedVehicle"] = jest.fn().mockReturnValueOnce(vehicles);
    wrapper = shallowMount(TableReportInOut, { mocks, localVue, propsData: { get_report: mocksFn['get_report'] } });
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

    wrapper.setProps({ vehicle: vehicles, column: parking_access(), parking_access: parking_access() })
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

      const casualStart = 2
      expect(data.at(casualStart).text()).toContain(`${dataReal.rows[indexRow].casual.in.MT1}`)
      expect(data.at(casualStart + 1).text()).toContain(`${dataReal.rows[indexRow].casual.in.MB1}`)
      expect(data.at(casualStart + 2).text()).toContain(`${dataReal.rows[indexRow].casual.out.MT1}`)
      expect(data.at(casualStart + 3).text()).toContain(`${dataReal.rows[indexRow].casual.out.MB1}`)

      const memberStart = 6
      expect(data.at(memberStart).text()).toContain(`${dataReal.rows[indexRow].member.in.MT1}`)
      expect(data.at(memberStart + 1).text()).toContain(`${dataReal.rows[indexRow].member.in.MB1}`)
      expect(data.at(memberStart + 2).text()).toContain(`${dataReal.rows[indexRow].member.out.MT1}`)
      expect(data.at(memberStart + 3).text()).toContain(`${dataReal.rows[indexRow].member.out.MB1}`)

      const totalStart = 10
      expect(data.at(totalStart).text()).toContain(`${dataReal.rows[indexRow].total.casual.in}`)
      expect(data.at(totalStart + 1).text()).toContain(`${dataReal.rows[indexRow].total.casual.out}`)
      expect(data.at(totalStart + 2).text()).toContain(`${dataReal.rows[indexRow].total.member.in}`)
      expect(data.at(totalStart + 3).text()).toContain(`${dataReal.rows[indexRow].total.member.out}`)

      const diffStar = 14
      expect(data.at(diffStar).text()).toContain(`${dataReal.rows[indexRow].difference.casual}`)
      expect(data.at(diffStar + 1).text()).toContain(`${dataReal.rows[indexRow].difference.member}`)

      const grandTotalStart = 16
      expect(data.at(grandTotalStart).text()).toContain(`${dataReal.rows[indexRow].grand_total.in}`)
      expect(data.at(grandTotalStart + 1).text()).toContain(`${dataReal.rows[indexRow].grand_total.out}`)
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
