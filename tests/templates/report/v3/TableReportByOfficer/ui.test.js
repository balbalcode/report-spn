import { shallowMount } from "@vue/test-utils"

import TableReportByOfficer from "@/components/templates/report/v3/TableReportByOfficer"
import { formattedData, formattedTotal } from "./mock"

let wrapper
const mocks = {
  $utility: {
    convertToRupiah: () => "",
    getAssetUrl: () => "",
    setErrorContextSentry: () => { }
  },
  $sentry: {
    captureMessage: () => { }
  },
  $route: {}
}
const id = "test"
let mocksFn = {}

describe("ui.TableReportByOfficer.vue", () => {
  beforeEach(() => {
    mocksFn = {}
    mocksFn['setVersion'] = jest.spyOn(TableReportByOfficer.methods, "setVersion").mockImplementation()
    mocksFn['get_report'] = jest.fn()
    wrapper = shallowMount(TableReportByOfficer, { mocks, propsData: { id, get_report: mocksFn['get_report'] } })
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it("given data, should show each row of data on table", async () => {
    wrapper.vm.helper.is_init = false
    wrapper.vm.data = [...formattedData]
    wrapper.vm.total = { ...formattedTotal }
    await wrapper.vm.$nextTick()

    const tRows = wrapper.findAll(`table#${id} tbody tr`)
    for (let indexRow = 0; indexRow < formattedData.length; indexRow++) {
      expect(tRows.at(indexRow).exists()).toBe(true)
      const tData = tRows.at(indexRow).findAll("td")

      expect(tData.at(0).text()).toMatch(formattedData[indexRow].shift)
      expect(tData.at(1).text()).toMatch(formattedData[indexRow].officer)
      expect(tData.at(2).text()).toMatch(formattedData[indexRow].casual)
      expect(tData.at(3).text()).toMatch(formattedData[indexRow].lost_ticket)
      expect(tData.at(4).text()).toMatch(formattedData[indexRow].total)
    }

    const tDataTotal = wrapper.findAll(`table#${id} tfoot tr th`)
    expect(tDataTotal.at(2).text()).toMatch(formattedTotal.casual)
    expect(tDataTotal.at(3).text()).toMatch(formattedTotal.lost_ticket)
    expect(tDataTotal.at(4).text()).toMatch(formattedTotal.total)
  })
})
