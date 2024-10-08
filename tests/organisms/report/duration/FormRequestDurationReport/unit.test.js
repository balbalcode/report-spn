import { createLocalVue, shallowMount } from "@vue/test-utils"
import FormRequestDurationReport from "@/components/organisms/report/duration/FormRequestDurationReport"
import Vuelidate from "vuelidate"
import { payloadRequestDownload, spotId, userData, formRequestDownload, vehicleList, productList, productOptions } from "./mock"

let wrapper
const localVue = createLocalVue()
localVue.use(Vuelidate)

const mocks = {
  $utility: {
    getSpotId: () => "",
    fireToast() { },
    getUserLoggedIn: () => ({})
  }
}

let mocksFn = {}

describe("unit.FormRequestDurationReport.vue", () => {
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

  test("created lifecycle, should call setDefaultEmail", () => {
    expect(mocksFn['setDefaultEmail'].mock.calls).toEqual([[]])
  })

  test("mounted lifecycle, should call formatVehicleOptions and formatProductOptions", () => {
    expect(mocksFn['formatVehicleOptions'].mock.calls).toEqual([[]])
    expect(mocksFn['formatProductOptions'].mock.calls).toEqual([[]])
  })

  test("once passCloseToParent called, should emit 'close'", () => {
    wrapper.vm.passCloseToParent()

    expect(wrapper.emitted("close")).toEqual([[]])
  })

  test("once setPayloadRequestDownload called, should return proper payload for request download", () => {
    wrapper.vm.$utility.getSpotId = mocksFn['$utility.getSpotId'] = jest.fn().mockReturnValueOnce(spotId)

    wrapper.vm.form = { ...formRequestDownload }

    const receivedPayload = wrapper.vm.setPayloadRequestDownload()

    expect(receivedPayload).toEqual(payloadRequestDownload)
  })

  test("once setDefaultEmail called, should fill form.emails", async () => {
    wrapper.vm.$utility.getUserLoggedIn = mocksFn['$utility.getUserLoggedIn'] = jest.fn().mockReturnValueOnce(userData)

    mocksFn['setDefaultEmail'].mockRestore()
    wrapper.vm.setDefaultEmail = FormRequestDurationReport.methods.setDefaultEmail
    wrapper.vm.setDefaultEmail()

    expect(wrapper.vm.form.emails).toEqual([userData.email])
  })

  test("once formatVehicleOptions called, should set options.vehicle with returned value from $utility.getFormattedVehicle", async () => {
    wrapper.vm.$utility.getFormattedVehicle = mocksFn['$utility.getFormattedVehicle'] = jest.fn().mockReturnValueOnce(vehicleList)

    mocksFn['formatVehicleOptions'].mockRestore()
    wrapper.vm.formatVehicleOptions = FormRequestDurationReport.methods.formatVehicleOptions
    await wrapper.vm.formatVehicleOptions()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.options.vehicle).toEqual(vehicleList)
  })

  test("once formatProductOptions called, should set options.vehicle with returned value from $utility.getOptionProductMembership", async () => {
    wrapper.vm.$utility.getOptionProductMembership = mocksFn['$utility.getOptionProductMembership'] = jest.fn().mockReturnValueOnce(productList)

    mocksFn['formatProductOptions'].mockRestore()
    wrapper.vm.formatProductOptions = FormRequestDurationReport.methods.formatProductOptions
    await wrapper.vm.formatProductOptions()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.options.product).toEqual(productOptions)
  })

  describe("processSubmitForm", () => {
    test.each([
      { case: "given $v.form.$error true, shouldn't call processRequestDownload", error: true, fnMocked: { processRequestDownload: { calls: [] } } },
      { case: "given $v.form.$error false, should call processRequestDownload", error: false, fnMocked: { processRequestDownload: { calls: [[]] } } },
    ])("$case", async ({ error, fnMocked }) => {
      mocksFn['$v.form.$touch'] = jest.spyOn(wrapper.vm.$v.form, "$touch").mockImplementation()
      mocksFn['$v.form.$error'] = jest.spyOn(wrapper.vm.$v.form, "$error", "get").mockReturnValueOnce(error)
      wrapper.vm.processRequestDownload = mocksFn['processRequestDownload'] = jest.fn()

      await wrapper.vm.processSubmitForm()

      expect(mocksFn['$v.form.$touch'].mock.calls).toEqual([[]])
      expect(mocksFn['processRequestDownload'].mock.calls).toEqual(fnMocked['processRequestDownload'].calls)
    })
  })

  describe("processRequestDownload", () => {
    test("given no error, should call setPayloadRequestDownload, requestAllQuantityDurationReport and passCloseToParent", async () => {
      wrapper.vm.setPayloadRequestDownload = mocksFn['setPayloadRequestDownload'] = jest.fn().mockReturnValueOnce(payloadRequestDownload)
      wrapper.vm.requestAllQuantityDurationReport = mocksFn['requestAllQuantityDurationReport'] = jest.fn()
      wrapper.vm.passCloseToParent = mocksFn['passCloseToParent'] = jest.fn()
      wrapper.vm.$utility.fireToast = mocksFn['$utility.fireToast'] = jest.fn()

      await wrapper.vm.processRequestDownload()

      expect(mocksFn['setPayloadRequestDownload'].mock.calls).toEqual([[]])
      expect(mocksFn['requestAllQuantityDurationReport'].mock.calls).toEqual([[payloadRequestDownload]])
      expect(mocksFn['passCloseToParent'].mock.calls).toEqual([[]])
      expect(mocksFn['$utility.fireToast'].mock.calls).toEqual([])
    })

    test("given error, should call $utility.fireToast", async () => {
      wrapper.vm.setPayloadRequestDownload = mocksFn['setPayloadRequestDownload'] = jest.fn().mockReturnValueOnce(payloadRequestDownload)
      const error = new Error("Error Occured!")
      wrapper.vm.requestAllQuantityDurationReport = mocksFn['requestAllQuantityDurationReport'] = jest.fn().mockRejectedValueOnce(error)
      wrapper.vm.passCloseToParent = mocksFn['passCloseToParent'] = jest.fn()
      wrapper.vm.$utility.fireToast = mocksFn['$utility.fireToast'] = jest.fn()

      await wrapper.vm.processRequestDownload()

      expect(mocksFn['setPayloadRequestDownload'].mock.calls).toEqual([[]])
      expect(mocksFn['requestAllQuantityDurationReport'].mock.calls).toEqual([[payloadRequestDownload]])
      expect(mocksFn['passCloseToParent'].mock.calls).toEqual([])
      expect(mocksFn['$utility.fireToast'].mock.calls).toEqual([["Gagal mengirim laporan", "dark", error.message]])
    })
  })
})