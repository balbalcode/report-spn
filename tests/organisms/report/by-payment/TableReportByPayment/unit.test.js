import { shallowMount } from "@vue/test-utils";

import TableReportByPayment from "@/components/organisms/report/by-payment/TableReportByPayment"
import { dataReport, formattedContent, formattedHeader, formattedTotal, payloadDownload, payloadGet, spotId, vehicles, month, payloadGetTimezone, dateRange } from "./mock";

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

describe('unit.TableReportByPayment.vue', () => {
  beforeEach(() => {
    mocksFn = {}
    mocksFn['get_report'] = jest.fn()
    mocksFn['setBatchReport'] = jest.spyOn(TableReportByPayment.methods, "setBatchReport").mockImplementation()
    mocks.$utility.getFormattedVehicle = mocksFn['$utility.getFormattedVehicle'] = jest.fn().mockReturnValueOnce(vehicles)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it("test mounted lifecycle, should set helper.is_init to true and set vehicles with returned data from $utility.getFormattedVehicle", async () => {
    wrapper = shallowMount(TableReportByPayment, { mocks, stubs, propsData: { get_report: mocksFn['get_report'] } })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.helper.is_init).toBe(true)
    expect(mocksFn['setBatchReport'].mock.calls).toEqual([[]])
    expect(wrapper.vm.vehicles).toEqual(vehicles)
  })

  describe('test watch is_searching', () => {
    describe('is_searching', () => {
      it.each([
        {
          case: "given is_searching changed from false to true and type 'shift', should set helper.batch_size to 1 and call batchReport.gatherData",
          propsData: { is_searching: true, type: 'shift', month }, batchSize: 1,
          fnMocked: {
            'batchReport.setMonth': { calls: [[month]] },
            'batchReport.gatherData': { calls: [[]] },
          }
        }, {
          case: "given is_searching changed from false to true and type 'daily', should set helper.batch_size to 3 and call batchReport.gatherData",
          propsData: { is_searching: true, type: 'daily', month }, batchSize: 3,
          fnMocked: {
            'batchReport.setMonth': { calls: [[month]] },
            'batchReport.gatherData': { calls: [[]] },
          }
        }, {
          case: "given is_searching changed from true to false, shouldn't call batchReport.gatherData",
          propsData: { is_searching: false, month }, batchSize: 3,
          fnMocked: {
            'batchReport.setMonth': { calls: [] },
            'batchReport.gatherData': { calls: [] },
          }
        }
      ])('$case', async ({ propsData, batchSize, fnMocked }) => {
        // preset
        wrapper.vm.batchReport.setMonth = jest.fn()
        wrapper.vm.batchReport.gatherData = jest.fn()

        wrapper.setProps({ is_searching: !propsData.is_searching })
        await wrapper.vm.$nextTick()

        // test
        wrapper.vm.batchReport.setMonth = mocksFn['batchReport.setMonth'] = jest.fn()
        wrapper.vm.batchReport.gatherData = mocksFn['batchReport.gatherData'] = jest.fn()

        wrapper.setProps(propsData)
        await wrapper.vm.$nextTick()

        expect(wrapper.vm.batchReport.batchSize).toBe(batchSize)
        expect(mocksFn['batchReport.setMonth'].mock.calls).toEqual(fnMocked['batchReport.setMonth'].calls)
        expect(mocksFn['batchReport.gatherData'].mock.calls).toEqual(fnMocked['batchReport.gatherData'].calls)
      })
    })

    it("once batchReport.loadingBatch get changed, should emit loadingBatch", async () => {
      wrapper.vm.batchReport.loadingBatch = true
      await wrapper.vm.$nextTick()

      wrapper.vm.batchReport.loadingBatch = false
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted("loadingBatch")).toEqual([[true], [false]])
    })
  })

  describe('test computed & methods', () => {
    beforeEach(() => {
      wrapper = shallowMount(TableReportByPayment, { mocks, stubs, propsData: { get_report: () => (dataReport) } })
    })

    describe('test computed has_nested_payment', () => {
      test.each([
        {
          case: "given column has nested payment, should return true",
          column: [{ value: 'app_gopay' }], has_nested_payment: true
        },
        {
          case: "given column has not nested payment, should return false",
          column: [{ value: 'cash' }], has_nested_payment: false
        }
      ])('$case', async ({ column, has_nested_payment }) => {
        wrapper.setProps({ column })
        await wrapper.vm.$nextTick()

        expect(wrapper.vm.has_nested_payment).toBe(has_nested_payment)
      })
    })

    test("test computed column_list, should return array of each value of column", async () => {
      const column = [{ value: "cash" }, { value: "app_shopeepay" }]
      const column_list = ["cash", "app_shopeepay"]

      wrapper.setProps({ column })
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.column_list).toEqual(column_list)
    })

    test("test computed selected_length, should return number of selected item in every cashless_groups", async () => {
      const column_list = ["app_gopay", "emoney_bri", "emoney_mandiri", "qris_gopay", "qris_spinpay", "qris_ovo", "qris_linkaja"]
      const selected_length = { emoney: 2, app_cashless: 1, static_qris: 4 }

      wrapper.setProps({ column: column_list.map(item => ({ value: item })) })
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.selected_length).toEqual(selected_length)
    })

    describe("setPayloadGet", () => {
      test.each([
        {
          case: "given has timezone, should return payload with timezone data",
          propsData: { month: month, type: "daily", has_timezone: true, timezone: "Asia/Jakarta" },
          payload: payloadGetTimezone
        }, {
          case: "given hasnt timezone, should return payload without timezone data",
          propsData: { month: month, type: "daily" },
          payload: payloadGet
        }, {
          case: "given hasnt type, should return payload with type daily as default",
          propsData: { month: month, type: "daily" },
          payload: payloadGet
        }
      ])("$case", async ({ propsData, payload }) => {
        wrapper.vm.$utility.getSpotId = mocksFn['$utility.getSpotId'] = jest.fn().mockReturnValueOnce(spotId)
        wrapper.setProps(propsData)
        await wrapper.vm.$nextTick()

        const receivedPayload = wrapper.vm.setPayloadGet(dateRange)
        expect(receivedPayload).toEqual(payload)
      })
    })

    describe('test passFormatDownloadReport', () => {
      test.each([
        {
          case: "given data.rows filled, should call both formatHeaderReport and formatContentReport",
          data: dataReport, payload: payloadDownload,
          fnMocked: {
            formatHeaderReport: { calls: [[]], returnedValue: formattedHeader },
            formatContentReport: { calls: [[]], returnedValue: formattedContent }
          }
        }, {
          case: "given data.rows empty, should not call formatHeaderReport nor formatContentReport",
          data: { rows: [], total: {}, last_sync: "" }, payload: { header: {}, content: [] },
          fnMocked: { formatHeaderReport: { calls: [] }, formatContentReport: { calls: [] } }
        }
      ])('$case', async ({ data, payload, fnMocked }) => {
        wrapper.vm.formatHeaderReport = mocksFn['formatHeaderReport'] =
          jest.fn().mockReturnValueOnce(fnMocked['formatHeaderReport'].returnedValue)
        wrapper.vm.formatContentReport = mocksFn['formatContentReport'] =
          jest.fn().mockReturnValueOnce(fnMocked['formatContentReport'].returnedValue)

        wrapper.vm.data = data
        await wrapper.vm.$nextTick()

        wrapper.vm.passFormatDownloadReport()

        expect(wrapper.emitted("ready")).toEqual([[payload]])
        expect(mocksFn['formatHeaderReport'].mock.calls).toEqual(fnMocked['formatHeaderReport'].calls)
        expect(mocksFn['formatContentReport'].mock.calls).toEqual(fnMocked['formatContentReport'].calls)
      })
    })

    describe("formatColumnClass", () => {
      const vehicleList1 = [{ text: "MB1", value: "Mobil" }, { text: "MT1", value: "Motor" }]
      const vehicleList2 = [{ text: "MB1", value: "Mobil" }, { text: "MT1", value: "Motor" }, { text: "KL1", value: "Truk" }]
      it.each([
        { vehicle: vehicleList1, col_idx: 0, vhc_idx: 0, colClass: 'even' },
        { vehicle: vehicleList1, col_idx: 0, vhc_idx: 1, colClass: 'odd' },
        { vehicle: vehicleList1, col_idx: 1, vhc_idx: 0, colClass: 'even' },
        { vehicle: vehicleList1, col_idx: 1, vhc_idx: 1, colClass: 'odd' },
        { vehicle: vehicleList2, col_idx: 0, vhc_idx: 0, colClass: 'even' },
        { vehicle: vehicleList2, col_idx: 0, vhc_idx: 1, colClass: 'odd' },
        { vehicle: vehicleList2, col_idx: 1, vhc_idx: 0, colClass: 'odd' },
        { vehicle: vehicleList2, col_idx: 1, vhc_idx: 1, colClass: 'even' },
      ])(
        'given vehicle.length $vehicle.length, col_idx $col_idx and vhc_idx $vhc_idx, should return $colClass',
        async ({ vehicle, col_idx, vhc_idx, colClass }) => {
          wrapper.setProps({ vehicle })
          await wrapper.vm.$nextTick()

          const receivedClass = wrapper.vm.formatColumnClass(col_idx, vhc_idx)
          expect(receivedClass).toMatch(colClass)
        }
      )
    })

    test("once formatHeaderReport called, should return valid formatted header", () => {
      const header = wrapper.vm.formatHeaderReport()
      expect(header).toEqual(formattedHeader)
    })

    test("once formatContentReport called, should return valid formatted content", async () => {
      wrapper.vm.data = dataReport
      await wrapper.vm.$nextTick()

      const content = wrapper.vm.formatContentReport()
      expect(content).toEqual(formattedContent)
    })

    it.todo("once processConcatData")

    it("once processGetReport called, should call setPayloadGetBatch and get_report", async () => {
      wrapper.vm.setPayloadGet = mocksFn['setPayloadGet'] = jest.fn().mockReturnValueOnce(payloadGet)
      mocksFn['get_report'] = jest.fn().mockReturnValueOnce(dataReport)

      wrapper.setProps({ get_report: mocksFn['get_report'] })
      await wrapper.vm.$nextTick()

      const receivedValue = await wrapper.vm.processGetReport(dateRange)

      expect(mocksFn['setPayloadGet'].mock.calls).toEqual([[dateRange]])
      expect(receivedValue).toEqual(dataReport)
    })
  })
})