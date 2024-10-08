import { shallowMount } from "@vue/test-utils";

import TableLeaveReport from "@/components/organisms/report/leave/TableLeaveReport"
import { formattedData, getReport, payloadGetBasic, payloadGetWithLeaveReason, payloadGetWithLeaveType, payloadGetWithOfficer, spotId } from "./mock";

let wrapper
const mocks = {
  $utility: {
    getAssetUrl: () => "",
    getSelectedSpot: () => ({}),
    setErrorContextSentry() { },
    formatDateMoment: () => ""
  },
  $sentry: {
    captureMessage() { }
  }
}

let mocksFn = {}

describe("unit.TableLeaveReport.vue", () => {
  beforeEach(() => {
    mocksFn = {}
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  describe("computed", () => {
    it("filter_title, should return appropiate filter title", async () => {
      wrapper = shallowMount(TableLeaveReport, { mocks })

      wrapper.vm.data = [...formattedData]
      wrapper.vm.pagination.start = 33
      wrapper.vm.pagination.total_data = 80
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.filter_title).toContain("33-35")
      expect(wrapper.vm.filter_title).toContain("80")

      wrapper.vm.pagination.start = 1
      wrapper.vm.pagination.total_data = 16
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.filter_title).toContain("1-3")
      expect(wrapper.vm.filter_title).toContain("16")
    })
  })

  describe("watch", () => {
    describe("is_searching", () => {
      it.each([
        {
          case: "given is_searching true, should call setCurrentPage",
          is_searching: true, fnMocked: { setCurrentPage: { calls: [[1]] } }
        }, {
          case: "given is_searching false, shouldn't call setCurrentPage",
          is_searching: false, fnMocked: { setCurrentPage: { calls: [] } }
        }
      ])('$case', async ({ is_searching, fnMocked }) => {
        const propsData = { is_searching: !is_searching }
        wrapper = shallowMount(TableLeaveReport, { mocks, propsData })

        wrapper.vm.setCurrentPage = mocksFn['setCurrentPage'] = jest.fn()
        wrapper.setProps({ is_searching })
        await wrapper.vm.$nextTick()

        expect(wrapper.vm.helper.is_init).toBeFalsy()
        expect(mocksFn['setCurrentPage'].mock.calls).toEqual(fnMocked['setCurrentPage'].calls)
      })
    })
  })

  describe("methods", () => {
    beforeEach(() => {
      wrapper = shallowMount(TableLeaveReport, { mocks })
    })

    it("once passApprovalToParent called, should emit 'approval' with given params", () => {
      wrapper.vm.passApprovalToParent(formattedData[0], "1_APPROVED")

      expect(wrapper.emitted("approval")).toEqual([[formattedData[0], "1_APPROVED"]])
    })

    it("once passPreviewToParent called, should emit 'preview' with given params", () => {
      wrapper.vm.passPreviewToParent(formattedData[0], "1_APPROVED")

      expect(wrapper.emitted("preview")).toEqual([[formattedData[0]]])
    })

    describe("setNumber", () => {
      it.each([
        { current_page: 3, per_page: 10, start: 21, total_data: 67, total_pages: 7 },
        { current_page: 2, per_page: 15, start: 16, total_data: 67, total_pages: 5 },
      ])(
        "given current_page=$current_page, per_page=$per_page and total_data=$total_data, should set start=$start and total_pages=$total_pages",
        async ({ current_page, per_page, start, total_data, total_pages }) => {
          wrapper.vm.pagination.current_page = current_page
          wrapper.vm.pagination.per_page = per_page
          wrapper.vm.pagination.total_data = total_data
          await wrapper.vm.$nextTick()

          wrapper.vm.setNumber()
          await wrapper.vm.$nextTick()

          expect(wrapper.vm.pagination.start).toBe(start)
          expect(wrapper.vm.pagination.total_pages).toBe(total_pages)
        })
    })

    it("once setCurrentPage called, should set pagination.current_page and call processGetData", async () => {
      wrapper.vm.processGetData = mocksFn['processGetData'] = jest.fn()

      const page = 3
      await wrapper.vm.setCurrentPage(page)

      expect(wrapper.vm.pagination.current_page).toBe(page)
      expect(mocksFn['processGetData'].mock.calls).toEqual([[]])
    })

    describe("getPayloadGetData", () => {
      it.each([
        {
          case: "given no officer, no leave_type and no leave_reason, should return basic payload",
          propsData: { month: "2023-08" }, payload: payloadGetBasic
        }, {
          case: "given filled officer, should return payload with officer_id filter",
          propsData: { month: "2023-08", officer: [{ id: "xx1-xx2-xx3-xx4" }] }, payload: payloadGetWithOfficer
        }, {
          case: "given filled leave_type, should return payload with leave_type filter",
          propsData: { month: "2023-08", leave_type: ["PERMISSION", "SICK"] }, payload: payloadGetWithLeaveType
        }, {
          case: "given filled leave_reason, should return payload with leave_reason filter",
          propsData: { month: "2023-08", leave_type: ["LEAVE"], leave_reason: ["BIRTH", "FUNERAL"] }, payload: payloadGetWithLeaveReason
        }
      ])("$case", async ({ propsData, payload }) => {
        wrapper.vm.$utility.getSpotId = mocksFn['$utility.getSpotId'] = jest.fn().mockReturnValueOnce(spotId)

        wrapper.setProps(propsData)
        await wrapper.vm.$nextTick()

        const receviedPayload = wrapper.vm.getPayloadGetData()
        expect(receviedPayload).toEqual(payload)
      })
    })

    it("once formatContentReport called, should return formatted data", async () => {
      mocksFn['$utility.formatDateMoment'] = jest.fn()
      formattedData.forEach(row => {
        mocksFn['$utility.formatDateMoment'] = mocksFn['$utility.formatDateMoment']
          .mockReturnValueOnce(row.leave_start)
          .mockReturnValueOnce(row.leave_end)
      })
      wrapper.vm.$utility.formatDateMoment = mocksFn['$utility.formatDateMoment']
      const receivedData = wrapper.vm.formatContentReport(getReport.values)

      expect(receivedData).toEqual(formattedData)
    })

    it("once processGetData called, should call getPayloadGetData, getLeaveReport, passFormatDownloadReport and setNumber", async () => {
      wrapper.vm.getPayloadGetData = mocksFn['getPayloadGetData'] = jest.fn().mockReturnValueOnce(payloadGetBasic)
      wrapper.vm.getLeaveReport = mocksFn['getLeaveReport'] = jest.fn().mockReturnValueOnce(getReport)
      wrapper.vm.passFormatDownloadReport = mocksFn['passFormatDownloadReport'] = jest.fn()
      wrapper.vm.setNumber = mocksFn['setNumber'] = jest.fn()

      await wrapper.vm.processGetData()

      expect(mocksFn['getPayloadGetData'].mock.calls).toEqual([[]])
      expect(mocksFn['getLeaveReport'].mock.calls).toEqual([[payloadGetBasic]])
      expect(mocksFn['passFormatDownloadReport'].mock.calls).toEqual([[getReport.values]])
      expect(mocksFn['setNumber'].mock.calls).toEqual([[]])
      expect(wrapper.vm.pagination.total_data).toEqual(getReport.total_values)
    })
  })
})