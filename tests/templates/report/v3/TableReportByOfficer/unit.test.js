import { shallowMount } from "@vue/test-utils";

import TableReportByOfficer from "@/components/templates/report/v3/TableReportByOfficer";
import {
  formattedData,
  unformattedData,
  formattedTotal,
  payloadDownload,
  payloadGetBasic,
  payloadGetWithOfficer,
  payloadGetWithVersion,
  responseGet,
  spotId,
  payloadGetWithTimezone,
} from "./mock";

let wrapper;
const mocks = {
  $utility: {
    convertToRupiah: () => "",
    getAssetUrl: () => "",
    setErrorContextSentry: () => {},
  },
  $sentry: {
    captureMessage: () => {},
  },
  $route: {},
};
const id = "test";
let mocksFn = {};

describe("unit.TableReportByOfficer.vue", () => {
  beforeEach(() => {
    mocksFn = {};
    mocksFn["processGetData"] = jest
      .spyOn(TableReportByOfficer.methods, "processGetData")
      .mockImplementation();
    mocksFn["setVersion"] = jest
      .spyOn(TableReportByOfficer.methods, "setVersion")
      .mockImplementation();
    mocksFn["get_report"] = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("mounted lifecycle, should set helper.is_init to true and call setVersion", async () => {
    wrapper = shallowMount(TableReportByOfficer, {
      mocks,
      propsData: { id, get_report: mocksFn["get_report"] },
    });
    expect(mocksFn["setVersion"].mock.calls).toEqual([[]]);
  });

  describe("watch is_searching", () => {
    it.each([
      {
        case: "given is_searching changed to true, should call processGetData",
        is_searching: true,
        fnMocked: { processGetData: { calls: [[]] } },
      },
      {
        case: "given is_searching changed to false, shouldn't call processGetData",
        is_searching: false,
        fnMocked: { processGetData: { calls: [] } },
      },
    ])("$case", async ({ is_searching, fnMocked }) => {
      wrapper = shallowMount(TableReportByOfficer, {
        mocks,
        propsData: {
          id,
          is_searching: !is_searching,
          get_report: mocksFn["get_report"],
        },
      });

      wrapper.vm.processGetData = mocksFn["processGetData"] = jest.fn();
      wrapper.setProps({ is_searching });
      await wrapper.vm.$nextTick();

      expect(mocksFn["processGetData"].mock.calls).toEqual(
        fnMocked["processGetData"].calls
      );
    });
  });

  describe("test methods", () => {
    beforeEach(() => {
      wrapper = shallowMount(TableReportByOfficer, {
        mocks,
        propsData: { id, get_report: mocksFn["get_report"] },
      });
    });

    it("once passUpdatePagination called, should set pagination.current_page with given page and call processGetData", async () => {
      wrapper.vm.processGetData = mocksFn["processGetData"] = jest.fn();

      const page = 3;
      wrapper.vm.passUpdatePagination(page);
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.pagination.current_page).toBe(page);
      expect(mocksFn["processGetData"].mock.calls).toEqual([[]]);
    });

    it("once passFormatDownloadReport called, should emit ready", async () => {
      wrapper.vm.data = [...formattedData];
      wrapper.vm.total = { ...formattedTotal };
      wrapper.vm.pagination = {
        current_page: 1,
        per_page: 50,
        total_data: 100,
      };
      await wrapper.vm.$nextTick();

      wrapper.vm.passFormatDownloadReport();

      expect(wrapper.emitted("ready")).toEqual([[payloadDownload]]);
    });

    describe("getPayloadGet", () => {
      it.each([
        {
          case: "given basic filter, should return basic payload",
          props: { month: "2023-07" },
          version: "v3",
          payload: payloadGetBasic,
          functionCalls: {
            encodeReportFilterUrl: 0,
          },
        },
        {
          case: "given filter officer filled, should return payload with officer filter",
          props: {
            month: "2023-07",
            officer: [{ id: "x-x-x-x" }, { id: "y-y-y-y" }],
          },
          version: "v3",
          payload: payloadGetWithOfficer,
          functionCalls: {
            encodeReportFilterUrl: 1,
          },
        },
        {
          case: "given filter with filled timezone, should return payload with given timezone",
          props: { month: "2023-07", timezone: "Asia/Jakarta" },
          version: "v3",
          payload: payloadGetWithTimezone,
          functionCalls: {
            encodeReportFilterUrl: 0,
          },
        },
        {
          case: "given filter with filled version, should return payload with given version",
          props: { month: "2023-07" },
          version: "v4",
          payload: payloadGetWithVersion,
          functionCalls: {
            encodeReportFilterUrl: 0,
          },
        },
      ])("$case", async ({ props, version, payload, functionCalls }) => {
        wrapper.vm.$utility.getSpotId = mocksFn["$utility.getSpotId"] = jest
          .fn()
          .mockReturnValueOnce(spotId);
        wrapper.vm.$utility.encodeReportFilterUrl = mocksFn[
          "$utility.encodeReportFilterUrl"
        ] = jest.fn().mockReturnValueOnce(payloadGetWithOfficer.filter[4].value);
        wrapper.setProps(props);
        wrapper.vm.version = version;
        await wrapper.vm.$nextTick();

        const receivedPayload = wrapper.vm.getPayloadGet();
        expect(receivedPayload).toEqual(payload);
        expect(mocksFn["$utility.encodeReportFilterUrl"]).toHaveBeenCalledTimes(
          functionCalls.encodeReportFilterUrl
        );
      });
    });

    describe("setVersion", () => {
      it.each([
        {
          case: "given $route.query.version empty, version should be v4",
          $route: { query: {} },
          version: "v4",
        },
        {
          case: "given $route.query.version filled, should set version from $route.query.version",
          $route: { query: { version: "v3" } },
          version: "v3",
        },
      ])("$case", async ({ $route, version }) => {
        wrapper.vm.$route = $route;
        await wrapper.vm.$nextTick();

        mocksFn["setVersion"].mockRestore();
        wrapper.vm.setVersion = TableReportByOfficer.methods.setVersion;
        wrapper.vm.setVersion();

        expect(wrapper.vm.version).toMatch(version);
      });
    });

    it("once formatData called, should set values of data & total also calls function processSortData", async () => {
      mocksFn["$utility.convertToRupiah"] = jest.fn();
      wrapper.vm.processSortData = mocksFn["processSortData"] = jest.fn();
      formattedData.forEach((row) => {
        mocksFn["$utility.convertToRupiah"] = mocksFn[
          "$utility.convertToRupiah"
        ]
          .mockReturnValueOnce(row.casual)
          .mockReturnValueOnce(row.lost_ticket)
          .mockReturnValueOnce(row.total);
      });
      mocksFn["$utility.convertToRupiah"] = mocksFn["$utility.convertToRupiah"]
        .mockReturnValueOnce(formattedTotal.casual)
        .mockReturnValueOnce(formattedTotal.lost_ticket)
        .mockReturnValueOnce(formattedTotal.total);
      wrapper.vm.$utility.convertToRupiah = mocksFn["$utility.convertToRupiah"];

      wrapper.vm.formatData(responseGet.values.rows, responseGet.values.total);
      await wrapper.vm.$nextTick();

      expect(mocksFn["processSortData"]).toHaveBeenCalled();
      expect(wrapper.vm.data).toEqual(formattedData);
      expect(wrapper.vm.total).toEqual(formattedTotal);
    });

    it("once calls processSortData, should sort data list", async () => {
      wrapper.vm.data = unformattedData;
      await wrapper.vm.$nextTick();
      wrapper.vm.processSortData();
      expect(wrapper.vm.data).toEqual(formattedData);
    });

    describe("processGetData", () => {
      it("given no error, should call getPayloadGet, get_report, formatData, passFormatDownloadReport", async () => {
        wrapper.vm.getPayloadGet = mocksFn["getPayloadGet"] = jest
          .fn()
          .mockReturnValueOnce(payloadGetBasic);
        wrapper.vm.formatData = mocksFn["formatData"] = jest.fn();
        wrapper.vm.passFormatDownloadReport = mocksFn[
          "passFormatDownloadReport"
        ] = jest.fn();
        mocksFn["get_report"] = jest.fn().mockReturnValueOnce(responseGet);
        wrapper.setProps({ get_report: mocksFn["get_report"] });
        await wrapper.vm.$nextTick();

        mocksFn["processGetData"].mockRestore();
        wrapper.vm.processGetData = TableReportByOfficer.methods.processGetData;
        await wrapper.vm.processGetData();

        expect(wrapper.vm.pagination.total_data).toBe(responseGet.total_values);
        expect(wrapper.vm.helper.is_error).toBe(false);
        expect(mocksFn["getPayloadGet"].mock.calls).toEqual([[]]);
        expect(mocksFn["get_report"].mock.calls).toEqual([[payloadGetBasic]]);
        expect(mocksFn["formatData"].mock.calls).toEqual([
          [responseGet.values.rows, responseGet.values.total],
        ]);
        expect(mocksFn["passFormatDownloadReport"].mock.calls).toEqual([[]]);
      });

      it("given error, should call set pagination.total_data to 0 and helper.is_error to true", async () => {
        wrapper.vm.getPayloadGet = mocksFn["getPayloadGet"] = jest
          .fn()
          .mockReturnValueOnce(payloadGetBasic);
        wrapper.vm.formatData = mocksFn["formatData"] = jest.fn();
        wrapper.vm.passFormatDownloadReport = mocksFn[
          "passFormatDownloadReport"
        ] = jest.fn();
        mocksFn["get_report"] = jest.fn().mockRejectedValueOnce(new Error());
        wrapper.setProps({ get_report: mocksFn["get_report"] });
        await wrapper.vm.$nextTick();

        mocksFn["processGetData"].mockRestore();
        wrapper.vm.processGetData = TableReportByOfficer.methods.processGetData;
        await wrapper.vm.processGetData();

        expect(wrapper.vm.pagination.total_data).toBe(0);
        expect(wrapper.vm.helper.is_error).toBe(true);
        expect(mocksFn["getPayloadGet"].mock.calls).toEqual([[]]);
        expect(mocksFn["get_report"].mock.calls).toEqual([[payloadGetBasic]]);
        expect(mocksFn["formatData"].mock.calls).toEqual([]);
        expect(mocksFn["passFormatDownloadReport"].mock.calls).toEqual([[]]);
      });
    });
  });
});
