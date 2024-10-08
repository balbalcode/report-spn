import { shallowMount, createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import TableAdministrationReportChangePeriod from "@/components/organisms/report/administration/table/TableAdministrationReportChangePeriod";
import { dataGetAdministrationReport, payloadGet, reportContent, reportHeader } from "./mock";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

let wrapper;
const mocks = {
  $utility: {
    getSpotId() { },
    getSpotMembershipType() { },
    getAssetUrl() { },
    dateUTCToLocal() { },
    formatLocalTimezone() { },
    setErrorContextSentry() { }
  },
  $sentry: {
    captureMessage() { }
  }
}

describe("unit.TableAdministrationReportChangePeriod.vue", () => {
  let mocksFn = {}

  beforeEach(() => {
    mocksFn = {}
    mocksFn['setMemberType'] = jest.spyOn(TableAdministrationReportChangePeriod.methods, 'setMemberType').mockImplementation()
    mocksFn['processGetData'] = jest.spyOn(TableAdministrationReportChangePeriod.methods, 'processGetData').mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe("test mounted lifecycle", () => {
    it.each([
      { case: "given is_searching false, should not call processGetData", is_searching: false, fnMocked: { processGetData: { calls: [] } } },
      { case: "given is_searching true, should call processGetData", is_searching: true, fnMocked: { processGetData: { calls: [[]] } } }
    ])('$case', async ({ is_searching, fnMocked }) => {
      wrapper = shallowMount(TableAdministrationReportChangePeriod, { localVue, mocks, propsData: { is_searching } })
      await wrapper.vm.$nextTick()

      expect(mocksFn['setMemberType']).toHaveBeenCalled()
      expect(mocksFn['processGetData'].mock.calls).toEqual(fnMocked['processGetData'].calls)
    })
  })

  describe("test watch", () => {
    it.each([
      { case: "given is_searching false, once changed to true, should call processGetData", is_searching: false, fnMocked: { processGetData: { calls: [[]] } } },
      { case: "given is_searching true, once changed to false, should not call processGetData", is_searching: true, fnMocked: { processGetData: { calls: [] } } }
    ])('$case', async ({ is_searching, fnMocked }) => {
      wrapper = shallowMount(TableAdministrationReportChangePeriod, { localVue, mocks, propsData: { is_searching } })
      await wrapper.vm.$nextTick()

      wrapper.vm.processGetData = mocksFn['processGetData'] = jest.fn()
      wrapper.setProps({ is_searching: !is_searching })
      await wrapper.vm.$nextTick()

      expect(mocksFn['processGetData'].mock.calls).toEqual(fnMocked['processGetData'].calls)
    })
  })

  describe("test methods", () => {
    beforeEach(() => {
      const propsData = { is_searching: false, month: "2023-01", administration: { text: "Ganti Periode", value: "CHANGE_PERIOD" } }
      wrapper = shallowMount(TableAdministrationReportChangePeriod, { localVue, mocks, propsData })
    })

    it("once setPayloadGet called, should return proper payload for getting data", async () => {
      wrapper.vm.$utility.getSpotId = mocksFn['$utility.getSpotId'] = jest.fn().mockReturnValueOnce(payloadGet.filter[1].value)
      wrapper.vm.membership_type = "CARD"
      await wrapper.vm.$nextTick()

      const received_payload = wrapper.vm.setPayloadGet()

      expect(mocksFn['$utility.getSpotId']).toHaveBeenCalled()
      expect(received_payload).toEqual(payloadGet)
    })

    it("once setMemberType called, should set membership_type with value from $utility.getSpotMembershipType", async () => {
      const mockMemberType = "CARD"
      mocksFn['setMemberType'].mockRestore()
      wrapper.vm.setMemberType = TableAdministrationReportChangePeriod.methods.setMemberType
      wrapper.vm.$utility.getSpotMembershipType = mocksFn['$utility.getSpotMembershipType'] = jest.fn().mockReturnValueOnce(mockMemberType)

      await wrapper.vm.setMemberType()

      expect(mocksFn['$utility.getSpotMembershipType']).toHaveBeenCalled()
      expect(wrapper.vm.membership_type).toMatch(mockMemberType)
    })

    it("once passFormatDownloadReport called, should emit ready with proper payload", async () => {
      wrapper.vm.formatContentReport = mocksFn['formatContentReport'] = jest.fn().mockReturnValueOnce(reportContent)
      wrapper.vm.formatHeaderReport = mocksFn['formatHeaderReport'] = jest.fn().mockReturnValueOnce(reportHeader)

      wrapper.vm.data = dataGetAdministrationReport
      await wrapper.vm.$nextTick()
      wrapper.vm.passFormatDownloadReport()
      await wrapper.vm.$nextTick()

      expect(mocksFn['formatContentReport']).toHaveBeenCalled()
      expect(mocksFn['formatHeaderReport']).toHaveBeenCalled()
      expect(wrapper.vm.report).toEqual(reportContent)
      const payload = { header: reportHeader, content: reportContent }
      expect(wrapper.emitted("ready")).toEqual([[payload]])
    })

    it("once formatHeaderReport called, should return expected header", () => {
      const header = wrapper.vm.formatHeaderReport()

      expect(header).toEqual(reportHeader)
    })

    it("once formatContentReport called, should return expected content", async () => {
      mocksFn['$utility.dateUTCToLocal'] = jest.fn()
      mocksFn['$utility.formatLocalTimezone'] = jest.fn()

      reportContent.forEach(row => {
        mocksFn['$utility.dateUTCToLocal'] = mocksFn['$utility.dateUTCToLocal'].mockReturnValueOnce(row.date)
        mocksFn['$utility.formatLocalTimezone'] = mocksFn['$utility.formatLocalTimezone'].mockReturnValueOnce(row.previous_end_date)
        mocksFn['$utility.formatLocalTimezone'] = mocksFn['$utility.formatLocalTimezone'].mockReturnValueOnce(row.updated_end_date)
      })

      wrapper.vm.$utility.dateUTCToLocal = mocksFn['$utility.dateUTCToLocal']
      wrapper.vm.$utility.formatLocalTimezone = mocksFn['$utility.formatLocalTimezone']

      wrapper.vm.data = dataGetAdministrationReport
      await wrapper.vm.$nextTick()

      const content = wrapper.vm.formatContentReport()

      expect(content).toEqual(reportContent)
    })

    it("once processGetData called, should call setPayloadGet, getAdministrationReport, passFormatDownloadReport", async () => {
      wrapper.vm.setPayloadGet = mocksFn['setPayloadGet'] = jest.fn().mockReturnValueOnce(payloadGet)
      wrapper.vm.getAdministrationReport = mocksFn['getAdministrationReport'] = jest.fn().mockReturnValueOnce(dataGetAdministrationReport)
      wrapper.vm.passFormatDownloadReport = mocksFn['passFormatDownloadReport'] = jest.fn()
      mocksFn['processGetData'].mockRestore()
      wrapper.vm.processGetData = TableAdministrationReportChangePeriod.methods.processGetData

      await wrapper.vm.processGetData()

      expect(mocksFn['setPayloadGet']).toHaveBeenCalled()
      expect(mocksFn['getAdministrationReport'].mock.calls).toEqual([[payloadGet]])
      expect(wrapper.vm.data).toEqual(dataGetAdministrationReport)
      expect(mocksFn['passFormatDownloadReport']).toHaveBeenCalled()
    })
  })
})