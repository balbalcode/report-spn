import { shallowMount } from "@vue/test-utils";

import TableReportByPayment from "@/components/organisms/report/by-payment/TableReportByPayment"
import { payment_types } from "@/constants/v3.report"
import { dataReport, formattedContent, formattedHeader, formattedTotal, payloadDownload, payloadGet, shownRowTotal, shownRows, spotId, vehicles } from "./mock";

let wrapper
const mocks = {
  $utility: {
    getFormattedVehicle: () => ([]),
    getSpotId: () => "",
    setErrorContextSentry() { },
    fireToast() { },
    convertToRupiah: () => "",
    formatLocalTimezone: () => "",
    getAssetUrl: () => ""
  },
  $sentry: {
    captureMessage() { }
  },
  $route: { path: "/page" }
}
const stubs = ['b-toast']
let mocksFn = {}

describe('ui.TableReportByPayment.vue', () => {
  beforeEach(() => {
    mocksFn = {}
    mocksFn['get_report'] = jest.fn()
    mocksFn['setBatchReport'] = jest.spyOn(TableReportByPayment.methods, "setBatchReport").mockImplementation()
    mocks.$utility.getFormattedVehicle = mocksFn['$utility.getFormattedVehicle'] = jest.fn().mockReturnValueOnce(vehicles)
    wrapper = shallowMount(TableReportByPayment, { mocks, stubs, propsData: { get_report: mocksFn['get_report'] } })
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  test("given filled data.rows, should show every row data & row total on table", async () => {
    wrapper.setProps({ column: payment_types(), vehicle: vehicles })
    wrapper.vm.data = dataReport
    wrapper.vm.helper.is_init = false
    wrapper.vm.batchReport.loadingInit = false
    await wrapper.vm.$nextTick()

    mocksFn['$utility.convertToRupiah'] = jest.fn()
    shownRows.forEach((shownRow) => {
      mocksFn['$utility.convertToRupiah'] = mocksFn['$utility.convertToRupiah']
        .mockReturnValueOnce(shownRow.cash_MT1).mockReturnValueOnce(shownRow.cash_MB1)
        .mockReturnValueOnce(shownRow.app_gopay_MT1).mockReturnValueOnce(shownRow.app_gopay_MB1)
        .mockReturnValueOnce(shownRow.app_shopeepay_MT1).mockReturnValueOnce(shownRow.app_shopeepay_MB1)
        .mockReturnValueOnce(shownRow.app_linkaja_MT1).mockReturnValueOnce(shownRow.app_linkaja_MB1)
        .mockReturnValueOnce(shownRow.emoney_bri_MT1).mockReturnValueOnce(shownRow.emoney_bri_MB1)
        .mockReturnValueOnce(shownRow.emoney_bni_MT1).mockReturnValueOnce(shownRow.emoney_bni_MB1)
        .mockReturnValueOnce(shownRow.emoney_mandiri_MT1).mockReturnValueOnce(shownRow.emoney_mandiri_MB1)
        .mockReturnValueOnce(shownRow.emoney_bca_MT1).mockReturnValueOnce(shownRow.emoney_bca_MB1)
        .mockReturnValueOnce(shownRow.emoney_luminous_MT1).mockReturnValueOnce(shownRow.emoney_luminous_MB1)
        .mockReturnValueOnce(shownRow.qris_ovo_MT1).mockReturnValueOnce(shownRow.qris_ovo_MB1)
        .mockReturnValueOnce(shownRow.qris_dana_MT1).mockReturnValueOnce(shownRow.qris_dana_MB1)
        .mockReturnValueOnce(shownRow.qris_gopay_MT1).mockReturnValueOnce(shownRow.qris_gopay_MB1)
        .mockReturnValueOnce(shownRow.qris_shopeepay_MT1).mockReturnValueOnce(shownRow.qris_shopeepay_MB1)
        .mockReturnValueOnce(shownRow.qris_linkaja_MT1).mockReturnValueOnce(shownRow.qris_linkaja_MB1)
        .mockReturnValueOnce(shownRow.qris_spinpay_MT1).mockReturnValueOnce(shownRow.qris_spinpay_MB1)
        .mockReturnValueOnce(shownRow.qris_dispenser_MT1).mockReturnValueOnce(shownRow.qris_dispenser_MB1)
        .mockReturnValueOnce(shownRow.total_cash)
        .mockReturnValueOnce(shownRow.total_app)
        .mockReturnValueOnce(shownRow.total_emoney)
        .mockReturnValueOnce(shownRow.total_static_qris)
        .mockReturnValueOnce(shownRow.total_qris_dispenser)
        .mockReturnValueOnce(shownRow.grand_total)
    })
    mocksFn['$utility.convertToRupiah'] = mocksFn['$utility.convertToRupiah']
      .mockReturnValueOnce(shownRowTotal.cash_MT1).mockReturnValueOnce(shownRowTotal.cash_MB1)
      .mockReturnValueOnce(shownRowTotal.app_gopay_MT1).mockReturnValueOnce(shownRowTotal.app_gopay_MB1)
      .mockReturnValueOnce(shownRowTotal.app_shopeepay_MT1).mockReturnValueOnce(shownRowTotal.app_shopeepay_MB1)
      .mockReturnValueOnce(shownRowTotal.app_linkaja_MT1).mockReturnValueOnce(shownRowTotal.app_linkaja_MB1)
      .mockReturnValueOnce(shownRowTotal.emoney_bri_MT1).mockReturnValueOnce(shownRowTotal.emoney_bri_MB1)
      .mockReturnValueOnce(shownRowTotal.emoney_bni_MT1).mockReturnValueOnce(shownRowTotal.emoney_bni_MB1)
      .mockReturnValueOnce(shownRowTotal.emoney_mandiri_MT1).mockReturnValueOnce(shownRowTotal.emoney_mandiri_MB1)
      .mockReturnValueOnce(shownRowTotal.emoney_bca_MT1).mockReturnValueOnce(shownRowTotal.emoney_bca_MB1)
      .mockReturnValueOnce(shownRowTotal.emoney_luminous_MT1).mockReturnValueOnce(shownRowTotal.emoney_luminous_MB1)
      .mockReturnValueOnce(shownRowTotal.qris_ovo_MT1).mockReturnValueOnce(shownRowTotal.qris_ovo_MB1)
      .mockReturnValueOnce(shownRowTotal.qris_dana_MT1).mockReturnValueOnce(shownRowTotal.qris_dana_MB1)
      .mockReturnValueOnce(shownRowTotal.qris_gopay_MT1).mockReturnValueOnce(shownRowTotal.qris_gopay_MB1)
      .mockReturnValueOnce(shownRowTotal.qris_shopeepay_MT1).mockReturnValueOnce(shownRowTotal.qris_shopeepay_MB1)
      .mockReturnValueOnce(shownRowTotal.qris_linkaja_MT1).mockReturnValueOnce(shownRowTotal.qris_linkaja_MB1)
      .mockReturnValueOnce(shownRowTotal.qris_spinpay_MT1).mockReturnValueOnce(shownRowTotal.qris_spinpay_MB1)
      .mockReturnValueOnce(shownRowTotal.qris_dispenser_MT1).mockReturnValueOnce(shownRowTotal.qris_dispenser_MB1)
      .mockReturnValueOnce(shownRowTotal.total_cash)
      .mockReturnValueOnce(shownRowTotal.total_app)
      .mockReturnValueOnce(shownRowTotal.total_emoney)
      .mockReturnValueOnce(shownRowTotal.total_static_qris)
      .mockReturnValueOnce(shownRowTotal.total_qris_dispenser)
      .mockReturnValueOnce(shownRowTotal.grand_total)

    wrapper.vm.$utility.convertToRupiah = mocksFn['$utility.convertToRupiah']
    await wrapper.vm.$nextTick()

    // console.log(wrapper.html());
    const tRows = wrapper.findAll("table[data-testid='table-report-by-payment'] tbody tr")
    shownRows.forEach((shownRow, indexRow) => {
      expect(tRows.at(indexRow).exists()).toBeTruthy()

      const tData = tRows.at(indexRow).findAll("td")
      expect(tData.at(0).text()).toMatch(shownRow.date)
      expect(tData.at(1).text()).toMatch(shownRow.days)
      expect(tData.at(2).text()).toMatch(shownRow.cash_MT1)
      expect(tData.at(3).text()).toMatch(shownRow.cash_MB1)
      expect(tData.at(4).text()).toMatch(shownRow.app_gopay_MT1)
      expect(tData.at(5).text()).toMatch(shownRow.app_gopay_MB1)
      expect(tData.at(6).text()).toMatch(shownRow.app_shopeepay_MT1)
      expect(tData.at(7).text()).toMatch(shownRow.app_shopeepay_MB1)
      expect(tData.at(8).text()).toMatch(shownRow.app_linkaja_MT1)
      expect(tData.at(9).text()).toMatch(shownRow.app_linkaja_MB1)
      expect(tData.at(10).text()).toMatch(shownRow.emoney_bri_MT1)
      expect(tData.at(11).text()).toMatch(shownRow.emoney_bri_MB1)
      expect(tData.at(12).text()).toMatch(shownRow.emoney_bni_MT1)
      expect(tData.at(13).text()).toMatch(shownRow.emoney_bni_MB1)
      expect(tData.at(14).text()).toMatch(shownRow.emoney_mandiri_MT1)
      expect(tData.at(15).text()).toMatch(shownRow.emoney_mandiri_MB1)
      expect(tData.at(16).text()).toMatch(shownRow.emoney_bca_MT1)
      expect(tData.at(17).text()).toMatch(shownRow.emoney_bca_MB1)
      expect(tData.at(18).text()).toMatch(shownRow.emoney_luminous_MT1)
      expect(tData.at(19).text()).toMatch(shownRow.emoney_luminous_MB1)
      expect(tData.at(20).text()).toMatch(shownRow.qris_ovo_MT1)
      expect(tData.at(21).text()).toMatch(shownRow.qris_ovo_MB1)
      expect(tData.at(22).text()).toMatch(shownRow.qris_dana_MT1)
      expect(tData.at(23).text()).toMatch(shownRow.qris_dana_MB1)
      expect(tData.at(24).text()).toMatch(shownRow.qris_gopay_MT1)
      expect(tData.at(25).text()).toMatch(shownRow.qris_gopay_MB1)
      expect(tData.at(26).text()).toMatch(shownRow.qris_shopeepay_MT1)
      expect(tData.at(27).text()).toMatch(shownRow.qris_shopeepay_MB1)
      expect(tData.at(28).text()).toMatch(shownRow.qris_linkaja_MT1)
      expect(tData.at(29).text()).toMatch(shownRow.qris_linkaja_MB1)
      expect(tData.at(30).text()).toMatch(shownRow.qris_spinpay_MT1)
      expect(tData.at(31).text()).toMatch(shownRow.qris_spinpay_MB1)
      expect(tData.at(32).text()).toMatch(shownRow.qris_dispenser_MT1)
      expect(tData.at(33).text()).toMatch(shownRow.qris_dispenser_MB1)
      expect(tData.at(34).text()).toMatch(shownRow.total_cash)
      expect(tData.at(35).text()).toMatch(shownRow.total_app)
      expect(tData.at(36).text()).toMatch(shownRow.total_emoney)
      expect(tData.at(37).text()).toMatch(shownRow.total_static_qris)
      expect(tData.at(38).text()).toMatch(shownRow.total_qris_dispenser)
      expect(tData.at(39).text()).toMatch(shownRow.grand_total)
    })

    const tData = wrapper.findAll("table[data-testid='table-report-by-payment'] tfoot tr td")

    expect(tData.at(0).text()).toMatch(shownRowTotal.cash_MT1)
    expect(tData.at(1).text()).toMatch(shownRowTotal.cash_MB1)
    expect(tData.at(2).text()).toMatch(shownRowTotal.app_gopay_MT1)
    expect(tData.at(3).text()).toMatch(shownRowTotal.app_gopay_MB1)
    expect(tData.at(4).text()).toMatch(shownRowTotal.app_shopeepay_MT1)
    expect(tData.at(5).text()).toMatch(shownRowTotal.app_shopeepay_MB1)
    expect(tData.at(6).text()).toMatch(shownRowTotal.app_linkaja_MT1)
    expect(tData.at(7).text()).toMatch(shownRowTotal.app_linkaja_MB1)
    expect(tData.at(8).text()).toMatch(shownRowTotal.emoney_bri_MT1)
    expect(tData.at(9).text()).toMatch(shownRowTotal.emoney_bri_MB1)
    expect(tData.at(10).text()).toMatch(shownRowTotal.emoney_bni_MT1)
    expect(tData.at(11).text()).toMatch(shownRowTotal.emoney_bni_MB1)
    expect(tData.at(12).text()).toMatch(shownRowTotal.emoney_mandiri_MT1)
    expect(tData.at(13).text()).toMatch(shownRowTotal.emoney_mandiri_MB1)
    expect(tData.at(14).text()).toMatch(shownRowTotal.emoney_bca_MT1)
    expect(tData.at(15).text()).toMatch(shownRowTotal.emoney_bca_MB1)
    expect(tData.at(16).text()).toMatch(shownRowTotal.emoney_luminous_MT1)
    expect(tData.at(17).text()).toMatch(shownRowTotal.emoney_luminous_MB1)
    expect(tData.at(18).text()).toMatch(shownRowTotal.qris_ovo_MT1)
    expect(tData.at(19).text()).toMatch(shownRowTotal.qris_ovo_MB1)
    expect(tData.at(20).text()).toMatch(shownRowTotal.qris_dana_MT1)
    expect(tData.at(21).text()).toMatch(shownRowTotal.qris_dana_MB1)
    expect(tData.at(22).text()).toMatch(shownRowTotal.qris_gopay_MT1)
    expect(tData.at(23).text()).toMatch(shownRowTotal.qris_gopay_MB1)
    expect(tData.at(24).text()).toMatch(shownRowTotal.qris_shopeepay_MT1)
    expect(tData.at(25).text()).toMatch(shownRowTotal.qris_shopeepay_MB1)
    expect(tData.at(26).text()).toMatch(shownRowTotal.qris_linkaja_MT1)
    expect(tData.at(27).text()).toMatch(shownRowTotal.qris_linkaja_MB1)
    expect(tData.at(28).text()).toMatch(shownRowTotal.qris_spinpay_MT1)
    expect(tData.at(29).text()).toMatch(shownRowTotal.qris_spinpay_MB1)
    expect(tData.at(30).text()).toMatch(shownRowTotal.qris_dispenser_MT1)
    expect(tData.at(31).text()).toMatch(shownRowTotal.qris_dispenser_MB1)
    expect(tData.at(32).text()).toMatch(shownRowTotal.total_cash)
    expect(tData.at(33).text()).toMatch(shownRowTotal.total_app)
    expect(tData.at(34).text()).toMatch(shownRowTotal.total_emoney)
    expect(tData.at(35).text()).toMatch(shownRowTotal.total_static_qris)
    expect(tData.at(36).text()).toMatch(shownRowTotal.total_qris_dispenser)
    expect(tData.at(37).text()).toMatch(shownRowTotal.grand_total)
  })
})