import { createLocalVue, shallowMount } from "@vue/test-utils";
import { ModalPlugin, TooltipPlugin } from "bootstrap-vue";

import TableLostTicketReport from "@/components/organisms/report/ticket/TableLostTicketReport"
import { formattedContentReport, formattedTotalReport, getReport, payloadGetBasic, payloadGetWithOfficer, spotId, vehicleMap } from "./mock";

const localVue = createLocalVue()
localVue.use(ModalPlugin)
localVue.use(TooltipPlugin)

const mocks = {
  $utility: {
    convertToRupiah: () => "",
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

describe("unit.TableLostTicketReport.vue", () => {
  beforeEach(() => {
    mocksFn = {}
    mocksFn['$utility.getVehicleMap'] = mocks.$utility.getVehicleMap = jest.fn().mockReturnValueOnce(vehicleMap)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('mounted lifecycle, should set helper.is_init to true and set vehicle_map with returned value from $utility.getVehicleMap', async () => {
    wrapper = shallowMount(TableLostTicketReport, { localVue, mocks })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.helper.is_init).toBe(true)
    expect(mocksFn['$utility.getVehicleMap'].mock.calls).toEqual([[]])
    expect(wrapper.vm.vehicle_map).toEqual(vehicleMap)
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
      wrapper = shallowMount(TableLostTicketReport, { localVue, mocks, propsData })
      await wrapper.vm.$nextTick()

      wrapper.vm.processGetData = mocksFn['processGetData'] = jest.fn()

      wrapper.setProps({ is_searching })
      await wrapper.vm.$nextTick()

      expect(mocksFn['processGetData'].mock.calls).toEqual(fnMocked['processGetData'].calls)
    })
  })

  describe("methods", () => {
    beforeEach(() => {
      wrapper = shallowMount(TableLostTicketReport, { localVue, mocks })
    })

    it("once passFormatDownloadReport called, should emit ready", async () => {
      wrapper.vm.formatContentReport = mocksFn['formatContentReport'] = jest.fn().mockReturnValueOnce(formattedContentReport)
      wrapper.vm.formatTotalReport = mocksFn['formatTotalReport'] = jest.fn().mockReturnValueOnce(formattedTotalReport)

      wrapper.vm.passFormatDownloadReport(getReport)
      await wrapper.vm.$nextTick()

      const payload = [...formattedContentReport, formattedTotalReport]
      expect(wrapper.emitted("ready")).toEqual([[{ content: payload }]])
    })

    it("test function passUpdatePagination, should set pagination.current_page and call processGetData", async () => {
      wrapper.vm.processGetData = mocksFn['processGetData'] = jest.fn()
      const page = 1
  
      await wrapper.vm.passUpdatePagination(page);
  
      expect(wrapper.vm.pagination.current_page).toEqual(page);
      expect(mocksFn['processGetData'].mock.calls).toEqual([[]])
    });

    describe("setPayloadGet", () => {
      it.each([
        {
          case: "given no officer, should return basic payload",
          propsData: { month: "2023-09" }, payload: payloadGetBasic
        },
        {
          case: "given filled officer, should return payload with filter officer_id",
          propsData: { month: "2023-09", officer: [{ value: "ffff-gggg-hhhh-jjjj" }, { value: "abc" }] }, payload: payloadGetWithOfficer
        }
      ])("$case", async ({ propsData, payload }) => {
        wrapper.vm.$utility.getSpotId = mocksFn['$utility.getSpotId'] = jest.fn().mockReturnValueOnce(spotId)

        wrapper.setProps(propsData)
        await wrapper.vm.$nextTick()

        const receivedPayload = wrapper.vm.setPayloadGet()
        expect(receivedPayload).toEqual(payload)
      })
    })

    describe("toggleModalImage", () => {
      it.each([
        {
          case: "given data, should set selected_data with given data and set modal.modal_preview to true",
          data: formattedContentReport[0], modal_preview: true, selected_data: formattedContentReport[0]
        }, {
          case: "given undefined data, should set selected_data with empty string and set modal.modal_preview to false",
          modal_preview: false, selected_data: {}
        }
      ])("$case", async ({ data, modal_preview, selected_data }) => {
        wrapper.vm.toggleModalImage(data)
        await wrapper.vm.$nextTick()

        expect(wrapper.vm.modal.modal_preview).toBe(modal_preview)
        expect(wrapper.vm.selected_data).toEqual(selected_data)
      })
    })

    describe("processCountDuration", () => {
      it.each([
        { case: "given totalHours 72, should return '3 Hari'", totalHours: 72, durationText: '3 Hari' },
        { case: "given totalHours 70, should return '2 Hari 22 Jam'", totalHours: 70, durationText: '2 Hari 22 Jam' },
        { case: "given totalHours 3, should return '3 Jam'", totalHours: 3, durationText: '3 Jam' },
      ])("$case", ({ totalHours, durationText }) => {
        const returnedText = wrapper.vm.processCountDuration(totalHours)
        expect(returnedText).toMatch(durationText)
      })
    })

    it("once formatContentReport called, should return formatted report rows", async () => {
      mocksFn['$utility.formatLocalTimezone'] = jest.fn()
      mocksFn['$utility.convertToRupiah'] = jest.fn()
      mocksFn['processCountDuration'] = jest.fn()
      formattedContentReport.forEach(row => {
        mocksFn['$utility.formatLocalTimezone'] = mocksFn['$utility.formatLocalTimezone']
          .mockReturnValueOnce(row.time_in)
          .mockReturnValueOnce(row.time_out)
        mocksFn['processCountDuration'] = mocksFn['processCountDuration']
          .mockReturnValueOnce(row.total_hours)
        mocksFn['$utility.convertToRupiah'] = mocksFn['$utility.convertToRupiah']
          .mockReturnValueOnce(row.parking_price)
          .mockReturnValueOnce(row.overnight_price)
          .mockReturnValueOnce(row.fine)
          .mockReturnValueOnce(row.total_price)
      })
      wrapper.vm.$utility.formatLocalTimezone = mocksFn['$utility.formatLocalTimezone']
      wrapper.vm.$utility.convertToRupiah = mocksFn['$utility.convertToRupiah']
      wrapper.vm.processCountDuration = mocksFn['processCountDuration']

      const receivedValue = wrapper.vm.formatContentReport(getReport.rows)
      expect(receivedValue).toEqual(formattedContentReport)
    })

    it("once formatTotalReport called, should return formatted total", () => {
      wrapper.vm.$utility.convertToRupiah = mocksFn['$utility.convertToRupiah'] = jest.fn()
        .mockReturnValueOnce(formattedTotalReport.parking_price)
        .mockReturnValueOnce(formattedTotalReport.fine)
        .mockReturnValueOnce(formattedTotalReport.overnight_price)
        .mockReturnValueOnce(formattedTotalReport.total_price)

      const receivedValue = wrapper.vm.formatTotalReport(getReport.total)
      expect(receivedValue).toEqual(formattedTotalReport)
    })

    describe("processGetData", () => {
      it("given no error occured, should set data with returned value from getLostTicketReport", async () => {
        wrapper.vm.setPayloadGet = mocksFn['setPayloadGet'] = jest.fn().mockReturnValueOnce(payloadGetBasic)
        wrapper.vm.getLostTicketReport = mocksFn['getLostTicketReport'] = jest.fn().mockReturnValueOnce(getReport)
        wrapper.vm.passFormatDownloadReport = mocksFn['passFormatDownloadReport'] = jest.fn()

        await wrapper.vm.processGetData()

        expect(mocksFn['setPayloadGet'].mock.calls).toEqual([[]])
        expect(mocksFn['getLostTicketReport'].mock.calls).toEqual([[payloadGetBasic]])
        expect(mocksFn['passFormatDownloadReport'].mock.calls).toEqual([[getReport]])
      })

      it("given error occured, should set helper.is_error to true", async () => {
        wrapper.vm.setPayloadGet = mocksFn['setPayloadGet'] = jest.fn().mockReturnValueOnce(payloadGetBasic)
        const error = new Error("Error Occured !")
        wrapper.vm.getLostTicketReport = mocksFn['getLostTicketReport'] = jest.fn().mockRejectedValueOnce(error)
        wrapper.vm.passFormatDownloadReport = mocksFn['passFormatDownloadReport'] = jest.fn()

        await wrapper.vm.processGetData()

        expect(mocksFn['setPayloadGet'].mock.calls).toEqual([[]])
        expect(mocksFn['getLostTicketReport'].mock.calls).toEqual([[payloadGetBasic]])
        expect(mocksFn['passFormatDownloadReport'].mock.calls).toEqual([[]])
        expect(wrapper.vm.data).toEqual({ rows: [], total: {} })
        expect(wrapper.vm.helper.is_error).toBe(true)
      })
    })
  })
})
