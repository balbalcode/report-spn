import { shallowMount, createLocalVue } from "@vue/test-utils";
import { BToast, VBTooltip } from "bootstrap-vue";

import TableTransactionReport from "@/components/organisms/report/transaction/TableTransactionReport"
import { reportFilled, vehicleMap } from "./mock";

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
    getAssetUrl: () => ""
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
    wrapper = shallowMount(TableTransactionReport, { localVue, mocks })
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it("given report filled, should show each row data on table", async () => {
    wrapper.vm.report = reportFilled
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const tRows = wrapper.findAll("#table-report-transaction tbody tr")
    for (let iRow = 0; iRow < tRows.length; iRow++) {
      const tData = tRows.at(iRow).findAll("td")

      const transaction = wrapper.findComponent({ ref: `row-${iRow}-transaction` })
      expect(transaction.exists()).toBe(true)
      expect(transaction.props("value")).toMatch(reportFilled[iRow].transaction_id)

      const ref_id = wrapper.findComponent({ ref: `row-${iRow}-ref_id` })
      expect(ref_id.exists()).toBe(true)
      expect(ref_id.props("value")).toMatch(reportFilled[iRow].ref_id)

      expect(tData.at(3).text()).toMatch(reportFilled[iRow].license_plate)
      expect(tData.at(4).text()).toMatch(reportFilled[iRow].rf_id)
      expect(tData.at(5).text()).toMatch(reportFilled[iRow].status)
      expect(tData.at(6).text()).toMatch(reportFilled[iRow].time_in)
      expect(tData.at(7).text()).toMatch(reportFilled[iRow].ref_time_in)
      expect(tData.at(8).text()).toMatch(reportFilled[iRow].time_out)
      expect(tData.at(9).text()).toMatch(reportFilled[iRow].ref_time_out)
      expect(tData.at(10).text()).toMatch(reportFilled[iRow].paid_at)
      expect(tData.at(11).text()).toMatch(reportFilled[iRow].officer_name)
      expect(tData.at(12).text()).toMatch(reportFilled[iRow].vehicle_code)
      expect(tData.at(13).text()).toMatch(reportFilled[iRow].product)
      expect(tData.at(14).text()).toMatch(reportFilled[iRow].amount)
    }
  })

  it("trigger click on a row, should call passDetailToParent", async () => {
    wrapper.vm.passDetailToParent = mocksFn['passDetailToParent'] = jest.fn()

    wrapper.vm.report = reportFilled
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const tRows = wrapper.findAll("#table-report-transaction tbody tr")
    
    await tRows.at(1).trigger("click")
    await tRows.at(0).trigger("click")

    expect(mocksFn['passDetailToParent'].mock.calls).toEqual([[reportFilled[1]],[reportFilled[0]]])
  })
})
