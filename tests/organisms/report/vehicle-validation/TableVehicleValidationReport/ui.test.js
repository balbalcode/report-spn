import { shallowMount, createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import TableVehicleValidationReport from "@/components/organisms/report/vehicle-validation/TableVehicleValidationReport";
import { dataGetReport, reportArray, reportRow, tableData, tableHeader } from "./mock";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

let wrapper;
const id = "report-vehicle-validation__table"
const mocks = {
  $utility: {
    getSpotId() { },
    getAssetUrl() { },
    getVehicleMap() { },
    formatLocalTimezone() { },
    convertToRupiah() { },
    dateUTCToLocal() { },
    setErrorContextSentry() { }
  },
  $sentry: {
    captureMessage() { },
  },
};

describe("ui.TableVehicleValidationReport.vue", () => {
  let mocksFn = {};

  beforeEach(() => {
    mocksFn = {}
    mocksFn["setVehicleMap"] = jest
      .spyOn(TableVehicleValidationReport.methods, "setVehicleMap").mockImplementation();
    mocksFn["processGetData"] = jest
      .spyOn(TableVehicleValidationReport.methods, "processGetData").mockImplementation();
    wrapper = shallowMount(TableVehicleValidationReport, { localVue, mocks })
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it.each([
    {
      case: "given filter transaction_type empty and filter gate_type empty, should show all columns",
      transaction_type: {}, gate_type: {},
      headers: tableHeader.default, data: tableData.default, transaction_index: 1
    },
    {
      case: "given filter transaction_type NON_MEMBER, should hide 'RF ID' and 'Kendaraan Member' columns",
      transaction_type: { value: "NON_MEMBER" }, gate_type: {},
      headers: tableHeader.non_member, data: tableData.non_member, transaction_index: 1
    },
    {
      case: "given filter transaction_type MEMBER and filter gate_type empty, should show all columns",
      transaction_type: { value: "MEMBER" }, gate_type: {},
      headers: tableHeader.member, data: tableData.member, transaction_index: 1
    },
    {
      case: "given filter transaction_type MEMBER and filter gate_type IN, should hide 'Kendaraan Keluar' and 'Waktu Keluar Transaksi' columns",
      transaction_type: { value: "MEMBER" }, gate_type: { value: "IN" },
      headers: tableHeader.member_in, data: tableData.member_in, transaction_index: 1
    },
    {
      case: "given filter transaction_type MEMBER and filter gate_type OUT, should hide 'Kendaraan Masuk' and 'Waktu Masuk Transaksi' columns",
      transaction_type: { value: "MEMBER" }, gate_type: { value: "OUT" },
      headers: tableHeader.member_out, data: tableData.member_out, transaction_index: 1
    },
  ])('$case', async ({ transaction_type, gate_type, headers, data, transaction_index }) => {
    wrapper.setProps({ transaction_type, gate_type })
    wrapper.vm.pagination.start = 1
    wrapper.vm.data.rows = [reportRow]
    wrapper.vm.report = [reportRow]
    await wrapper.vm.$nextTick()

    const thead_th = wrapper.findAll("#wrapper-table-report table thead tr th")

    for (let index_th = 0; index_th < thead_th.length; index_th++) {
      expect(thead_th.at(index_th).text()).toMatch(headers[index_th])
    }

    const tbody_tr = wrapper.findAll("#wrapper-table-report table tbody tr")

    for (let index_tr = 0; index_tr < tbody_tr.length; index_tr++) {
      const td = tbody_tr.at(index_tr).findAll("td")

      for (let index_td = 0; index_td < tbody_tr.length; index_td++) {
        if (index_td !== transaction_index) {
          expect(td.at(index_td).text()).toMatch(data[index_tr][index_td])
        }
      }

      const label_transaction_id = wrapper.findComponent({ ref: `label-transaction-id-${index_tr}` })
      expect(label_transaction_id.exists()).toBe(true)
      expect(label_transaction_id.props("value")).toMatch(data[index_tr][transaction_index])
    }
  })

  it("trigger click on a certain row, should call toggleModalDetail with its index as param", async () => {
    wrapper.vm.toggleModalDetail = mocksFn['toggleModalDetail'] = jest.fn()

    wrapper.vm.report = [...reportArray]
    await wrapper.vm.$nextTick()

    const tbody_tr = wrapper.findAll(`table#${id} tbody tr`)

    await tbody_tr.at(2).trigger("click")
    await tbody_tr.at(0).trigger("click")

    expect(mocksFn['toggleModalDetail'].mock.calls).toEqual([[2], [0]])
  })

  it("given modal.detail true and selected_data filled, should show detail vehicle validation info", async () => {
    const selected_data = { ...reportArray[0], index: 0, order: 16 }
    wrapper.vm.selected_data = selected_data
    wrapper.vm.modal.detail = true
    await wrapper.vm.$nextTick()

    const numberLabel = wrapper.find(`[data-testid="${id}__modal-detail__number"]`)
    expect(numberLabel.text()).toMatch(selected_data.order.toString())

    const idLabel = wrapper.find(`[data-testid="${id}__modal-detail__id"]`)
    expect(idLabel.text()).toMatch(selected_data.id)

    const licenseLabel = wrapper.find(`[data-testid="${id}__modal-detail__license-plate"]`)
    expect(licenseLabel.text()).toMatch(selected_data.license_plate)

    const rfidLabel = wrapper.find(`[data-testid="${id}__modal-detail__rfid"]`)
    expect(rfidLabel.text()).toMatch(selected_data.rf_id)

    const vhcMemberLabel = wrapper.find(`[data-testid="${id}__modal-detail__vhc-member"]`)
    expect(vhcMemberLabel.text()).toMatch(selected_data.vehicle_code_member)

    const vhcInLabel = wrapper.find(`[data-testid="${id}__modal-detail__vhc-in"]`)
    expect(vhcInLabel.text()).toMatch(selected_data.vehicle_code)

    const vhcOutLabel = wrapper.find(`[data-testid="${id}__modal-detail__vhc-out"]`)
    expect(vhcOutLabel.text()).toMatch(selected_data.vehicle_code_out)

    const statusLabel = wrapper.find(`[data-testid="${id}__modal-detail__status"]`)
    expect(statusLabel.text()).toMatch(selected_data.status)

    const timeInLabel = wrapper.find(`[data-testid="${id}__modal-detail__time-in"]`)
    expect(timeInLabel.text()).toMatch(selected_data.time_in)

    const timeOutLabel = wrapper.find(`[data-testid="${id}__modal-detail__time-out"]`)
    expect(timeOutLabel.text()).toMatch(selected_data.time_out)
  })
});
