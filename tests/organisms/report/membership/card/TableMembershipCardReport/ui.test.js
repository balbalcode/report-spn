import { createLocalVue, shallowMount } from "@vue/test-utils";
import { TooltipPlugin } from "bootstrap-vue";

import TableMembershipCardReport from "@/components/organisms/report/membership/card/TableMembershipCardReport";
import { dataGet } from "./mock";

let wrapper;
let mocksFn = {};

const localVue = createLocalVue();
localVue.use(TooltipPlugin);

const mocks = {
  $utility: {
    getSpotId: () => "",
    encodeReportFilterUrl: () => "",
    formatDateMoment: () => "",
    convertToRupiah: () => "",
    getAssetUrl: () => "",
    setErrorContextSentry() { },
  },
  $sentry: {
    captureMessage() { }
  },
};

describe("ui.TableMembershipCardReport.vue", () => {
  beforeEach(async () => {
    mocksFn = {};
    mocksFn["processGetData"] = jest
      .spyOn(TableMembershipCardReport.methods, "processGetData")
      .mockImplementation();
    wrapper = shallowMount(TableMembershipCardReport, { localVue, mocks });
    wrapper.vm.data = { ...dataGet };
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test("given filled data.rows, should show each row on table", () => {
    for (let indexRow = 0; indexRow < dataGet.rows.length; indexRow++) {
      const dataRow = dataGet.rows[indexRow];

      let element = wrapper.find(`[data-testid="tr-${indexRow}__td-date"]`);
      expect(element.exists()).toBeTruthy();
      expect(element.text()).toMatch(dataRow.date);

      element = wrapper.find(`[data-testid="tr-${indexRow}__td-name"]`);
      expect(element.exists()).toBeTruthy();
      expect(element.text()).toMatch(dataRow.employee_name);

      element = wrapper.findComponent({ ref: `tr-${indexRow}__label-phone` });
      expect(element.exists()).toBeTruthy();
      expect(element.props("value")).toBe(dataRow.user_phone_number);

      element = wrapper.find(`[data-testid="tr-${indexRow}__td-identity"]`);
      expect(element.exists()).toBeTruthy();
      expect(element.text()).toMatch(dataRow.identification_number);

      element = wrapper.find(`[data-testid="tr-${indexRow}__td-rfid"]`);
      expect(element.exists()).toBeTruthy();
      expect(element.text()).toMatch(dataRow.rf_id);

      element = wrapper.findComponent({ ref: `tr-${indexRow}__label-plate-1` });
      expect(element.exists()).toBeTruthy();
      expect(element.props("value")).toBe(dataRow.license_plate);

      element = wrapper.findComponent({ ref: `tr-${indexRow}__label-plate-2` });
      expect(element.exists()).toBeTruthy();
      expect(element.props("value")).toBe(dataRow.second_license_plate);

      element = wrapper.find(`[data-testid="tr-${indexRow}__td-card-number"]`);
      expect(element.exists()).toBeTruthy();
      expect(element.text()).toMatch(dataRow.printed_id);

      element = wrapper.find(`[data-testid="tr-${indexRow}__td-period"]`);
      expect(element.exists()).toBeTruthy();
      expect(element.text()).toMatch(dataRow.period);

      element = wrapper.find(`[data-testid="tr-${indexRow}__td-old"]`);
      expect(element.exists()).toBeTruthy();
      expect(element.text()).toMatch(dataRow.old_member);

      element = wrapper.find(`[data-testid="tr-${indexRow}__td-new"]`);
      expect(element.exists()).toBeTruthy();
      expect(element.text()).toMatch(dataRow.new_member);

      element = wrapper.find(`[data-testid="tr-${indexRow}__td-product"]`);
      expect(element.exists()).toBeTruthy();
      expect(element.text()).toMatch(dataRow.product_name);

      element = wrapper.find(`[data-testid="tr-${indexRow}__td-user"]`);
      expect(element.exists()).toBeTruthy();
      expect(element.text()).toMatch(dataRow.mgmt_user_name);

      element = wrapper.findComponent({
        ref: `tr-${indexRow}__label-payment-method`,
      });
      expect(element.exists()).toBeTruthy();
      expect(element.props("value")).toBe(dataRow.payment_method);

      element = wrapper.findComponent({ ref: `tr-${indexRow}__label-ref` });
      expect(element.exists()).toBeTruthy();
      expect(element.props("value")).toBe(dataRow.reference);

      element = wrapper.findComponent({
        ref: `tr-${indexRow}__label-paid-date`,
      });
      expect(element.exists()).toBeTruthy();
      expect(element.props("value")).toBe(dataRow.paid_date);

      element = wrapper.findComponent({
        ref: `tr-${indexRow}__td-payment-receipt`,
      });
      expect(element.exists()).toBeTruthy();

      element = wrapper.findComponent({ ref: `tr-${indexRow}__label-amount` });
      expect(element.exists()).toBeTruthy();
      expect(element.props("value")).toBe(dataRow.amount);
    }
  })

  describe("btn-preview-image", () => {
    test.each([
      { case: "given receipt_payment, should exist", index: 1, exists: true },
      { case: "given empty receipt_payment, shouldn't exist", index: 0, exists: false },
    ])("$case", ({ index, exists }) => {
      const btn = wrapper.findComponent({ ref: `tr-${index}__btn-preview-image` })
      expect(btn.exists()).toBe(exists)
    })
  })

  describe("btn-preview-image", () => {
    test.each([
      { case: "given receipt_payment, shouldn't exist", index: 1, exists: false },
      { case: "given empty receipt_payment, should exist", index: 0, exists: true },
    ])("$case", ({ index, exists }) => {
      const element = wrapper.find(`[data-testid="tr-${index}__label-unavailable"]`)
      expect(element.exists()).toBe(exists)
    })
  })
})
