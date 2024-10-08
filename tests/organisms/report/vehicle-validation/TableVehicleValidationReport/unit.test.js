import { shallowMount, createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import TableVehicleValidationReport from "@/components/organisms/report/vehicle-validation/TableVehicleValidationReport";
import { dataGetReport, fullVehicleMap, payloadGetReport, payloadGetReportMember, payloadGetReportMemberIn, payloadGetReportNonMember, realVehicleMap, reportArray } from "./mock";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

let wrapper;
var mocks = {
  $utility: {
    getSpotId() { },
    getAssetUrl() { },
    getVehicleMap() { },
    formatLocalTimezone() { },
    convertToRupiah() { },
    dateUTCToLocal() { },
    setErrorContextSentry() { }
  },
  $sentry: {
    captureMessage() { },
  },
};

describe("unit.TableVehicleValidationReport.vue", () => {
  let mocksFn = {};

  beforeEach(() => {
    mocksFn = {}
    mocksFn["setVehicleMap"] = jest
      .spyOn(TableVehicleValidationReport.methods, "setVehicleMap").mockImplementation();
    mocksFn["processGetData"] = jest
      .spyOn(TableVehicleValidationReport.methods, "processGetData").mockImplementation();
    wrapper = shallowMount(TableVehicleValidationReport, { localVue, mocks })
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it("test mounted lifecycle, should call $utility.getVehicleMap and processGetData", () => {
    expect(mocksFn['setVehicleMap']).toHaveBeenCalled()
    expect(mocksFn['processGetData']).toHaveBeenCalled()
  })

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
      wrapper.setProps({ is_searching: !is_searching })
      wrapper.vm.passUpdatePagination = mocksFn['passUpdatePagination'] = jest.fn()
      wrapper.vm.processGetData = mocksFn['processGetData'] = jest.fn()

      // test
      wrapper.setProps({ is_searching })
      await wrapper.vm.$nextTick()

      // expectation
      expect(mocksFn['passUpdatePagination'].mock.calls).toEqual(fnMocked['passUpdatePagination'].calls)
    })
  })

  it("test computed filter_title, should return appropiate filter title", async () => {
    wrapper.vm.report = reportArray
    wrapper.vm.pagination.start = 33
    wrapper.vm.pagination.total_data = 80
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.filter_title).toContain("33-36")
    expect(wrapper.vm.filter_title).toContain("80")

    wrapper.vm.pagination.start = 1
    wrapper.vm.pagination.total_data = 16
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.filter_title).toContain("1-4")
    expect(wrapper.vm.filter_title).toContain("16")
  })

  it("once passUpdatePagination called, should set value of pagination.current_page", async () => {
    wrapper.vm.processGetData = mocksFn['processGetData'] = jest.fn()

    await wrapper.vm.passUpdatePagination(3)

    expect(wrapper.vm.pagination.current_page).toBe(3)
    expect(mocksFn['processGetData'].mock.calls).toEqual([[]])
  })

  describe("test setPayloadGet", () => {
    it.each([
      {
        case: "given without transaction_type without gate_type, transaction_type & gate_type shouldn't be included in filter",
        transaction_type: {}, gate_type: {}, expectedPayload: payloadGetReport,
      },
      {
        case: "given transaction_type without gate_type, gate_type shouldn't be included in filter",
        transaction_type: { value: "MEMBER" }, gate_type: {}, expectedPayload: payloadGetReportMember,
      },
      {
        case: "given transaction_type NON_MEMBER with gate_type, gate_type shouldn't be included in filter",
        transaction_type: { value: "NON_MEMBER" }, gate_type: { value: "IN" }, expectedPayload: payloadGetReportNonMember,
      },
      {
        case: "given transaction_type MEMBER with gate_type, gate_type should be included in filter",
        transaction_type: { value: "MEMBER" }, gate_type: { value: "IN" }, expectedPayload: payloadGetReportMemberIn,
      }
    ])('$case', async ({ transaction_type, gate_type, expectedPayload }) => {
      wrapper.vm.$utility.getSpotId = mocksFn['$utility.getSpotId'] = jest.fn().mockReturnValueOnce(expectedPayload.filter[1].value)
      wrapper.setProps({ transaction_type, gate_type, month: expectedPayload.filter[0].value })
      await wrapper.vm.$nextTick()
      wrapper.vm.pagination.current_page = expectedPayload.pagination.current_page
      await wrapper.vm.$nextTick()
      wrapper.vm.pagination.per_page = expectedPayload.pagination.per_page
      await wrapper.vm.$nextTick()

      const payload = wrapper.vm.setPayloadGet()

      expect(mocksFn['$utility.getSpotId'])
      expect(payload).toEqual(expectedPayload)
    })
  })

  it("once setVehicleMap called, should value of vehicle_map", async () => {
    wrapper.vm.$utility.getVehicleMap = mocksFn['$utility.getVehicleMap'] = jest
      .fn().mockReturnValueOnce(realVehicleMap)

    mocksFn['setVehicleMap'].mockRestore()
    wrapper.vm.setVehicleMap = TableVehicleValidationReport.methods.setVehicleMap

    await wrapper.vm.setVehicleMap()

    expect(mocksFn['$utility.getVehicleMap']).toHaveBeenCalled()
    expect(wrapper.vm.vehicle_map).toEqual(fullVehicleMap)
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

  it("once resetSelectedData called, should reset selected_data to {}", () => {
    wrapper.vm.resetSelectedData()

    expect(wrapper.vm.selected_data).toEqual({})
  })

  describe("toggleModalDetail", () => {
    it.each([
      {
        case: "given valid index, should set selected_data with report[index] and modal.detail with true",
        index: 0, selected_data: { ...reportArray[0], index: 0, order: 16 }, detail: true
      }, {
        case: "given invalid index, should set selected_data with {} and modal.detail with false",
        index: 5, selected_data: {}, detail: false
      }
    ])("$case", async ({ index, selected_data, detail }) => {
      wrapper.vm.report = [...reportArray]
      wrapper.vm.pagination.start = 16
      wrapper.vm.pagination.end = 19
      await wrapper.vm.$nextTick()

      wrapper.vm.toggleModalDetail(index)

      expect(wrapper.vm.selected_data).toEqual(selected_data)
      expect(wrapper.vm.modal.detail).toEqual(detail)
    })
  })

  describe("test formatShownReport", () => {
    it.each([
      {
        case: "given data.rows.length > 0, should call formatContentReport",
        rows: dataGetReport.rows, report: reportArray, fnMocked: { formatContentReport: { calls: [[dataGetReport.rows]] } }
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
    mocksFn['$utility.dateUTCToLocal'] = jest.fn()
    mocksFn['$utility.convertToRupiah'] = jest.fn()

    reportArray.forEach(row => {
      mocksFn['$utility.formatLocalTimezone'] = mocksFn['$utility.formatLocalTimezone']
        .mockReturnValueOnce(row.time_in).mockReturnValueOnce(row.time_out)
      mocksFn['$utility.dateUTCToLocal'] = mocksFn['$utility.dateUTCToLocal']
        .mockReturnValueOnce(row.paid_at)
      mocksFn['$utility.convertToRupiah'] = mocksFn['$utility.convertToRupiah']
        .mockReturnValueOnce(row.amount)
    })

    wrapper.vm.$utility.formatLocalTimezone = mocksFn['$utility.formatLocalTimezone']
    wrapper.vm.$utility.dateUTCToLocal = mocksFn['$utility.dateUTCToLocal']
    wrapper.vm.$utility.convertToRupiah = mocksFn['$utility.convertToRupiah']

    wrapper.vm.vehicle_map = fullVehicleMap

    const formatted = wrapper.vm.formatContentReport(dataGetReport.rows)

    expect(formatted).toEqual(reportArray)
  })

  it("once processGetData called, should call getVehicleValidationReport with proper payload", async () => {
    wrapper.vm.setPayloadGet = mocksFn['setPayloadGet'] = jest.fn().mockReturnValueOnce(payloadGetReport)
    wrapper.vm.getVehicleValidationReport = mocksFn['getVehicleValidationReport'] = jest.fn().mockReturnValueOnce(dataGetReport)
    wrapper.vm.formatShownReport = mocksFn['formatShownReport'] = jest.fn()
    wrapper.vm.setNumber = mocksFn['setNumber'] = jest.fn()

    mocksFn['processGetData'].mockRestore()
    wrapper.vm.processGetData = TableVehicleValidationReport.methods.processGetData

    await wrapper.vm.processGetData()

    expect(mocksFn['setPayloadGet'].mock.calls).toEqual([[]])
    expect(mocksFn['getVehicleValidationReport'].mock.calls).toEqual([[payloadGetReport]])
    expect(wrapper.vm.helper.last_sync).toBe(dataGetReport.last_sync)
    expect(wrapper.vm.data.rows).toBe(dataGetReport.rows)
    expect(wrapper.vm.pagination.total_data).toBe(dataGetReport.total)
    expect(mocksFn['formatShownReport'].mock.calls).toEqual([[]])
    expect(mocksFn['setNumber'].mock.calls).toEqual([[]])
  })
});
