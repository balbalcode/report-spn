import { createLocalVue, shallowMount } from "@vue/test-utils"
import { BSpinner, BToast } from "bootstrap-vue"

import TableDurationReport from "@/components/organisms/report/duration/TableDurationReport"
import { calculatedAverage, dataDummy, dataReal, dummyRows, vehicles } from "./mock"
import utility from "@/plugins/utilities"

let wrapper
const localVue = createLocalVue()
localVue.component('b-toast', BToast)
localVue.component('b-spinner', BSpinner)

const mocks = {
  $utility: {
    getFormattedVehicle: () => ([]),
    getSpotId: () => "",
    formatListParameterPayload: () => "",
    formatDateMoment: () => "",
    setErrorContextSentry() { },
    fireToast() { },
    convertToRupiah: () => "",
    formatLocalTimezone: () => "",
    getAssetUrl: () => ""
  },
  $sentry: {
    captureMessage() { }
  },
}
let mocksFn = {}

describe("ui.TableDurationReport.vue", () => {
  beforeEach(() => {
    mocksFn = {}
    mocks.$utility.getFormattedVehicle = mocksFn['$utility.getFormattedVehicle'] =
      jest.fn().mockReturnValueOnce(vehicles)
    wrapper = shallowMount(TableDurationReport, { mocks, localVue })
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

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

      const rowReload = wrapper.find("#table-duration-report__row-0__reload")
      expect(rowReload.exists()).toBe(rowReloadExists)
      const rowFailed = wrapper.find("#table-duration-report__row-0__failed")
      expect(rowFailed.exists()).toBe(rowFailedExists)
    })
  })

  it("given real data, should show data on table", async () => {
    wrapper.vm.$utility.convertToRupiah = utility.convertToRupiah
    wrapper.setProps({ vehicle: vehicles })
    await wrapper.vm.$nextTick()
    wrapper.vm.data.rows = [...dataReal.rows]
    await wrapper.vm.$nextTick()
    wrapper.vm.helper.is_init = false
    await wrapper.vm.$nextTick()

    const rows = wrapper.findAll("#table-duration-report tbody tr")
    for (let indexRow = 0; indexRow < rows.length; indexRow++) {
      const data = rows.at(indexRow).findAll("td")

      expect(data.at(0).text()).toContain(dataReal.rows[indexRow].date)
      expect(data.at(1).text()).toContain(`${dataReal.rows[indexRow]["0-1"].MT1}`)
      expect(data.at(2).text()).toContain(`${dataReal.rows[indexRow]["0-1"].MB1}`)
      expect(data.at(3).text()).toContain(`${dataReal.rows[indexRow]["1-2"].MT1}`)
      expect(data.at(4).text()).toContain(`${dataReal.rows[indexRow]["1-2"].MB1}`)
      expect(data.at(5).text()).toContain(`${dataReal.rows[indexRow]["2-3"].MT1}`)
      expect(data.at(6).text()).toContain(`${dataReal.rows[indexRow]["2-3"].MB1}`)
      expect(data.at(7).text()).toContain(`${dataReal.rows[indexRow]["3-6"].MT1}`)
      expect(data.at(8).text()).toContain(`${dataReal.rows[indexRow]["3-6"].MB1}`)
      expect(data.at(9).text()).toContain(`${dataReal.rows[indexRow]["6-12"].MT1}`)
      expect(data.at(10).text()).toContain(`${dataReal.rows[indexRow]["6-12"].MB1}`)
      expect(data.at(11).text()).toContain(`${dataReal.rows[indexRow][">12"].MT1}`)
      expect(data.at(12).text()).toContain(`${dataReal.rows[indexRow][">12"].MB1}`)
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

      const rowTotal = wrapper.find("#table-duration-report__row-total")
      expect(rowTotal.exists()).toBe(exists)
    })
  })

  describe("test row average", () => {
    it.each([
      { case: "given empty average, shouldn't exist", average: false, exists: false },
      { case: "given filled average, should exist", average: calculatedAverage, exists: true }
    ])('$case', async ({ average, exists }) => {
      wrapper.vm.data.rows = [...dataReal.rows]
      await wrapper.vm.$nextTick()
      wrapper.vm.data.average = average
      await wrapper.vm.$nextTick()
      wrapper.vm.helper.is_init = false
      await wrapper.vm.$nextTick()

      const rowAverage = wrapper.find("#table-duration-report__row-average")
      expect(rowAverage.exists()).toBe(exists)
    })
  })
})