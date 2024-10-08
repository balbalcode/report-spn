import { createLocalVue, shallowMount } from "@vue/test-utils"
import FormRequestVehicleValidationReport from "@/components/organisms/report/vehicle-validation/FormRequestVehicleValidationReport"
import Vuelidate from "vuelidate"

let wrapper
const localVue = createLocalVue()
localVue.use(Vuelidate)

const id = "form-request-vehicle-validation-report"
const mocks = {
  $utility: {
    getSpotId: () => "",
    fireToast() { },
    getUserLoggedIn: () => ({})
  }
}

let mocksFn = {}

describe("ui.FormRequestVehicleValidationReport.vue", () => {
  beforeEach(() => {
    mocksFn = {}
    mocksFn['setDefaultEmail'] = jest.spyOn(FormRequestVehicleValidationReport.methods, "setDefaultEmail").mockImplementation()
    wrapper = shallowMount(FormRequestVehicleValidationReport, { localVue, mocks })
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  describe("btn-close", () => {
    test("should be rendered", () => {
      const btn = wrapper.find(`[data-testid="${id}__btn-close"]`)
      expect(btn.exists()).toBeTruthy()
    })

    test("trigger click, should call passCloseToParent", async () => {
      wrapper.vm.passCloseToParent = mocksFn['passCloseToParent'] = jest.fn()

      const btn = wrapper.find(`[data-testid="${id}__btn-close"]`)
      btn.trigger("click")

      expect(mocksFn['passCloseToParent'].mock.calls).toEqual([[]])
    })
  })

  test("should render input month", async () => {
    const input = wrapper.findComponent({ ref: `${id}__month` })
    expect(input.exists()).toBeTruthy()
  })

  test("should render input transaction-type", async () => {
    const input = wrapper.findComponent({ ref: `${id}__transaction-type` })
    expect(input.exists()).toBeTruthy()
  })

  test("should render input emails", async () => {
    const input = wrapper.findComponent({ ref: `${id}__emails` })
    expect(input.exists()).toBeTruthy()
  })

  describe("btn-loading", () => {
    it.each([
      { case: "given helper.is_loading true, should exist", is_loading: true, exists: true },
      { case: "given helper.is_loading false, should not exist", is_loading: false, exists: false }
    ])('$case', async ({ is_loading, exists }) => {
      wrapper.vm.helper.is_loading = is_loading
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const btn = wrapper.findComponent({ ref: `${id}__btn-loading` })
      expect(btn.exists()).toBe(exists)
    })
  })

  describe("btn-submit", () => {
    it.each([
      { case: "given helper.is_loading true, should not exist", is_loading: true, exists: false },
      { case: "given helper.is_loading false, should exist", is_loading: false, exists: true }
    ])('$case', async ({ is_loading, exists }) => {
      wrapper.vm.helper.is_loading = is_loading
      await wrapper.vm.$nextTick()

      const btn = wrapper.findComponent({ ref: `${id}__btn-submit` })
      expect(btn.exists()).toBe(exists)
    })

    it("trigger click on btn-submit should call processSubmitForm", async () => {
      wrapper.vm.processSubmitForm = mocksFn['processSubmitForm'] = jest.fn()

      const btn = wrapper.findComponent({ ref: `${id}__btn-submit` })
      await btn.trigger("click")

      expect(mocksFn['processSubmitForm'].mock.calls).toEqual([[]])
    })
  })
})