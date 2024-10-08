import { shallowMount, createLocalVue } from "@vue/test-utils";
import { ModalPlugin, TooltipPlugin } from "bootstrap-vue";

import TableLostTicketReport from "@/components/organisms/report/ticket/TableLostTicketReport"
import { formattedContentReport, formattedTotalReport, getReport, payloadGetBasic, payloadGetWithOfficer, spotId, vehicleMap } from "./mock";

const localVue = createLocalVue()
localVue.use(ModalPlugin)
localVue.use(TooltipPlugin)

const id = "report-lost-ticket__table"
const mocks = {
  $utility: {
    convertToRupiah: () => "",
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
let wrapper
let mocksFn = {}

describe("ui.TableLostTicketReport.vue", () => {
  beforeEach(() => {
    mocksFn = {}
    mocksFn['$utility.getVehicleMap'] = mocks.$utility.getVehicleMap = jest.fn().mockReturnValueOnce(vehicleMap)
    mocksFn['processGetData'] = jest.spyOn(TableLostTicketReport.methods, "processGetData")
    wrapper = shallowMount(TableLostTicketReport, { localVue, mocks })
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it("given data.rows, should show each row of report properly", async () => {
    wrapper.vm.helper.is_init = false
    wrapper.vm.data.rows = [...formattedContentReport]
    await wrapper.vm.$nextTick()
    wrapper.vm.data.total = { ...formattedTotalReport }
    await wrapper.vm.$nextTick()

    // tbody
    const tRows = wrapper.findAll(`[data-testid="${id}"] tbody tr`)
    expect(tRows.exists()).toBeTruthy()

    formattedContentReport.forEach((row, index) => {
      const tData = tRows.at(index).findAll("td")

      expect(tData.at(1).text()).toMatch(row.license_plate)
      expect(tData.at(2).text()).toMatch(row.time_in)
      expect(tData.at(3).text()).toMatch(row.time_out)
      expect(tData.at(4).text()).toMatch(row.total_hours)
      expect(tData.at(5).text()).toMatch(row.stnk_number)
      expect(tData.at(7).text()).toMatch(row.vehicle_code)
      expect(tData.at(8).text()).toMatch(row.fine_type)
      expect(tData.at(9).text()).toMatch(row.officer_name)
      expect(tData.at(10).text()).toMatch(row.parking_price)
      expect(tData.at(11).text()).toMatch(row.overnight_price)
      expect(tData.at(12).text()).toMatch(row.fine)
      expect(tData.at(13).text()).toMatch(row.total_price)

      const labelId = wrapper.findComponent({ ref: `${id}__tr-${index}__label-id` })
      expect(labelId.exists()).toBeTruthy()
      expect(labelId.props("value")).toMatch(row.transaction_id)
    })

    // tfoot
    const tDataTotal = wrapper.findAll(`[data-testid="${id}"] tfoot tr td`)
    expect(tDataTotal.exists()).toBeTruthy()

    expect(tDataTotal.at(1).text()).toMatch(formattedTotalReport.parking_price)
    expect(tDataTotal.at(2).text()).toMatch(formattedTotalReport.overnight_price)
    expect(tDataTotal.at(3).text()).toMatch(formattedTotalReport.fine)
    expect(tDataTotal.at(4).text()).toMatch(formattedTotalReport.total_price)
  })

  describe("btn-preview-stnk", () => {
    it.each([
      { case: "given photo_url exists (submit through 'Aplikasi Kasir'), should be rendered", exists: true, data: formattedContentReport[0] },
      { case: "given no photo_url (submit through 'Kasir'), shouldn't be rendered", exists: false, data: formattedContentReport[1] },
    ])("$case", async ({ data, exists }) => {
      wrapper.vm.helper.is_init = false
      wrapper.vm.data.rows = [data]
      await wrapper.vm.$nextTick()

      const btnPreview = wrapper.findComponent({ ref: `${id}__tr-0__btn-preview-stnk` })
      expect(btnPreview.exists()).toBe(exists)
    })

    it("triggered click, should call toggleModalImage with selected data as param", async () => {
      wrapper.vm.helper.is_init = false
      wrapper.vm.toggleModalImage = mocksFn['toggleModalImage'] = jest.fn()
      wrapper.vm.data.rows = [formattedContentReport[0]]
      await wrapper.vm.$nextTick()

      const btnPreview = wrapper.findComponent({ ref: `${id}__tr-0__btn-preview-stnk` })
      await btnPreview.trigger("click")

      expect(mocksFn['toggleModalImage'].mock.calls).toEqual([[formattedContentReport[0]]])
    })
  })

  describe("no-stnk-image", () => {
    it.each([
      { case: "given photo_url exists (submit through 'Aplikasi Kasir'), shouldn't be rendered", exists: false, data: formattedContentReport[0] },
      { case: "given no photo_url (submit through 'Kasir'), should be rendered", exists: true, data: formattedContentReport[1] },
    ])("$case", async ({ data, exists }) => {
      wrapper.vm.helper.is_init = false
      wrapper.vm.data.rows = [data]
      await wrapper.vm.$nextTick()

      const labelNoStnkImage = wrapper.find(`[data-testid="${id}__tr-0__no-stnk-image"]`)
      expect(labelNoStnkImage.exists()).toBe(exists)
    })
  })

  it("trigger click on modal-preview-stnk__btn-close, should call toggleModalImage with empty param", async () => {
    wrapper.vm.toggleModalImage = mocksFn['toggleModalImage'] = jest.fn()

    wrapper.vm.modal.modal_preview = true
    wrapper.vm.selected_data = formattedContentReport[0]
    await wrapper.vm.$nextTick()

    const btnPreview = wrapper.findComponent({ ref: `${id}__modal-preview-stnk__btn-close` })
    await btnPreview.trigger("click")

    expect(mocksFn['toggleModalImage'].mock.calls).toEqual([[]])
  })
})
