import { createLocalVue, shallowMount } from "@vue/test-utils"
import BootstrapVue from "bootstrap-vue"
import TableAttendanceReport from "@/components/organisms/report/attendance/TableAttendanceReport"
import { dataGetReport, formattedReport, payloadGet } from "./mock"

const localVue = createLocalVue()
localVue.use(BootstrapVue)

let wrapper

const mocks = {
  $utility: {
    formatLocalTimezone() { },
    getSpotId() { },
    setErrorContextSentry() { },
    getAssetUrl() { }
  },
  $sentry: {
    captureMessage() { }
  }
}

describe("unit.TableAttendanceReport.vue", () => {
  let mocksFn = {}

  beforeEach(() => {
    mocksFn = {}
    mocksFn['processGetData'] = jest.spyOn(TableAttendanceReport.methods, 'processGetData').mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe("test, mounted lifecycle", () => {
    it.each([
      { case: "given is_searching true, should call processGetData", is_searching: true, fnMocked: { processGetData: { calls: [[]] } } },
      { case: "given is_searching false, shouldn't call processGetData", is_searching: false, fnMocked: { processGetData: { calls: [] } } }
    ])('$case', async ({ is_searching, fnMocked }) => {
      wrapper = shallowMount(TableAttendanceReport, { localVue, mocks, propsData: { is_searching } })
      expect(mocksFn['processGetData'].mock.calls).toEqual(fnMocked['processGetData'].calls)
    })
  })

  describe("test watch", () => {

    describe("test watch is_searching", () => {
      it.each([
        {
          case: "given is_searching changes from false to true, should call passUpdatePagination",
          is_searching: true, fnMocked: { passUpdatePagination: { calls: [[1]] } }
        },
        {
          case: "given is_searching changes from true to false, should not call passUpdatePagination",
          is_searching: false, fnMocked: { passUpdatePagination: { calls: [] } }
        }
      ])('$case', async ({ is_searching, fnMocked }) => {
        // preparing test environment
        wrapper = shallowMount(TableAttendanceReport, { localVue, mocks, propsData: { is_searching: !is_searching } })
        wrapper.vm.passUpdatePagination = mocksFn['passUpdatePagination'] = jest.fn()

        // test
        wrapper.setProps({ is_searching })
        await wrapper.vm.$nextTick()

        // expectation
        expect(mocksFn['passUpdatePagination'].mock.calls).toEqual(fnMocked['passUpdatePagination'].calls)
      })
    })
  })

  describe("test watch", () => {
    beforeEach(() => {
      wrapper = shallowMount(TableAttendanceReport, { localVue, mocks })
    })

    it("once passUpdatePagination called, should set value of pagination.current_page and call processGetData", async () => {
      wrapper.vm.processGetData = mocksFn['processGetData'] = jest.fn()

      const page = 3
      await wrapper.vm.passUpdatePagination(page)

      expect(wrapper.vm.pagination.current_page).toBe(page)
      expect(mocksFn['processGetData'].mock.calls).toEqual([[]])
    })

    it("once setPayloadGet called, should return proper payload to get report data", async () => {
      wrapper.vm.$utility.getSpotId = mocksFn['$utility.getSpotId'] = jest.fn().mockReturnValueOnce(payloadGet.filter[1].value)
      wrapper.setProps({ month: payloadGet.filter[0].value })
      await wrapper.vm.$nextTick()
      wrapper.vm.pagination.current_page = payloadGet.filter[2].value
      wrapper.vm.pagination.per_page = payloadGet.filter[3].value
      await wrapper.vm.$nextTick()

      const payload = wrapper.vm.setPayloadGet()
      expect(mocksFn['$utility.getSpotId']).toHaveBeenCalled()
      expect(payload).toEqual(payloadGet)
    })

    it("once setNumber, should set value of pagination.start correctly", async () => {
      wrapper.vm.pagination.current_page = 2
      wrapper.vm.pagination.per_page = 10
      await wrapper.vm.$nextTick()

      wrapper.vm.setNumber()

      expect(wrapper.vm.pagination.start).toBe(11)

      wrapper.vm.pagination.current_page = 4
      wrapper.vm.pagination.per_page = 15
      await wrapper.vm.$nextTick()

      wrapper.vm.setNumber()

      expect(wrapper.vm.pagination.start).toBe(46)
    })

    it("once resetSelectedData called, should set selected_data to {}", async () => {
      const mockedSelectedData = { id: "g812....-71h2-....-19nl-....-kno3...." }
      wrapper.vm.selected_data = mockedSelectedData
      await wrapper.vm.$nextTick()

      wrapper.vm.resetSelectedData()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.selected_data).toEqual({})
      expect(wrapper.vm.selected_data).not.toEqual(mockedSelectedData)
    })

    it("once toggleModalImage called, should toggle value of modal.modal_image", () => {
      const mockedSelectedData = { id: "g812....-71h2-....-19nl-....-kno3...." }
      wrapper.vm.toggleModalImage(mockedSelectedData)

      expect(wrapper.vm.selected_data).toEqual(mockedSelectedData)
      expect(wrapper.vm.modal.modal_image).toBeTruthy()

      wrapper.vm.toggleModalImage()

      expect(wrapper.vm.selected_data).toEqual({})
      expect(wrapper.vm.modal.modal_image).toBeFalsy()
    })

    describe("test formatShownReport", () => {
      it.each([
        {
          case: "given data.rows.length > 0, should call formatContentReport",
          rows: dataGetReport.rows, report: formattedReport, fnMocked: { formatContentReport: { calls: [[dataGetReport.rows]] } }
        },
        {
          case: "given data.rows.length == 0, shouldn't call formatContentReport",
          rows: [], report: [], fnMocked: { formatContentReport: { calls: [] } }
        }
      ])('$case', async ({ rows, report, fnMocked }) => {
        wrapper.vm.formatContentReport = mocksFn['formatContentReport'] = jest.fn().mockReturnValueOnce(report)
        wrapper.vm.data.rows = rows
        wrapper.vm.$nextTick()

        wrapper.vm.formatShownReport()

        expect(mocksFn['formatContentReport'].mock.calls).toEqual(fnMocked['formatContentReport'].calls)
        expect(wrapper.vm.report).toEqual(report)
      })
    })

    it("once formatContentReport called, should format data correctly", () => {
      mocksFn['$utility.formatLocalTimezone'] = jest.fn()

      formattedReport.forEach(row => {
        mocksFn['$utility.formatLocalTimezone'] = mocksFn['$utility.formatLocalTimezone']
          .mockReturnValueOnce(row.timestamp).mockReturnValueOnce(row.timestamp_out)
      })

      wrapper.vm.$utility.formatLocalTimezone = mocksFn['$utility.formatLocalTimezone']

      const formatted = wrapper.vm.formatContentReport(dataGetReport.rows)

      expect(formatted).toEqual(formattedReport)
    })

    it("once processGetData called, should call getAttendanceReport with proper payload", async () => {
      wrapper.vm.setPayloadGet = mocksFn['setPayloadGet'] = jest.fn().mockReturnValueOnce(payloadGet)
      wrapper.vm.getAttendanceReport = mocksFn['getAttendanceReport'] = jest.fn().mockReturnValueOnce(dataGetReport)
      wrapper.vm.formatShownReport = mocksFn['formatShownReport'] = jest.fn()
      wrapper.vm.setNumber = mocksFn['setNumber'] = jest.fn()

      mocksFn['processGetData'].mockRestore()
      wrapper.vm.processGetData = TableAttendanceReport.methods.processGetData

      await wrapper.vm.processGetData()

      expect(mocksFn['setPayloadGet'].mock.calls).toEqual([[]])
      expect(mocksFn['getAttendanceReport'].mock.calls).toEqual([[payloadGet]])
      expect(wrapper.vm.helper.last_sync).toBe(dataGetReport.last_sync)
      expect(wrapper.vm.data.rows).toBe(dataGetReport.rows)
      expect(wrapper.vm.pagination.total_data).toBe(dataGetReport.total)
      expect(mocksFn['formatShownReport'].mock.calls).toEqual([[]])
      expect(mocksFn['setNumber'].mock.calls).toEqual([[]])
      expect(wrapper.emitted("ready")).toEqual([[dataGetReport.total]])
    })
  })
})