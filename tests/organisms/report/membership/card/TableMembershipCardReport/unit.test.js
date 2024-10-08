import { createLocalVue, shallowMount } from "@vue/test-utils"
import { TooltipPlugin } from "bootstrap-vue"

import TableMembershipCardReport from "@/components/organisms/report/membership/card/TableMembershipCardReport"
import { dataGet, payloadGetBasic, payloadGetWithMonth, payloadGetWithProduct, payloadGetWithUser, payloadParent, selectedProduct, selectedUser, spotId, strProductList, strUserList, selectedProductAll, payloadGetWithAllProduct } from "./mock"

let wrapper
let mocksFn = {}

const localVue = createLocalVue()
localVue.use(TooltipPlugin)

const mocks = {
  $utility: {
    getSpotId: () => "",
    encodeReportFilterUrl: () => "",
    formatDateMoment: () => "",
    convertToRupiah: () => "",
    getAssetUrl: () => "",
    setErrorContextSentry() { },
  },
  $sentry: {
    captureMessage() { }
  },
}

describe("unit.TableMembershipCardReport.vue", () => {
  beforeEach(() => {
    mocksFn = {}
    mocksFn['processGetData'] = jest.spyOn(TableMembershipCardReport.methods, "processGetData").mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe("mounted lifecycle", () => {
    test.each([
      { case: "given is_searching true, should call processGetData", is_searching: true, fnMocked: { processGetData: { calls: [[]] } } },
      { case: "given is_searching false, should not call processGetData", is_searching: false, fnMocked: { processGetData: { calls: [] } } },
    ])("$case", async ({ is_searching, fnMocked }) => {
      const propsData = { is_searching }
      wrapper = shallowMount(TableMembershipCardReport, { localVue, mocks, propsData })

      expect(mocksFn['processGetData'].mock.calls).toEqual(fnMocked['processGetData'].calls)
    })
  })

  describe("watch is_searching", () => {
    it.each([
      {
        case: "given is_searching true, should call processGetData",
        is_searching: true, fnMocked: { processGetData: { calls: [[]] } }
      }, {
        case: "given is_searching false, shouldn't call processGetData",
        is_searching: false, fnMocked: { processGetData: { calls: [] } }
      }
    ])('$case', async ({ is_searching, fnMocked }) => {
      const propsData = { is_searching: !is_searching }
      wrapper = shallowMount(TableMembershipCardReport, { localVue, mocks, propsData })

      wrapper.vm.processGetData = mocksFn['processGetData'] = jest.fn()

      wrapper.setProps({ is_searching })
      await wrapper.vm.$nextTick()

      expect(mocksFn['processGetData'].mock.calls).toEqual(fnMocked['processGetData'].calls)
    })
  })

  describe("method", () => {
    beforeEach(() => {
      wrapper = shallowMount(TableMembershipCardReport, { localVue, mocks })
    })

    describe("passFormatDownloadReport", () => {
      test.each([
        { case: "given data.rows.length > 0, should emit 'ready' with filled content", data: dataGet, payload: payloadParent },
        { case: "given data.rows.length == 0, should emit 'ready' with empty content", data: { rows: [], total: {} }, payload: { content: [] } },
      ])("$case", async ({ data, payload }) => {
        wrapper.vm.data = { ...data }
        await wrapper.vm.$nextTick()

        wrapper.vm.passFormatDownloadReport()

        expect(wrapper.emitted("ready")).toEqual([[payload]])
      })
    })

    describe("setPayloadGet", () => {
      test.each([
        {
          case: "given month empty, should return payload with month returned from $utility.formatDateMoment",
          propsData: {}, payload: payloadGetBasic,
          fnMocked: {
            '$utility.formatDateMoment': { returnValue: "2024-04" },
            '$utility.encodeReportFilterUrl': {}
          }
        },
        {
          case: "given month filled, should return payload with month from props month",
          propsData: { month: "2024-02" }, payload: payloadGetWithMonth,
          fnMocked: {
            '$utility.formatDateMoment': {},
            '$utility.encodeReportFilterUrl': {}
          }
        },
        {
          case: "given product filled, should return payload with product_id from props product",
          propsData: { product: selectedProduct }, payload: payloadGetWithProduct,
          fnMocked: {
            '$utility.formatDateMoment': { returnValue: "2024-04" },
            '$utility.encodeReportFilterUrl': { returnValue: strProductList }
          }
        },
        {
          case: "given product filled with ALL product, should return payload with product_id from props product",
          propsData: { product: selectedProductAll }, payload: payloadGetWithAllProduct,
          fnMocked: {
            '$utility.formatDateMoment': { returnValue: "2024-04" },
            '$utility.encodeReportFilterUrl': {}
          }
        },
        {
          case: "given user filled, should return payload with mgmt_user_id from props user",
          propsData: { user: selectedUser }, payload: payloadGetWithUser,
          fnMocked: {
            '$utility.formatDateMoment': { returnValue: "2024-04" },
            '$utility.encodeReportFilterUrl': { returnValue: strUserList }
          }
        },
      ])("$case", async ({ propsData, payload, fnMocked }) => {
        wrapper.setProps(propsData)
        await wrapper.vm.$nextTick()

        wrapper.vm.$utility.getSpotId = mocksFn['$utility.getSpotId'] = jest.fn().mockReturnValueOnce(spotId)
        wrapper.vm.$utility.formatDateMoment = mocksFn['$utility.formatDateMoment'] =
          jest.fn().mockReturnValueOnce(fnMocked['$utility.formatDateMoment'].returnValue)
        wrapper.vm.$utility.encodeReportFilterUrl = mocksFn['$utility.encodeReportFilterUrl'] =
          jest.fn().mockReturnValueOnce(fnMocked['$utility.encodeReportFilterUrl'].returnValue)

        const receivedPayload = wrapper.vm.setPayloadGet()
        expect(receivedPayload).toEqual(payload)
      })
    })

    describe("processGetData", () => {
      it("given no error occured, should set data with returned value from getMembershipReportCardByDate", async () => {
        wrapper.vm.setPayloadGet = mocksFn['setPayloadGet'] = jest.fn().mockReturnValueOnce(payloadGetBasic)
        wrapper.vm.getMembershipReportCardByDate = mocksFn['getMembershipReportCardByDate'] = jest.fn().mockReturnValueOnce(dataGet)
        wrapper.vm.passFormatDownloadReport = mocksFn['passFormatDownloadReport'] = jest.fn()
        wrapper.vm.$utility.setErrorContextSentry = mocksFn['$utility.setErrorContextSentry'] = jest.fn()
        wrapper.vm.$sentry.captureMessage = mocksFn['$sentry.captureMessage'] = jest.fn()

        mocksFn['processGetData'].mockRestore()
        wrapper.vm.processGetData = TableMembershipCardReport.methods.processGetData
        await wrapper.vm.processGetData()

        expect(mocksFn['setPayloadGet'].mock.calls).toEqual([[]])
        expect(mocksFn['getMembershipReportCardByDate'].mock.calls).toEqual([[payloadGetBasic]])
        expect(mocksFn['passFormatDownloadReport'].mock.calls).toEqual([[]])
        expect(mocksFn['$utility.setErrorContextSentry']).not.toHaveBeenCalled()
        expect(mocksFn['$sentry.captureMessage']).not.toHaveBeenCalled()
        expect(wrapper.vm.data).toEqual(dataGet)
        expect(wrapper.vm.helper.is_error).toBe(false)
      })

      it("given error occured, should set helper.is_error to true", async () => {
        wrapper.vm.setPayloadGet = mocksFn['setPayloadGet'] = jest.fn().mockReturnValueOnce(payloadGetBasic)
        const error = new Error("Error Occured !")
        wrapper.vm.getMembershipReportCardByDate = mocksFn['getMembershipReportCardByDate'] = jest.fn().mockRejectedValueOnce(error)
        wrapper.vm.passFormatDownloadReport = mocksFn['passFormatDownloadReport'] = jest.fn()
        wrapper.vm.$utility.setErrorContextSentry = mocksFn['$utility.setErrorContextSentry'] = jest.fn()
        wrapper.vm.$sentry.captureMessage = mocksFn['$sentry.captureMessage'] = jest.fn()

        mocksFn['processGetData'].mockRestore()
        wrapper.vm.processGetData = TableMembershipCardReport.methods.processGetData
        await wrapper.vm.processGetData()

        expect(mocksFn['setPayloadGet'].mock.calls).toEqual([[]])
        expect(mocksFn['getMembershipReportCardByDate'].mock.calls).toEqual([[payloadGetBasic]])
        expect(mocksFn['passFormatDownloadReport'].mock.calls).toEqual([[]])
        expect(mocksFn['$utility.setErrorContextSentry']).toHaveBeenCalled()
        expect(mocksFn['$sentry.captureMessage']).toHaveBeenCalled()
        expect(wrapper.vm.data).toEqual({ rows: [], total: {} })
        expect(wrapper.vm.helper.is_error).toBe(true)
      })
    })
  })
})