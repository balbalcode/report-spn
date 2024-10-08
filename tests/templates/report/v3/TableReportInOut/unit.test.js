import { createLocalVue, shallowMount } from "@vue/test-utils";

import TableReportInOut from "@/components/templates/report/v3/TableReportInOut";
import { parking_access } from "@/constants/v3.report"
import {
  dataReal, dateRange, formattedContent, formattedHeader, getReportData, payloadGetWithType,
  payloadGetWithoutType, type, spotId, vehicles, payloadGetWithVersion, month, formattedTotal, additionalTotal, calculatedTotal,
} from "./mock";
import { BToast } from "bootstrap-vue";

let wrapper;
const localVue = createLocalVue();
localVue.component("b-toast", BToast);

const mocks = {
  $utility: {
    getFormattedVehicle: () => [],
    getSpotId: () => "",
    formatListParameterPayload: () => "",
    formatDateMoment: () => "",
    setErrorContextSentry() { },
    fireToast() { },
    convertToRupiah: () => "",
    formatLocalTimezone: () => "",
    getAssetUrl: () => "",
  },
  $sentry: {
    captureMessage() { },
  },
  $route: {},
};
let mocksFn = {};

describe("unit.TableReportInOut.vue", () => {
  beforeEach(() => {
    mocksFn = {};
    mocksFn['get_report'] = jest.fn()
    mocksFn["setVersion"] = jest.spyOn(TableReportInOut.methods, "setVersion").mockImplementation();
    mocksFn["setBatchReport"] = jest.spyOn(TableReportInOut.methods, "setBatchReport").mockImplementation();
    mocks.$utility.getFormattedVehicle = mocksFn["$utility.getFormattedVehicle"] = jest.fn().mockReturnValueOnce(vehicles);
    wrapper = shallowMount(TableReportInOut, { mocks, localVue, propsData: { get_report: mocksFn['get_report'] } });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("test mounted lifecycle, should set helper.is_init to true and set vehicles with returned data from $utility.getFormattedVehicle", () => {
    expect(mocksFn["setVersion"].mock.calls).toEqual([[]]);
    expect(mocksFn["setBatchReport"].mock.calls).toEqual([[]]);
    expect(wrapper.vm.helper.is_init).toBe(true);
    expect(wrapper.vm.vehicles).toEqual(vehicles);
  });

  describe('test watch is_searching', () => {
    it.each([
      {
        case: "given is_searching changed from false to true and type 'shift', should set helper.batch_size to 1 and call batchReport.gatherData",
        propsData: { is_searching: true, type: 'shift', month }, batchSize: 1,
        fnMocked: {
          'batchReport.setMonth': { calls: [[month]] },
          'batchReport.gatherData': { calls: [[]] },
        }
      }, {
        case: "given is_searching changed from false to true and type 'daily', should set helper.batch_size to 3 and call batchReport.gatherData",
        propsData: { is_searching: true, type: 'daily', month }, batchSize: 3,
        fnMocked: {
          'batchReport.setMonth': { calls: [[month]] },
          'batchReport.gatherData': { calls: [[]] },
        }
      }, {
        case: "given is_searching changed from true to false, shouldn't call batchReport.gatherData",
        propsData: { is_searching: false, month }, batchSize: 3,
        fnMocked: {
          'batchReport.setMonth': { calls: [] },
          'batchReport.gatherData': { calls: [] },
        }
      }
    ])('$case', async ({ propsData, batchSize, fnMocked }) => {
      // preset
      wrapper.vm.batchReport.setMonth = jest.fn()
      wrapper.vm.batchReport.gatherData = jest.fn()

      wrapper.setProps({ is_searching: !propsData.is_searching })
      await wrapper.vm.$nextTick()

      // test
      wrapper.vm.batchReport.setMonth = mocksFn['batchReport.setMonth'] = jest.fn()
      wrapper.vm.batchReport.gatherData = mocksFn['batchReport.gatherData'] = jest.fn()

      wrapper.setProps(propsData)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.batchReport.batchSize).toBe(batchSize)
      expect(mocksFn['batchReport.setMonth'].mock.calls).toEqual(fnMocked['batchReport.setMonth'].calls)
      expect(mocksFn['batchReport.gatherData'].mock.calls).toEqual(fnMocked['batchReport.gatherData'].calls)
    })
  })

  it("once batchReport.loadingBatch get changed, should emit loadingBatch", async () => {
    wrapper.vm.batchReport.loadingBatch = true
    await wrapper.vm.$nextTick()

    wrapper.vm.batchReport.loadingBatch = false
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted("loadingBatch")).toEqual([[true], [false]])
  })

  describe("test setPayloadGetBatch", () => {
    it.each([
      {
        case: "given type filter filled, should return payload which has type",
        type, version: "v4",
        payload: payloadGetWithType,
      },
      {
        case: "given type filter empty, should return payload with type is empty string",
        type: "", version: "v4",
        payload: payloadGetWithoutType,
      },
      {
        case: "given custom version, should return payload with given version",
        type: "", version: "v3",
        payload: payloadGetWithVersion,
      },
    ])("$case", async ({ type, version, payload }) => {
      wrapper.vm.$utility.getSpotId = mocksFn["$utility.getSpotId"] = jest.fn().mockReturnValueOnce(spotId);
      wrapper.setProps({ type, month: "2023-02" });
      wrapper.vm.version = version
      await wrapper.vm.$nextTick();

      const receivedPayload = wrapper.vm.setPayloadGetBatch(`${dateRange[0]}_${dateRange[1]}`);
      expect(receivedPayload).toEqual(payload);
    });
  });

  it("once setBatchReport called, batchReport.getReport and batchReport.concatRows", () => {
    mocksFn['setBatchReport'].mockRestore()
    wrapper.vm.setBatchReport = TableReportInOut.methods.setBatchReport

    wrapper.vm.setBatchReport()

    expect(wrapper.vm.batchReport.getReport).toEqual(wrapper.vm.processGetReport)
    expect(wrapper.vm.batchReport.concatRows).toEqual(wrapper.vm.processConcatData)
  })

  describe("setVersion", () => {
    it.each([
      {
        case: "given $route.query.version empty, version should be v4",
        $route: { query: {} }, version: "v4"
      }, {
        case: "given $route.query.version filled, should set version from $route.query.version",
        $route: { query: { version: "v3" } }, version: "v3"
      }
    ])("$case", async ({ $route, version }) => {
      wrapper.vm.$route = $route
      await wrapper.vm.$nextTick()

      mocksFn['setVersion'].mockRestore()
      wrapper.vm.setVersion = TableReportInOut.methods.setVersion
      wrapper.vm.setVersion()

      expect(wrapper.vm.version).toMatch(version)
    })
  })

  describe("test passFormatDownloadReport", () => {
    it.each([
      {
        case: "given data.rows.length > 0, should call formatContentReport & formatHeaderReport",
        payload: { content: formattedContent, header: formattedHeader },
        rows: [...getReportData.rows],
        fnMocked: {
          formatContentReport: { calls: [[]] },
          formatHeaderReport: { calls: [[]] },
        },
      },
      {
        case: "given data.rows.length == 0, should not call formatContentReport nor formatHeaderReport",
        payload: { content: [], header: {} },
        rows: [],
        fnMocked: {
          formatContentReport: { calls: [] },
          formatHeaderReport: { calls: [] },
        },
      },
    ])("$case", async ({ rows, payload, fnMocked }) => {
      wrapper.vm.formatContentReport = mocksFn["formatContentReport"] = jest
        .fn()
        .mockReturnValueOnce(formattedContent);
      wrapper.vm.formatHeaderReport = mocksFn["formatHeaderReport"] = jest
        .fn()
        .mockReturnValueOnce(formattedHeader);
      wrapper.vm.data.rows = rows;
      await wrapper.vm.$nextTick();

      wrapper.vm.passFormatDownloadReport();
      expect(wrapper.emitted("ready")).toEqual([[payload]]);
      expect(mocksFn["formatContentReport"].mock.calls).toEqual(
        fnMocked["formatContentReport"].calls
      );
      expect(mocksFn["formatHeaderReport"].mock.calls).toEqual(
        fnMocked["formatHeaderReport"].calls
      );
    });
  });

  describe("test formatColumnClass", () => {
    it.each([
      { col_idx: 0, io_idx: 0, vhc_idx: 0, className: "even" },
      { col_idx: 0, io_idx: 0, vhc_idx: 1, className: "odd" },
      { col_idx: 0, io_idx: 1, vhc_idx: 0, className: "even" },
      { col_idx: 0, io_idx: 1, vhc_idx: 1, className: "odd" },
      { col_idx: 1, io_idx: 0, vhc_idx: 0, className: "even" },
      { col_idx: 1, io_idx: 0, vhc_idx: 1, className: "odd" },
      { col_idx: 1, io_idx: 1, vhc_idx: 0, className: "even" },
      { col_idx: 1, io_idx: 1, vhc_idx: 1, className: "odd" },
    ])(
      "given col_idx=$col_idx, io_idx=$io_idx, vhc_idx=$vhc_idx, vehicle.length=2, should return $className",
      ({ col_idx, io_idx, vhc_idx, className }) => {
        const receivedClass = wrapper.vm.formatColumnClass(col_idx, io_idx, vhc_idx);

        expect(receivedClass).toMatch(className);
      }
    );
  });

  it("once formatHeaderReport called, should return valid report header", async () => {
    wrapper.setProps({ vehicle: vehicles, column: parking_access(), parking_access: parking_access() })
    await wrapper.vm.$nextTick()

    const header = wrapper.vm.formatHeaderReport()
    expect(header).toEqual(formattedHeader)
  })

  it("once formatContentReport called, should return valid report content", async () => {
    wrapper.setProps({ vehicle: vehicles, column: parking_access(), parking_access: parking_access() })
    wrapper.vm.data.rows = [...getReportData.rows]
    wrapper.vm.data.total = { ...getReportData.total }
    await wrapper.vm.$nextTick()

    const content = wrapper.vm.formatContentReport()
    expect(content).toEqual(formattedContent)
  })

  it("once processCalculateTotal called, should calculate previous and upcoming total data", async () => {
    wrapper.setProps({ vehicle: vehicles, column: parking_access(), parking_access: parking_access() })
    wrapper.vm.data = { ...dataReal }
    await wrapper.vm.$nextTick()

    wrapper.vm.processCalculateTotal(additionalTotal)

    expect(wrapper.vm.data.total).toEqual(calculatedTotal)
  })

  it.todo("once processConcatData")

  it("once processGetReport called, should call setPayloadGetBatch and get_report", async () => {
    wrapper.vm.setPayloadGetBatch = mocksFn['setPayloadGetBatch'] = jest.fn().mockReturnValueOnce(payloadGetWithType)
    mocksFn['get_report'] = jest.fn().mockReturnValueOnce(dataReal)

    wrapper.setProps({ get_report: mocksFn['get_report'] })
    await wrapper.vm.$nextTick()

    const receivedValue = await wrapper.vm.processGetReport(dateRange)

    expect(mocksFn['setPayloadGetBatch'].mock.calls).toEqual([[dateRange]])
    expect(receivedValue).toEqual(dataReal)
  })
});
