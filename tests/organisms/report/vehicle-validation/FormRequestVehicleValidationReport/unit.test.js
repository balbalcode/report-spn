import { createLocalVue, shallowMount } from "@vue/test-utils"
import FormRequestVehicleValidationReport from "@/components/organisms/report/vehicle-validation/FormRequestVehicleValidationReport"
import Vuelidate from "vuelidate"
import { payloadRequestDownload, spotId, userData } from "./mock"

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

describe("unit.FormRequestVehicleValidationReport.vue", () => {
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

  test("created lifecycle, should call setDefaultEmail", () => {
    expect(mocksFn['setDefaultEmail'].mock.calls).toEqual([[]])
  })

  test("once passCloseToParent called, should emit 'close'", () => {
    wrapper.vm.passCloseToParent()

    expect(wrapper.emitted("close")).toEqual([[]])
  })

  test("once setPayloadRequestDownload called, should return proper payload for request download", () => {
    wrapper.vm.$utility.getSpotId = mocksFn['$utility.getSpotId'] = jest.fn().mockReturnValueOnce(spotId)

    wrapper.vm.form.month = payloadRequestDownload.month
    wrapper.vm.form.emails = payloadRequestDownload.emails
    wrapper.vm.form.transaction_type = payloadRequestDownload.transaction_type

    const receivedPayload = wrapper.vm.setPayloadRequestDownload()

    expect(receivedPayload).toEqual(payloadRequestDownload)
  })

  test("once setDefaultEmail called, should fill form.emails", async () => {
    wrapper.vm.$utility.getUserLoggedIn = mocksFn['$utility.getUserLoggedIn'] = jest.fn().mockReturnValueOnce(userData)

    mocksFn['setDefaultEmail'].mockRestore()
    wrapper.vm.setDefaultEmail = FormRequestVehicleValidationReport.methods.setDefaultEmail
    wrapper.vm.setDefaultEmail()

    expect(wrapper.vm.form.emails).toEqual([userData.email])
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
    test("given no error, should call setPayloadRequestDownload, requestAllVehicleValidationReport and passCloseToParent", async () => {
      wrapper.vm.setPayloadRequestDownload = mocksFn['setPayloadRequestDownload'] = jest.fn().mockReturnValueOnce(payloadRequestDownload)
      wrapper.vm.requestAllVehicleValidationReport = mocksFn['requestAllVehicleValidationReport'] = jest.fn()
      wrapper.vm.passCloseToParent = mocksFn['passCloseToParent'] = jest.fn()
      wrapper.vm.$utility.fireToast = mocksFn['$utility.fireToast'] = jest.fn()

      await wrapper.vm.processRequestDownload()

      expect(mocksFn['setPayloadRequestDownload'].mock.calls).toEqual([[]])
      expect(mocksFn['requestAllVehicleValidationReport'].mock.calls).toEqual([[payloadRequestDownload]])
      expect(mocksFn['passCloseToParent'].mock.calls).toEqual([[]])
      expect(mocksFn['$utility.fireToast'].mock.calls).toEqual([])
    })

    test("given error, should call $utility.fireToast", async () => {
      wrapper.vm.setPayloadRequestDownload = mocksFn['setPayloadRequestDownload'] = jest.fn().mockReturnValueOnce(payloadRequestDownload)
      const error = new Error("Error Occured!")
      wrapper.vm.requestAllVehicleValidationReport = mocksFn['requestAllVehicleValidationReport'] = jest.fn().mockRejectedValueOnce(error)
      wrapper.vm.passCloseToParent = mocksFn['passCloseToParent'] = jest.fn()
      wrapper.vm.$utility.fireToast = mocksFn['$utility.fireToast'] = jest.fn()

      await wrapper.vm.processRequestDownload()

      expect(mocksFn['setPayloadRequestDownload'].mock.calls).toEqual([[]])
      expect(mocksFn['requestAllVehicleValidationReport'].mock.calls).toEqual([[payloadRequestDownload]])
      expect(mocksFn['passCloseToParent'].mock.calls).toEqual([])
      expect(mocksFn['$utility.fireToast'].mock.calls).toEqual([["Gagal mengirim laporan", "dark", error.message]])
    })
  })
})