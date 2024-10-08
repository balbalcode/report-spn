import { createLocalVue, shallowMount } from "@vue/test-utils"
import FormRequestDurationReport from "@/components/organisms/report/duration/FormRequestDurationReport"
import Vuelidate from "vuelidate"

let wrapper
const localVue = createLocalVue()
localVue.use(Vuelidate)

const id = "form-request-duration-report"
const mocks = {
  $utility: {
    getSpotId: () => "",
    fireToast() { },
    getUserLoggedIn: () => ({})
  }
}

let mocksFn = {}

describe("ui.FormRequestDurationReport.vue", () => {
  beforeEach(() => {
    mocksFn = {}
    mocksFn['setDefaultEmail'] = jest.spyOn(FormRequestDurationReport.methods, "setDefaultEmail").mockImplementation()
    mocksFn['formatVehicleOptions'] = jest.spyOn(FormRequestDurationReport.methods, "formatVehicleOptions").mockImplementation()
    mocksFn['formatProductOptions'] = jest.spyOn(FormRequestDurationReport.methods, "formatProductOptions").mockImplementation()
    wrapper = shallowMount(FormRequestDurationReport, { localVue, mocks })
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

  test("should render input date-range", async () => {
    const input = wrapper.findComponent({ ref: `${id}__date-range` })
    expect(input.exists()).toBeTruthy()
  })

  describe("loader-product", () => {
    test.each([
      { case: "given helper.is_loading_product true, should exist", loading: true, exists: true },
      { case: "given helper.is_loading_product false, shouldn't exist", loading: false, exists: false },
    ])("$case", async ({ loading, exists }) => {
      wrapper.vm.helper.is_loading_product = loading
      await wrapper.vm.$nextTick()

      const loader = wrapper.find(`[data-testid="${id}__loader-product"]`)
      expect(loader.exists()).toBe(exists)
    })
  })

  describe("input product", () => {
    test.each([
      { case: "given helper.is_loading_product false, should exist", loading: false, exists: true },
      { case: "given helper.is_loading_product true, shouldn't exist", loading: true, exists: false },
    ])("$case", async ({ loading, exists }) => {
      wrapper.vm.helper.is_loading_product = loading
      await wrapper.vm.$nextTick()

      const loader = wrapper.findComponent({ ref: `${id}__product` })
      expect(loader.exists()).toBe(exists)
    })
  })

  describe("loader-vehicle", () => {
    test.each([
      { case: "given helper.is_loading_vehicle true, should exist", loading: true, exists: true },
      { case: "given helper.is_loading_vehicle false, shouldn't exist", loading: false, exists: false },
    ])("$case", async ({ loading, exists }) => {
      wrapper.vm.helper.is_loading_vehicle = loading
      await wrapper.vm.$nextTick()

      const loader = wrapper.find(`[data-testid="${id}__loader-vehicle"]`)
      expect(loader.exists()).toBe(exists)
    })
  })

  describe("input vehicle", () => {
    test.each([
      { case: "given helper.is_loading_vehicle false, should exist", loading: false, exists: true },
      { case: "given helper.is_loading_vehicle true, shouldn't exist", loading: true, exists: false },
    ])("$case", async ({ loading, exists }) => {
      wrapper.vm.helper.is_loading_vehicle = loading
      await wrapper.vm.$nextTick()

      const loader = wrapper.findComponent({ ref: `${id}__vehicle` })
      expect(loader.exists()).toBe(exists)
    })
  })

  test("should render input emails", async () => {
    const input = wrapper.findComponent({ ref: `${id}__emails` })
    expect(input.exists()).toBeTruthy()
  })

  describe("btn-loading", () => {
    it.each([
      { case: "given helper.is_loading_submit true, should exist", is_loading_submit: true, exists: true },
      { case: "given helper.is_loading_submit false, should not exist", is_loading_submit: false, exists: false }
    ])('$case', async ({ is_loading_submit, exists }) => {
      wrapper.vm.helper.is_loading_submit = is_loading_submit
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const btn = wrapper.findComponent({ ref: `${id}__btn-loading` })
      expect(btn.exists()).toBe(exists)
    })
  })

  describe("btn-submit", () => {
    it.each([
      { case: "given helper.is_loading_submit true, should not exist", is_loading_submit: true, exists: false },
      { case: "given helper.is_loading_submit false, should exist", is_loading_submit: false, exists: true }
    ])('$case', async ({ is_loading_submit, exists }) => {
      wrapper.vm.helper.is_loading_submit = is_loading_submit
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