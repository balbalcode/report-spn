import { createLocalVue, shallowMount } from "@vue/test-utils";
import { ModalPlugin, TooltipPlugin } from "bootstrap-vue";

import TableProblemTicketReport from "@/components/organisms/report/problem-ticket/TableProblemTicketReport"
import { formattedContentReport, getReport, payloadGetBasic, payloadGetWithOfficer, payloadGetWithReason, payloadGetWithUser, propsBasic, propsWithOfficer, propsWithReason, propsWithUser, spotId } from "./mock";
// import utility from "@/plugins/utility"

const localVue = createLocalVue()
localVue.use(ModalPlugin)
localVue.use(TooltipPlugin)

const mocks = {
  $utility: {
    convertToRupiah: () => "",
    convertToNumber: () => "",
    getVehicleMap: () => ({}),
    getSpotId: () => "",
    getAssetUrl: () => "",
    formatLocalTimezone: () => "",
    setErrorContextSentry: () => "",
  },
  $sentry: {
    captureMessage() { }
  }
}
let wrapper
let mocksFn = {}

describe("unit.TableProblemTicketReport.vue", () => {
  beforeEach(() => {
    mocksFn = {}
    mocksFn['processGetData'] = jest.spyOn(TableProblemTicketReport.methods, "processGetData").mockImplementation()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  describe("lifecycle mounted", () => {
    test.each([
      { case: "given is_searching true, should call processGetData", is_searching: true, fnMocked: { processGetData: { calls: [[]] } } },
      { case: "given is_searching false, shouldn't call processGetData", is_searching: false, fnMocked: { processGetData: { calls: [] } } },
    ])("$case", async ({ is_searching, fnMocked }) => {
      const propsData = { is_searching }
      wrapper = shallowMount(TableProblemTicketReport, { mocks, localVue, propsData })

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
      wrapper = shallowMount(TableProblemTicketReport, { localVue, mocks, propsData })
      await wrapper.vm.$nextTick()

      wrapper.vm.processGetData = mocksFn['processGetData'] = jest.fn()

      wrapper.setProps({ is_searching })
      await wrapper.vm.$nextTick()

      expect(mocksFn['processGetData'].mock.calls).toEqual(fnMocked['processGetData'].calls)
    })
  })

  describe("methods", () => {
    beforeEach(() => {
      wrapper = shallowMount(TableProblemTicketReport, { localVue, mocks })
    })

    it("once passFormatDownloadReport called, should emit ready", async () => {
      wrapper.vm.formatContentReport = mocksFn['formatContentReport'] = jest.fn().mockReturnValueOnce(formattedContentReport)

      wrapper.vm.data.rows = [...getReport.rows]
      wrapper.vm.data.total = { ...getReport.total }
      await wrapper.vm.$nextTick()

      wrapper.vm.passFormatDownloadReport()
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted("ready")).toEqual([[{ content: formattedContentReport, total: getReport.total }]])
    })

    describe("setPayloadGet", () => {
      it.each([
        {
          case: "given no filter, should return basic payload",
          propsData: propsBasic, payload: payloadGetBasic
        },
        {
          case: "given filled officer, should return payload with filter officer_id",
          propsData: propsWithOfficer, payload: payloadGetWithOfficer
        },
        {
          case: "given filled user, should return payload with filter mgmt_user_id",
          propsData: propsWithUser, payload: payloadGetWithUser
        },
        {
          case: "given filled reason, should return payload with filter reason",
          propsData: propsWithReason, payload: payloadGetWithReason
        }
      ])("$case", async ({ propsData, payload }) => {
        wrapper.vm.$utility.getSpotId = mocksFn['$utility.getSpotId'] = jest.fn().mockReturnValueOnce(spotId)

        wrapper.setProps(propsData)
        await wrapper.vm.$nextTick()

        const receivedPayload = wrapper.vm.setPayloadGet()
        expect(receivedPayload).toEqual(payload)
      })
    })

    describe("setSelectedImage", () => {
      test.each([
        { case: "given image null, should set selected_image to empty string", image: null, selected_image: "" },
        { case: "given image filled, should set selected_image with given image", image: "bola.jpg", selected_image: "bola.jpg" }
      ])("$case", ({ image, selected_image }) => {
        wrapper.vm.toggleModalImage = mocksFn['toggleModalImage'] = jest.fn()

        wrapper.vm.setSelectedImage(image)

        expect(mocksFn['toggleModalImage'].mock.calls).toEqual([[]])
        expect(wrapper.vm.selected_image).toMatch(selected_image)
      })
    })

    test("once toggleModalImage called, should toggle helper.modal_image to true or false", () => {
      wrapper.vm.toggleModalImage();
      expect(wrapper.vm.modal.modal_image).toBeTruthy();

      wrapper.vm.toggleModalImage();
      expect(wrapper.vm.modal.modal_image).toBeFalsy();
    });

    it("once formatContentReport called, should return formatted report rows", async () => {

      mocksFn['$utility.convertToRupiah'] = jest.fn()
      formattedContentReport.forEach(row => {
        mocksFn['$utility.convertToRupiah'] = mocksFn['$utility.convertToRupiah']
          .mockReturnValueOnce(row.amount)
      })
      wrapper.vm.$utility.convertToRupiah = mocksFn['$utility.convertToRupiah']

      const receivedValue = wrapper.vm.formatContentReport(getReport.rows)
      expect(receivedValue).toEqual(formattedContentReport)
    })

    describe("processGetData", () => {
      it("given no error occured, should set data with returned value from getProblemTicketReport", async () => {
        wrapper.vm.setPayloadGet = mocksFn['setPayloadGet'] = jest.fn().mockReturnValueOnce(payloadGetBasic)
        wrapper.vm.getProblemTicketReport = mocksFn['getProblemTicketReport'] = jest.fn().mockReturnValueOnce(getReport)
        wrapper.vm.passFormatDownloadReport = mocksFn['passFormatDownloadReport'] = jest.fn()

        mocksFn['processGetData'].mockRestore()
        wrapper.vm.processGetData = TableProblemTicketReport.methods.processGetData
        await wrapper.vm.processGetData()

        expect(mocksFn['setPayloadGet'].mock.calls).toEqual([[]])
        expect(mocksFn['getProblemTicketReport'].mock.calls).toEqual([[payloadGetBasic]])
        expect(mocksFn['passFormatDownloadReport'].mock.calls).toEqual([[]])
      })

      it("given error occured, should set helper.is_error to true", async () => {
        wrapper.vm.setPayloadGet = mocksFn['setPayloadGet'] = jest.fn().mockReturnValueOnce(payloadGetBasic)
        const error = new Error("Error Occured !")
        wrapper.vm.getProblemTicketReport = mocksFn['getProblemTicketReport'] = jest.fn().mockRejectedValueOnce(error)
        wrapper.vm.passFormatDownloadReport = mocksFn['passFormatDownloadReport'] = jest.fn()

        mocksFn['processGetData'].mockRestore()
        wrapper.vm.processGetData = TableProblemTicketReport.methods.processGetData
        await wrapper.vm.processGetData()

        expect(mocksFn['setPayloadGet'].mock.calls).toEqual([[]])
        expect(mocksFn['getProblemTicketReport'].mock.calls).toEqual([[payloadGetBasic]])
        expect(mocksFn['passFormatDownloadReport'].mock.calls).toEqual([[]])
        expect(wrapper.vm.data).toEqual({ rows: [] })
        expect(wrapper.vm.helper.is_error).toBe(true)
      })
    })
  })
})
