import { shallowMount, createLocalVue } from "@vue/test-utils"
import { BModal, VBTooltip } from "bootstrap-vue"

import TableGateOpenReport from "@/components/organisms/report/gate-open/TableGateOpenReport"
import { dataGetReport, payloadGet, payloadReady, report, spotId, spotInfo } from "./mock"

const localVue = createLocalVue()
localVue.directive('b-tooltip', VBTooltip)
localVue.component('b-modal', BModal)

const mocks = {
  $utility: {
    getSpotId() { },
    getSelectedSpot() { },
    mergeBaseAssetUrl() { },
    getAssetUrl() { },
    dateUTCToLocal() { }
  }
}
let wrapper
let mocksFn

describe("ui.TableGateOpenReport.vue", () => {
  beforeEach(() => {
    mocksFn = {}
    wrapper = shallowMount(TableGateOpenReport, { localVue, mocks })
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  it("given formatted report, should show it on table", async () => {
    wrapper.setProps({ page: 2, per_page: 2 })
    wrapper.vm.report = report
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const tRows = wrapper.findAll("#table-gate-open-report tbody tr")
    for (let index = 0; index < tRows.length; index++) {
      const tData = tRows.at(index).findAll("td")
      expect(tData.at(1).text()).toMatch(report[index].date)
      expect(tData.at(2).text()).toMatch(report[index].gate_code)
      expect(tData.at(3).text()).toMatch(report[index].officer_name)
      expect(tData.at(4).text()).toMatch(report[index].reason)

      const imageURL = wrapper.findComponent({ ref: `table-gate-open-report__row-${index}__image` })
      expect(imageURL.exists()).toBeTruthy()
      expect(imageURL.props("value")).toMatch(report[index].image)
    }
  })

  it("trigger click on a row, should call toggleModalImage with row's data", async () => {
    wrapper.vm.toggleModalImage = mocksFn['toggleModalImage'] = jest.fn()

    wrapper.setProps({ page: 2, per_page: 2 })
    wrapper.vm.report = report
    await wrapper.vm.$nextTick()

    const tRows = wrapper.findAll("#table-gate-open-report tbody tr")

    await tRows.at(1).trigger("click")
    await tRows.at(0).trigger("click")

    expect(mocksFn['toggleModalImage'].mock.calls).toEqual([[report[1]], [report[0]]])
  })

  it("trigger click on btn-close-modal, should call toggleModalImage without any data", async () => {
    wrapper.vm.toggleModalImage = mocksFn['toggleModalImage'] = jest.fn()

    wrapper.vm.report = report
    wrapper.vm.selected = report[0]
    wrapper.vm.modal.image = true
    await wrapper.vm.$nextTick()

    const btnClose = wrapper.findComponent({ ref: "btn-close-modal" })
    await btnClose.trigger("click")

    expect(mocksFn['toggleModalImage'].mock.calls).toEqual([[]])
  })
})