import { createLocalVue, mount } from "@vue/test-utils";
import { ModalPlugin, TooltipPlugin } from "bootstrap-vue";

import TableProblemTicketReport from "@/components/organisms/report/problem-ticket/TableProblemTicketReport"
import { formattedContentReport } from "./mock";
import utilities from "@/plugins/utilities";

const localVue = createLocalVue()
localVue.use(ModalPlugin)
localVue.use(TooltipPlugin)

const mocks = {
  $utility: {
    convertToRupiah: utilities.convertToRupiah,
    convertToNumber: () => "",
    getVehicleMap: () => ({}),
    getSpotId: () => "",
    getAssetUrl: () => "",
    formatLocalTimezone: () => "",
    setErrorContextSentry: () => "",
  },
  $sentry: {
    captureMessage() { }
  }
}
const id = "table-problem-ticket-report"
let wrapper
let mocksFn = {}

describe("ui.TableProblemTicketReport.vue", () => {
  beforeEach(() => {
    mocksFn = {}
    mocksFn['processGetData'] = jest.spyOn(TableProblemTicketReport.methods, "processGetData").mockImplementation()
    wrapper = mount(TableProblemTicketReport, { localVue, mocks })
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it("given report filled, should show every row of data on table", async () => {
    wrapper.vm.report = [...formattedContentReport]
    await wrapper.vm.$nextTick()

    for (let index = 0; index < formattedContentReport.length; index++) {
      const tRow = wrapper.find(`[data-testid="${id}__tr-${index}"]`)
      expect(tRow.exists()).toBeTruthy()

      let tData = wrapper.find(`[data-testid="${id}__tr-${index}__td-time-in"]`)
      expect(tData.exists()).toBeTruthy()
      expect(tData.text()).toMatch(formattedContentReport[index].time_in)

      tData = wrapper.find(`[data-testid="${id}__tr-${index}__td-system-problem-at"]`)
      expect(tData.exists()).toBeTruthy()
      expect(tData.text()).toMatch(formattedContentReport[index].system_problem_at)

      tData = wrapper.find(`[data-testid="${id}__tr-${index}__td-manual-problem-at"]`)
      expect(tData.exists()).toBeTruthy()
      expect(tData.text()).toMatch(formattedContentReport[index].manual_problem_at)

      tData = wrapper.find(`[data-testid="${id}__tr-${index}__td-shift"]`)
      expect(tData.exists()).toBeTruthy()
      expect(tData.text()).toMatch(formattedContentReport[index].shift)

      tData = wrapper.find(`[data-testid="${id}__tr-${index}__td-reason"]`)
      expect(tData.exists()).toBeTruthy()
      expect(tData.text()).toMatch(formattedContentReport[index].reason)

      tData = wrapper.find(`[data-testid="${id}__tr-${index}__td-reporter"]`)
      expect(tData.exists()).toBeTruthy()
      expect(tData.text()).toMatch(formattedContentReport[index].reporter)

      tData = wrapper.find(`[data-testid="${id}__tr-${index}__td-media"]`)
      expect(tData.exists()).toBeTruthy()
      expect(tData.text()).toContain(formattedContentReport[index].media_text)

      tData = wrapper.find(`[data-testid="${id}__tr-${index}__td-amount"]`)
      expect(tData.exists()).toBeTruthy()
      expect(tData.text()).toMatch(formattedContentReport[index].amount)
    }
  })

  it("trigger click on a row, should call setSelectedImage", async () => {
    wrapper.vm.setSelectedImage = mocksFn['setSelectedImage'] = jest.fn()

    wrapper.vm.report = [...formattedContentReport]
    await wrapper.vm.$nextTick()

    let selected = 1
    let tRow = wrapper.find(`[data-testid="${id}__tr-${selected}"]`)
    await tRow.trigger("click")

    selected = 0
    tRow = wrapper.find(`[data-testid="${id}__tr-${selected}"]`)
    await tRow.trigger("click")

    expect(mocksFn['setSelectedImage'].mock.calls).toEqual([
      [formattedContentReport[1].image],
      [formattedContentReport[0].image],
    ])
  })
})
