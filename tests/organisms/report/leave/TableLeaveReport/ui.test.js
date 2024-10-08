import { createLocalVue, shallowMount } from "@vue/test-utils";
import { DropdownPlugin } from "bootstrap-vue";

import TableLeaveReport from "@/components/organisms/report/leave/TableLeaveReport"
import { formattedData } from "./mock";

let wrapper
const id = "table-leave-report"
const localVue = createLocalVue()
localVue.use(DropdownPlugin)
const mocks = {

  $utility: {
    getAssetUrl: () => "",
    getSelectedSpot: () => ({}),
    setErrorContextSentry() { },
  },
  $sentr: {
    captureMessage() { }
  }
}

let mocksFn = {}

describe("ui.TableLeaveReport.vue", () => {
  beforeEach(() => {
    mocksFn = {}
    wrapper = shallowMount(TableLeaveReport, { mocks, localVue })
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it("given filled data, should show each row data correctly", async () => {
    wrapper.vm.data = [...formattedData]
    wrapper.vm.helper.is_init = false
    await wrapper.vm.$nextTick()

    const tRows = wrapper.findAll(`[data-testid="${id}"] tbody tr`)
    for (let indexRow = 0; indexRow < tRows.length; indexRow++) {
      const tData = tRows.at(indexRow).findAll("td");
      expect(tData.at(1).text()).toContain(formattedData[indexRow].officer_name)
      expect(tData.at(2).text()).toContain(formattedData[indexRow].officer_id)
      expect(tData.at(3).text()).toContain(formattedData[indexRow].leave_type_text)
      expect(tData.at(4).text()).toContain(formattedData[indexRow].leave_range_date)
      expect(tData.at(5).text()).toContain(formattedData[indexRow].leave_days)
      expect(tData.at(6).text()).toContain(formattedData[indexRow].leave_reason_text)
      expect(tData.at(9).text()).toContain(formattedData[indexRow].checker)
    }
  })

  describe("th-letter-image", () => {
    it.each([
      { case: "given leave_type='SICK', should be rendered", exists: true, leave_type: "SICK" },
      { case: "given leave_type='LEAVE', shouldn't be rendered", exists: false, leave_type: "LEAVE" }
    ])("$case", async ({ exists, leave_type }) => {
      const data = [formattedData[0], formattedData[2]]
      wrapper.vm.data = [...data]
      wrapper.vm.helper.is_init = false
      await wrapper.vm.$nextTick()

      wrapper.setProps({ leave_type })
      await wrapper.vm.$nextTick()

      const th = wrapper.find(`[data-testid="${id}__tr-head__th-letter-image"]`)
      expect(th.exists()).toBe(exists)
    })
  })

  describe("td-letter-image", () => {
    it.each([
      { case: "given leave_type='SICK', should be rendered", exists: true, leave_type: "SICK" },
      { case: "given leave_type='LEAVE', shouldn't be rendered", exists: false, leave_type: "LEAVE" }
    ])("$case", async ({ exists, leave_type }) => {
      wrapper.setProps({ leave_type })
      await wrapper.vm.$nextTick()

      const data = [formattedData[0], formattedData[2]]
      wrapper.vm.data = data
      wrapper.vm.helper.is_init = false
      await wrapper.vm.$nextTick()

      for (let indexRow = 0; indexRow < data.length; indexRow++) {
        const td = wrapper.find(`[data-testid="${id}__tr-${indexRow}__td-letter-image"]`)
        expect(td.exists()).toBe(exists)
      }
    })
  })

  describe("btn-preview-letter", () => {
    it.each([
      { case: "given leave_type='SICK', should be rendered", exists: true, leave_type: "SICK" },
      { case: "given leave_type='LEAVE', shouldn't be rendered", exists: false, leave_type: "LEAVE" }
    ])("$case", async ({ exists, leave_type }) => {
      wrapper.setProps({ leave_type })
      await wrapper.vm.$nextTick()

      const data = [formattedData[0], formattedData[2]]
      wrapper.vm.data = data
      wrapper.vm.helper.is_init = false
      await wrapper.vm.$nextTick()

      for (let indexRow = 0; indexRow < data.length; indexRow++) {
        const btn = wrapper.findComponent({ ref: `${id}__tr-${indexRow}__btn-preview-letter` })
        expect(btn.exists()).toBe(exists)
      }
    })

    it("triggered click, should call passPreviewToParent", async () => {
      wrapper.setProps({ leave_type: "SICK" })
      await wrapper.vm.$nextTick()

      wrapper.vm.passPreviewToParent = mocksFn['passPreviewToParent'] = jest.fn()

      const data = [formattedData[0], formattedData[2]]
      wrapper.vm.data = data
      wrapper.vm.helper.is_init = false
      await wrapper.vm.$nextTick()

      const selectedIndex = 1
      const btn = wrapper.findComponent({ ref: `${id}__tr-${selectedIndex}__btn-preview-letter` })
      await btn.trigger("click")

      expect(mocksFn['passPreviewToParent'].mock.calls).toEqual([[data[selectedIndex]]])
    })
  })

  describe("btn-option", () => {
    it.each([
      { case: "given status='0_PENDING', should be rendered", exists: true, row: formattedData[0] },
      { case: "given status!='0_PENDING', shouldn't be rendered", exists: false, row: formattedData[1] }
    ])("$case", async ({ exists, row }) => {
      wrapper.vm.data = [row]
      wrapper.vm.helper.is_init = false
      await wrapper.vm.$nextTick()

      const btn = wrapper.findComponent({ ref: `${id}__tr-0__btn-option` })
      expect(btn.exists()).toBe(exists)
    })

    it("triggered click on btn-approve, should call passApprovalToParent with action 1_APPROVED", async () => {
      wrapper.vm.passApprovalToParent = mocksFn['passApprovalToParent'] = jest.fn()

      wrapper.vm.data = [formattedData[0]]
      wrapper.vm.helper.is_init = false
      await wrapper.vm.$nextTick()

      const btn = wrapper.findComponent({ ref: `${id}__tr-0__btn-approve` })
      expect(btn.exists()).toBe(true)

      await btn.trigger("click")
      expect(mocksFn['passApprovalToParent'].mock.calls).toEqual([[formattedData[0], "1_APPROVED"]])
    })

    it("triggered click on btn-decline, should call passApprovalToParent with action 2_REJECTED", async () => {
      wrapper.vm.passApprovalToParent = mocksFn['passApprovalToParent'] = jest.fn()

      wrapper.vm.data = [formattedData[0]]
      wrapper.vm.helper.is_init = false
      await wrapper.vm.$nextTick()

      const btn = wrapper.findComponent({ ref: `${id}__tr-0__btn-decline` })
      expect(btn.exists()).toBe(true)

      await btn.trigger("click")
      expect(mocksFn['passApprovalToParent'].mock.calls).toEqual([[formattedData[0], "2_REJECTED"]])
    })
  })
})
