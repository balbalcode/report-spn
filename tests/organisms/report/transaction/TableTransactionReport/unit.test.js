import { shallowMount, createLocalVue } from "@vue/test-utils";
import { BToast, VBTooltip } from "bootstrap-vue";

import TableTransactionReport from "@/components/organisms/report/transaction/TableTransactionReport"
import {
  dataGetReportEmpty, dataGetReportFilled,
  detailNoImage, detailNoImageIn, detailNoImageOut,
  filterDefault, filterWithOfficer, filterWithProduct, filterWithStatus,
  payloadDetailEmpty, payloadDetailNoImage, payloadDetailNoImageIn, payloadDetailNoImageOut,
  payloadGetDefault, payloadGetWithOfficer, payloadGetWithProduct, payloadGetWithStatus,
  reportFilled, vehicleMap, spotId, filterWithVehicle, payloadGetWithVehicle
} from "./mock";

const localVue = createLocalVue()
localVue.component('b-toast', BToast)
localVue.directive('b-tooltip', VBTooltip)

const mocks = {
  $utility: {
    formatLocalTimezone: () => "",
    getVehicleMap: () => ({}),
    getSpotId: () => "",
    formatListParameterPayload: () => "",
    formatLocalTimezone: () => "",
    dateUTCToLocal: () => "",
    convertToRupiah: () => "",
    setErrorContextSentry() { },
    getAssetUrl: () => "",
    getSpotInfo: () => {
      return {
        features:  ["LPR"]
      }
    },
  },
  $sentry: { captureMessage() { } },
  $route: { path: "/page" },
  $bvToast: {
    hide() { }
  }
}

let wrapper
let mocksFn = {}

describe("unit.TableTransactionReport.vue", () => {
  beforeEach(() => {
    mocks.$utility.getVehicleMap = mocksFn['$utility.getVehicleMap'] = jest.fn().mockReturnValueOnce(vehicleMap)
    mocksFn['processGetData'] = jest.spyOn(TableTransactionReport.methods, 'processGetData').mockImplementation()
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  describe("test mounted lifecycle", () => {
    it.each([
      {
        case: "given is_searching true, should call processGetData",
        is_searching: true, fnMocked: { processGetData: { calls: [[]] } }
      },
      {
        case: "given is_searching false, shouldn't call processGetData",
        is_searching: false, fnMocked: { processGetData: { calls: [] } }
      }
    ])('$case', async ({ is_searching, fnMocked }) => {
      mocksFn['formatTableReport'] = jest.spyOn(TableTransactionReport.methods, 'formatTableReport').mockImplementation()
      wrapper = shallowMount(TableTransactionReport, { localVue, mocks, propsData: { is_searching: is_searching } })
      await wrapper.vm.$nextTick()

      expect(mocksFn['$utility.getVehicleMap'].mock.calls).toEqual([[]])
      expect(mocksFn['formatTableReport'].mock.calls).toEqual([[]])
      expect(wrapper.vm.vehicle_map).toEqual(vehicleMap)
      expect(mocksFn['processGetData'].mock.calls).toEqual(fnMocked['processGetData'].calls)
    })
  })

  describe("test watch", () => {
    describe("is_searching", () => {
      it.each([
        {
          case: "given is_searching false, shouldn't call processGetData",
          is_searching: false, fnMocked: { processGetData: { calls: [] } }
        }, {
          case: "given is_searching true, should call processGetData",
          is_searching: true, fnMocked: { processGetData: { calls: [[]] } }
        }
      ])('$case', async ({ is_searching, fnMocked }) => {
        // set is_searching to the opposite value
        wrapper = shallowMount(TableTransactionReport, { localVue, mocks, propsData: { is_searching: is_searching } })
        await wrapper.vm.$nextTick()

        // reset mocksFn['processGetData'] after mounted
        wrapper.vm.processGetData = mocksFn['processGetData'] = jest.fn()

        // set is_searching to the desired value to trigger watch
        wrapper.setProps({ is_searching })
        await wrapper.vm.$nextTick()

        expect(mocksFn['processGetData'].mock.calls).toEqual(fnMocked['processGetData'].calls)
      })
    })
  })

  describe("test computed", () => {
    it("test computed filter_title, should return appropiate filter title", async () => {
      wrapper.vm.report = reportFilled
      wrapper.vm.pagination.start = 33
      wrapper.vm.pagination.total_data = 80
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.filter_title).toContain("33-34")
      expect(wrapper.vm.filter_title).toContain("80")

      wrapper.vm.pagination.start = 1
      wrapper.vm.pagination.total_data = 16
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.filter_title).toContain("1-2")
      expect(wrapper.vm.filter_title).toContain("16")
    })
  })

  describe("test methods", () => {
    beforeEach(() => {
      wrapper = shallowMount(TableTransactionReport, { localVue, mocks })
    })

    it("once passUpdatePagination called, should set pagination.current_page, set pagination.start and call processGetData", async () => {
      // reset mocksFn['processGetData'] after mounted
      wrapper.vm.processGetData = mocksFn['processGetData'] = jest.fn()

      await wrapper.vm.passUpdatePagination(2)

      expect(wrapper.vm.pagination.current_page).toBe(2)
      expect(wrapper.vm.pagination.start).toBe(11)
      expect(mocksFn['processGetData'].mock.calls).toEqual([[]])
    })

    describe("passDetailToParent", () => {
      it.each([
        {
          case: "given data empty object, should set image_list.image_url to [''] and set image_list.image_out_url to ['']",
          data: {}, payload: payloadDetailEmpty
        }, {
          case: "given image_list undefined, should set image_list.image_url to [''] and set image_list.image_out_url to ['']",
          data: detailNoImage, payload: payloadDetailNoImage
        }, {
          case: "given image_list.image_url undefined, should set image_list.image_url to ['']",
          data: detailNoImageIn, payload: payloadDetailNoImageIn
        }, {
          case: "given image_list.image__out_url undefined, should set image_list.image__out_url to ['']",
          data: detailNoImageOut, payload: payloadDetailNoImageOut
        }, {
          case: "given image_list.image_url empty array, should set image_list.image_url to ['']",
          data: detailNoImageIn, payload: payloadDetailNoImageIn
        }, {
          case: "given image_list.image__out_url empty array, should set image_list.image__out_url to ['']",
          data: detailNoImageOut, payload: payloadDetailNoImageOut
        }
      ])('$case', ({ data, payload }) => {
        wrapper.vm.passDetailToParent(data)

        expect(wrapper.emitted("detail")).toEqual([[payload]])
      })
    })

    describe("setPayloadGet", () => {
      it.each([
        {
          case: "given empty filter for status, officer, product & vehicle, should return payload which doesn't include on of those filter",
          filter: filterDefault, payload: payloadGetDefault,
          fnMocked: { '$utility.formatListParameterPayload': { calls: [] } }
        },
        {
          case: "given filter status, should return payload which include status filter",
          filter: filterWithStatus, payload: payloadGetWithStatus,
          fnMocked: { '$utility.formatListParameterPayload': { calls: [] } }
        },
        {
          case: "given filter officer, should return payload which include officer filter",
          filter: filterWithOfficer, payload: payloadGetWithOfficer,
          fnMocked: { '$utility.formatListParameterPayload': { calls: [] } }
        },
        {
          case: "given filter vehicle, should return payload which include vehicle filter",
          filter: filterWithVehicle, payload: payloadGetWithVehicle,
          fnMocked: {
            '$utility.formatListParameterPayload': {
              calls: [[filterWithVehicle.vehicle, 'value']],
              returnValue: payloadGetWithVehicle.filter[6].value
            }
          }
        },
        {
          case: "given filter product, should return payload which include product filter",
          filter: filterWithProduct, payload: payloadGetWithProduct,
          fnMocked: {
            '$utility.formatListParameterPayload': {
              calls: [[filterWithProduct.product, 'value']],
              returnValue: payloadGetWithProduct.filter[6].value
            }
          }
        }
      ])('$case', async ({ filter, payload, fnMocked }) => {
        wrapper.vm.$utility.getSpotId = mocksFn['$utility.getSpotId'] = jest.fn().mockReturnValueOnce(spotId)
        wrapper.vm.$utility.formatListParameterPayload = mocksFn['$utility.formatListParameterPayload'] =
          jest.fn().mockReturnValueOnce(fnMocked['$utility.formatListParameterPayload'].returnValue)

        wrapper.setProps({
          date: filter.date, time_range: filter.time_range,
          vehicle: filter.vehicle, product: filter.product,
          officer: filter.officer, status: filter.status
        })
        await wrapper.vm.$nextTick()

        expect(wrapper.vm.setPayloadGet()).toEqual(payload)
        expect(mocksFn['$utility.getSpotId'].mock.calls).toEqual([[]])
        expect(mocksFn['$utility.formatListParameterPayload'].mock.calls)
          .toEqual(fnMocked['$utility.formatListParameterPayload'].calls)
      })
    })
    
    test("test function formatTableReport when report has lpr feature, should set value helper lpr field to true", async () =>{
      jest.resetAllMocks()
    jest.clearAllMocks()
    jest.restoreAllMocks()
      wrapper.vm.$utility.getSpotInfo = mocksFn["getSpotInfo"] = jest.fn().mockReturnValue({
        features:  ["LPR"]
      });
      wrapper.vm.formatTableReport();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.helper.lpr_field).toEqual(true);
      
    })
    test("test function formatTableReport when report hasnt lpr feature, should set value helper lpr field to false", async () =>{
      jest.resetAllMocks()
    jest.clearAllMocks()
    jest.restoreAllMocks()
      wrapper.vm.$utility.getSpotInfo = mocksFn["getSpotInfo"] = jest.fn().mockReturnValue({
        features:  ["AUTO_FINISH"]
      });
      wrapper.vm.formatTableReport();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.helper.lpr_field).toEqual(false);
    })

    it("once formatContentReport called, should return formatted report properly", () => {
      mocksFn['$utility.formatLocalTimezone'] = jest.fn()
      mocksFn['$utility.dateUTCToLocal'] = jest.fn()
      mocksFn['$utility.convertToRupiah'] = jest.fn()

      reportFilled.forEach(row => {
        mocksFn['$utility.formatLocalTimezone'] = mocksFn['$utility.formatLocalTimezone']
          .mockReturnValueOnce(row.time_in).mockReturnValueOnce(row.ref_time_in)
          .mockReturnValueOnce(row.time_out).mockReturnValueOnce(row.ref_time_out)
        mocksFn['$utility.dateUTCToLocal'] = mocksFn['$utility.dateUTCToLocal'].mockReturnValueOnce(row.paid_at)
        mocksFn['$utility.convertToRupiah'] = mocksFn['$utility.convertToRupiah'].mockReturnValueOnce(row.amount)
        row.predict_in_accuracy = 0;
        row.predict_in_license_plate = "-";
        row.predict_in_vehicle = "-";
        row.predict_out_accuracy = "-";
        row.predict_out_license_plate = "-";
        row.predict_out_vehicle = "-";
      })

      wrapper.vm.$utility.formatLocalTimezone = mocksFn['$utility.formatLocalTimezone']
      wrapper.vm.$utility.dateUTCToLocal = mocksFn['$utility.dateUTCToLocal']
      wrapper.vm.$utility.convertToRupiah = mocksFn['$utility.convertToRupiah']

      const receivedFormattedReport = wrapper.vm.formatContentReport(dataGetReportFilled.rows)

      expect(receivedFormattedReport).toEqual(reportFilled)
    })

    describe("processGetData", () => {
      it.each([
        {
          case: "given data.rows empty, should set report to empty array", data: dataGetReportEmpty,
          report: [], fnMocked: { formatContentReport: { calls: [] } }
        }, {
          case: "given data.rows filled, should set report to returned value from formatContentReport",
          data: dataGetReportFilled, report: reportFilled,
          fnMocked: { formatContentReport: { calls: [[dataGetReportFilled.rows]] } }
        }
      ])('$case', async ({ data, report, fnMocked }) => {
        wrapper.vm.setPayloadGet = mocksFn['setPayloadGet'] = jest.fn().mockReturnValueOnce(payloadGetDefault)
        wrapper.vm.getTransactionReport = mocksFn['getTransactionReport'] = jest.fn().mockReturnValueOnce(data)
        wrapper.vm.formatContentReport = mocksFn['formatContentReport'] = jest.fn().mockReturnValueOnce(report)
        wrapper.vm.passDetailToParent = mocksFn['passDetailToParent'] = jest.fn()

        mocksFn['processGetData'].mockRestore()
        wrapper.vm.processGetData = TableTransactionReport.methods.processGetData

        await wrapper.vm.processGetData()

        expect(mocksFn['setPayloadGet'].mock.calls).toEqual([[]])
        expect(mocksFn['getTransactionReport'].mock.calls).toEqual([[payloadGetDefault]])
        expect(mocksFn['formatContentReport'].mock.calls).toEqual(fnMocked['formatContentReport'].calls)
        expect(mocksFn['passDetailToParent'].mock.calls).toEqual([[{}]])
        expect(wrapper.vm.report).toEqual(report)
        expect(wrapper.vm.pagination.total_data).toBe(data.total)
        expect(wrapper.vm.helper.last_sync).toBe(data.last_sync)
      })
    })
  })
})
