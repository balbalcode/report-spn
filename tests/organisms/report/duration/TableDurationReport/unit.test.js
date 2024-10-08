import { createLocalVue, shallowMount } from "@vue/test-utils"

import TableDurationReport from "@/components/organisms/report/duration/TableDurationReport"
import { additionalTotal, calculatedAverage, calculatedTotal, dataDummy, dataDummyThenDummy, dataDummyThenReal, dataEmpty, dataError, dataReal, dataReal0, dataReal1, dataRealThenDummy, dataRealThenReal, dateRange, dummyRows, formattedContent, formattedHeader, getReportData, payloadGetWithProduct, payloadGetWithoutProduct, product, spotId, vehicles } from "./mock"
import { BToast } from "bootstrap-vue"

let wrapper
const localVue = createLocalVue()
localVue.component('b-toast', BToast)

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

describe("unit.TableDurationReport.vue", () => {
  beforeEach(() => {
    mocksFn = {}
    mocksFn['setBatchReport'] = jest.spyOn(TableDurationReport.methods, "setBatchReport").mockImplementation()
    mocks.$utility.getFormattedVehicle = mocksFn['$utility.getFormattedVehicle'] = jest.fn().mockReturnValueOnce(vehicles)
    wrapper = shallowMount(TableDurationReport, { mocks, localVue })
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it("test mounted lifecycle, should set helper.is_init to true and set vehicles with returned data from $utility.getFormattedVehicle", () => {
    expect(wrapper.vm.helper.is_init).toBe(true)
    expect(mocksFn['setBatchReport'].mock.calls).toEqual([[]])
    expect(wrapper.vm.vehicles).toEqual(vehicles)
  })

  describe('test watch is_searching', () => {
    it.each([
      {
        case: "given is_searching changed to true and date_range.length === 2, should call batchReport.setDateRange and batchReport.gatherData",
        is_searching: true, date_range: dateRange,
        fnMocked: {
          'batchReport.setDateRange': { calls: [[dateRange]] },
          'batchReport.gatherData': { calls: [[]] },
          passFormatDownloadReport: { calls: [] }
        }
      }, {
        case: "given is_searching changed to false, shouldn't call any function",
        is_searching: false, date_range: dateRange,
        fnMocked: {
          'batchReport.setDateRange': { calls: [] },
          'batchReport.gatherData': { calls: [] },
          passFormatDownloadReport: { calls: [] }
        }
      }, {
        case: "given is_searching changed to true and date_range.length != 2, should call passFormatDownloadReport",
        is_searching: true, date_range: [],
        fnMocked: {
          'batchReport.setDateRange': { calls: [] },
          'batchReport.gatherData': { calls: [] },
          passFormatDownloadReport: { calls: [[]] }
        }
      }
    ])('$case', async ({ is_searching, date_range, fnMocked }) => {
      // preset
      wrapper.vm.batchReport.setDateRange = jest.fn()
      wrapper.vm.batchReport.gatherData = jest.fn()
      wrapper.vm.passFormatDownloadReport = jest.fn()

      wrapper.setProps({ is_searching: !is_searching })
      await wrapper.vm.$nextTick()

      // test
      wrapper.vm.batchReport.setDateRange = mocksFn['batchReport.setDateRange'] = jest.fn()
      wrapper.vm.batchReport.gatherData = mocksFn['batchReport.gatherData'] = jest.fn()
      wrapper.vm.passFormatDownloadReport = mocksFn['passFormatDownloadReport'] = jest.fn()

      wrapper.setProps({ is_searching, date_range })
      await wrapper.vm.$nextTick()

      expect(mocksFn['batchReport.setDateRange'].mock.calls).toEqual(fnMocked['batchReport.setDateRange'].calls)
      expect(mocksFn['batchReport.gatherData'].mock.calls).toEqual(fnMocked['batchReport.gatherData'].calls)
      expect(mocksFn['passFormatDownloadReport'].mock.calls).toEqual(fnMocked['passFormatDownloadReport'].calls)
    })
  })

  it("once batchReport.loadingBatch get changed, should emit loadingBatch", async () => {
    wrapper.vm.batchReport.loadingBatch = true
    await wrapper.vm.$nextTick()

    wrapper.vm.batchReport.loadingBatch = false
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted("loadingBatch")).toEqual([[true], [false]])
  })

  describe('test setPayloadGetBatch', () => {
    it.each([
      {
        case: "given product filter filled, should return payload which has product",
        product, payload: payloadGetWithProduct
      }, {
        case: "given product filter empty, should return payload which has not product",
        product: "", payload: payloadGetWithoutProduct
      }
    ])('$case', async ({ product, payload }) => {
      wrapper.vm.$utility.getSpotId = mocksFn['$utility.getSpotId'] = jest.fn().mockReturnValueOnce(spotId)
      wrapper.setProps({ product })
      await wrapper.vm.$nextTick()

      const receivedPayload = wrapper.vm.setPayloadGetBatch(`${dateRange[0]}_${dateRange[1]}`)
      expect(receivedPayload).toEqual(payload)
    })
  })

  it("once setBatchReport called, should set batchReport.batchSize, batchReport.getReport and batchReport.concatRows", () => {
    mocksFn['setBatchReport'].mockRestore()
    wrapper.vm.setBatchReport = TableDurationReport.methods.setBatchReport

    wrapper.vm.setBatchReport()

    expect(wrapper.vm.batchReport.batchSize).toBe(3)
    expect(wrapper.vm.batchReport.getReport).toEqual(wrapper.vm.processGetReport)
    expect(wrapper.vm.batchReport.concatRows).toEqual(wrapper.vm.processConcatData)
  })

  describe('test passFormatDownloadReport', () => {
    it.each([
      {
        case: "given data.rows.length > 0, should call formatContentReport & formatHeaderReport",
        payload: { content: formattedContent, header: formattedHeader }, rows: [...getReportData.rows],
        fnMocked: { formatContentReport: { calls: [[]] }, formatHeaderReport: { calls: [[]] } }
      }, {
        case: "given data.rows.length == 0, should not call formatContentReport nor formatHeaderReport",
        payload: { content: [], header: {} }, rows: [],
        fnMocked: { formatContentReport: { calls: [] }, formatHeaderReport: { calls: [] } }
      }
    ])('$case', async ({ rows, payload, fnMocked }) => {
      wrapper.vm.formatContentReport = mocksFn['formatContentReport'] = jest.fn().mockReturnValueOnce(formattedContent)
      wrapper.vm.formatHeaderReport = mocksFn['formatHeaderReport'] = jest.fn().mockReturnValueOnce(formattedHeader)
      wrapper.vm.data.rows = rows
      await wrapper.vm.$nextTick()

      wrapper.vm.passFormatDownloadReport()
      expect(wrapper.emitted("ready")).toEqual([[payload]])
      expect(mocksFn['formatContentReport'].mock.calls).toEqual(fnMocked['formatContentReport'].calls)
      expect(mocksFn['formatHeaderReport'].mock.calls).toEqual(fnMocked['formatHeaderReport'].calls)
    })
  })

  describe('test formatColumnClass', () => {
    it.each([
      { col_idx: 0, vhc_idx: 0, className: "even" },
      { col_idx: 0, vhc_idx: 1, className: "odd" },
      { col_idx: 1, vhc_idx: 0, className: "even" },
      { col_idx: 1, vhc_idx: 1, className: "odd" }
    ])('given col_idx=$col_idx, vhc_idx=$vhc_idx, vehicle.length=2, should return $className', ({ col_idx, vhc_idx, className }) => {
      const receivedClass = wrapper.vm.formatColumnClass(col_idx, vhc_idx)

      expect(receivedClass).toMatch(className)
    })
  })

  it("once formatHeaderReport called, should return report header properly", () => {
    const header = wrapper.vm.formatHeaderReport()
    expect(header).toEqual(formattedHeader)
  })

  it("once formatContentReport called, should return report content properly", async () => {
    mocksFn['formatRowReport'] = jest.fn()
    formattedContent.forEach(row => {
      mocksFn['formatRowReport'] = mocksFn['formatRowReport'].mockReturnValueOnce(row)
    })
    wrapper.vm.formatRowReport = mocksFn['formatRowReport']

    wrapper.vm.data.rows = [...getReportData.rows]
    await wrapper.vm.$nextTick()

    wrapper.vm.data.total = { ...getReportData.total }
    await wrapper.vm.$nextTick()

    wrapper.vm.data.average = { ...calculatedAverage }
    await wrapper.vm.$nextTick()

    const content = wrapper.vm.formatContentReport()
    expect(content).toEqual(formattedContent)
  })

  it("once processCalculateAverage called, should set data.average correctly", async () => {
    wrapper.vm.data.total = { ...getReportData.total }
    await wrapper.vm.$nextTick()

    wrapper.vm.helper.n_real_data = 3
    await wrapper.vm.$nextTick()

    wrapper.vm.processCalculateAverage()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.data.average).toEqual(calculatedAverage)
  })

  it("once processCalculateTotal called, should set data.total correctly", async () => {
    wrapper.vm.data.total = { ...getReportData.total }
    await wrapper.vm.$nextTick()

    wrapper.vm.processCalculateTotal(additionalTotal)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.data.total).toEqual(calculatedTotal)
  })

  it.todo("once processConcatData")

  it("once processGetReport called, should call setPayloadGetBatch and getQuantityDurationReport", async () => {
    wrapper.vm.setPayloadGetBatch = mocksFn['setPayloadGetBatch'] = jest.fn().mockReturnValueOnce(payloadGetWithoutProduct)
    wrapper.vm.getQuantityDurationReport = mocksFn['getQuantityDurationReport'] = jest.fn().mockReturnValueOnce(dataReal)

    const receivedValue = await wrapper.vm.processGetReport(dateRange)

    expect(mocksFn['setPayloadGetBatch'].mock.calls).toEqual([[dateRange]])
    expect(receivedValue).toEqual(dataReal)
  })
})