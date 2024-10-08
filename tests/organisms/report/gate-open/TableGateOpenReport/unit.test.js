import { shallowMount, createLocalVue } from "@vue/test-utils"
import { BModal, VBTooltip } from "bootstrap-vue"

import TableGateOpenReport from "@/components/organisms/report/gate-open/TableGateOpenReport"
import { dataGetReport, payloadGet, payloadReady, report, spotId, spotInfo } from "./mock"

const localVue = createLocalVue()
localVue.directive('b-tooltip', VBTooltip)

const mocks = {
  $utility: {
    getSpotId() { },
    getSelectedSpot() { },
    mergeBaseAssetUrl() { },
    getAssetUrl() { },
    dateUTCToLocal() { }
  }
}
const stubs = {
  'b-modal': BModal
}
let wrapper
let mocksFn

describe("unit.TableGateOpenReport.vue", () => {
  beforeEach(() => {
    mocksFn = {}
    wrapper = shallowMount(TableGateOpenReport, { localVue, mocks, stubs })
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  it("test computed start, should start number of pagination", async () => {
    wrapper.setProps({ page: 3, per_page: 15 })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.start).toBe(31)

    wrapper.setProps({ page: 2, per_page: 4 })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.start).toBe(5)
  })

  describe("test watch is_searching", () => {
    it.each([
      {
        case: "given is_searching true, should call processGetData", is_searching: true,
        fnMocked: { processGetData: { calls: [[]] } }
      }, {
        case: "given is_searching false, shouldn't call processGetData", is_searching: false,
        fnMocked: { processGetData: { calls: [] } }
      }
    ])('$case', async ({ is_searching, fnMocked }) => {
      // set is_searching to opposite testing value to make it triggered when changed to testing value
      wrapper.vm.processGetData = jest.fn()
      wrapper.setProps({ is_searching: !is_searching })
      await wrapper.vm.$nextTick()

      wrapper.vm.processGetData = mocksFn['processGetData'] = jest.fn()
      wrapper.setProps({ is_searching })
      await wrapper.vm.$nextTick()

      expect(mocksFn['processGetData'].mock.calls).toEqual(fnMocked['processGetData'].calls)
    })
  })

  it("once getPayloadGetData called, should return proper payload for getting data", async () => {
    wrapper.vm.$utility.getSpotId = mocksFn['$utility.getSpotId'] = jest.fn().mockReturnValueOnce(spotId)
    wrapper.setProps({
      month: payloadGet.filter[1].value,
      page: payloadGet.filter[2].value,
      per_page: payloadGet.filter[3].value,
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.getPayloadGetData()).toEqual(payloadGet)
  })

  it("once passFormatDownloadReport called, should pass report data to parent", async () => {
    wrapper.vm.$utility.getSelectedSpot = mocksFn['$utility.getSelectedSpot'] = jest.fn().mockReturnValueOnce(spotInfo)
    wrapper.vm.formatReport = mocksFn['formatReport'] = jest.fn().mockReturnValueOnce(report)

    wrapper.setProps({ month: "2023-04", page: 2, per_page: 2 })
    await wrapper.vm.$nextTick()

    wrapper.vm.passFormatDownloadReport(dataGetReport)

    expect(mocksFn['$utility.getSelectedSpot'].mock.calls).toEqual([[]])
    expect(mocksFn['formatReport'].mock.calls).toEqual([[dataGetReport.data]])
    expect(wrapper.emitted("ready")).toEqual([[payloadReady]])
  })

  it("once formatReport called, should return formatted report", async () => {
    mocksFn['$utility.mergeBaseAssetUrl'] = jest.fn()
    mocksFn['$utility.dateUTCToLocal'] = jest.fn()
    report.forEach(row => {
      mocksFn['$utility.mergeBaseAssetUrl'] = mocksFn['$utility.mergeBaseAssetUrl'].mockReturnValueOnce(row.image)
      mocksFn['$utility.dateUTCToLocal'] = mocksFn['$utility.dateUTCToLocal'].mockReturnValueOnce(row.date)
    })
    wrapper.vm.$utility.mergeBaseAssetUrl = mocksFn['$utility.mergeBaseAssetUrl']
    wrapper.vm.$utility.dateUTCToLocal = mocksFn['$utility.dateUTCToLocal']

    const formattedReport = wrapper.vm.formatReport(dataGetReport.data)
    expect(formattedReport).toEqual(report)
  })

  describe("test toggleModalImage", () => {
    it.each([
      {
        case: "given data empty, should set selected to {} and set modal.image to false",
        selected: {}, modal: false
      },
      {
        case: "given data not empty, should set selected to data and set modal.image to true",
        data: report[0], selected: report[0], modal: true
      }
    ])('$case', ({ data, selected, modal }) => {
      wrapper.vm.toggleModalImage(data)

      expect(wrapper.vm.selected).toEqual(selected)
      expect(wrapper.vm.modal.image).toEqual(modal)
    })
  })

  it("once processGetData called, should call getPayloadGetData, getGateOpenReport and passFormatDownloadReport", async () => {
    wrapper.vm.getPayloadGetData = mocksFn['getPayloadGetData'] = jest.fn().mockReturnValueOnce(payloadGet)
    wrapper.vm.getGateOpenReport = mocksFn['getGateOpenReport'] = jest.fn().mockReturnValueOnce(dataGetReport)
    wrapper.vm.passFormatDownloadReport = mocksFn['passFormatDownloadReport'] = jest.fn()

    await wrapper.vm.processGetData()

    expect(mocksFn['getPayloadGetData'].mock.calls).toEqual([[]])
    expect(mocksFn['getGateOpenReport'].mock.calls).toEqual([[payloadGet]])
    expect(mocksFn['passFormatDownloadReport'].mock.calls).toEqual([[dataGetReport]])
  })
})