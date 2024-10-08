import { mount, createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import flushPromises from "flush-promises";
import TableAdministrationReportDeleteMember from "@/components/organisms/report/administration/table/TableAdministrationReportDeleteMember";
import constant_report from "@/constants/report";
import {
  return_report_card,
  formatted_report_card,
  return_report_plate,
  formatted_report_plate,
} from "./mock";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

let wrapper;
var mocks = {
  $utility: {
    getSpotId: () => {
      return "id123";
    },
    getAssetUrl: () => ({}),
    getSpotMembershipType: () => ({}),
  },
  $route: { path: "/page" },
  $sentry: {
    captureMessage: () => {},
  },
};

describe("ui.TableAdministrationReportDeleteMember.vue", () => {
  let mocksFn = {};

  beforeEach(() => {
    mocksFn["processGetData"] = jest
      .spyOn(TableAdministrationReportDeleteMember.methods, "processGetData")
      .mockImplementation();
  });

  test("test render when membership type is card render table properly with formatted card cell", async () => {
    mocks["$utility"].getSpotMembershipType = () => "CARD";
    let propsData = {
      administration: constant_report.administration_type(3),
      is_searching: true,
    };
    wrapper = await mount(TableAdministrationReportDeleteMember, {
      localVue,
      mocks,
      propsData,
    });

    wrapper.setData({
      data: {
        rows: return_report_card,
      },
      report: formatted_report_card,
      helper: { is_error: false },
    });
    await flushPromises();
    expect(wrapper.find("#tableReportData").exists()).toBe(true);
    const table_field = wrapper.findAll("#tableReportData tbody tr");
    expect(table_field.exists()).toBe(true);

    // checking table field
    await wrapper.vm.$nextTick();
    for (let index = 0; index < table_field.length; index++) {
      const report_cells = table_field.at(index).findAll("td");

      await wrapper.vm.$nextTick();
      expect(report_cells.at(0).text()).toContain(
        formatted_report_card[index].date
      );

      await wrapper.vm.$nextTick();
      expect(report_cells.at(1).text()).toContain(
        formatted_report_card[index].name
      );

      await wrapper.vm.$nextTick();
      expect(report_cells.at(2).text()).toContain(
        formatted_report_plate[index].type
      );

      await wrapper.vm.$nextTick();
      expect(report_cells.at(3).text()).toContain(
        formatted_report_card[index].license_plate
      );

      await wrapper.vm.$nextTick();
      expect(report_cells.at(4).text()).toContain(
        formatted_report_card[index].second_license_plate
      );

      await wrapper.vm.$nextTick();
      expect(report_cells.at(5).text()).toContain(
        formatted_report_card[index].rf_id
      );

      await wrapper.vm.$nextTick();
      expect(report_cells.at(6).text()).toContain(
        formatted_report_card[index].card_id
      );

      await wrapper.vm.$nextTick();
      expect(report_cells.at(7).text()).toContain(
        formatted_report_card[index].identification_number
      );

      await wrapper.vm.$nextTick();
      expect(report_cells.at(8).text()).toContain(
        formatted_report_card[index].email
      );

      await wrapper.vm.$nextTick();
      expect(report_cells.at(9).text()).toContain(
        formatted_report_card[index].user
      );

      await wrapper.vm.$nextTick();
      expect(report_cells.at(10).text()).toContain(
        formatted_report_card[index].note
      );
    }
  });

  test("test render when membership type is plate the system will render table properly with formatted plate cell", async () => {
    mocks["$utility"].getSpotMembershipType = () => "LICENSE_PLATE";
    let propsData = {
      administration: constant_report.administration_type(3),
      is_searching: true,
    };
    wrapper = await mount(TableAdministrationReportDeleteMember, {
      localVue,
      mocks,
      propsData,
    });

    wrapper.setData({
      data: {
        rows: return_report_plate,
      },
      report: formatted_report_plate,
      helper: { is_error: false },
    });
    await flushPromises();
    expect(wrapper.find("#tableReportData").exists()).toBe(true);
    const table_field = wrapper.findAll("#tableReportData tbody tr");
    expect(table_field.exists()).toBe(true);

    // checking table field
    await wrapper.vm.$nextTick();
    for (let index = 0; index < table_field.length; index++) {
      const report_cells = table_field.at(index).findAll("td");

      await wrapper.vm.$nextTick();
      expect(report_cells.at(0).text()).toContain(
        formatted_report_plate[index].date
      );

      await wrapper.vm.$nextTick();
      expect(report_cells.at(1).text()).toContain(
        formatted_report_plate[index].name
      );

      await wrapper.vm.$nextTick();
      expect(report_cells.at(2).text()).toContain(
        formatted_report_plate[index].type
      );

      await wrapper.vm.$nextTick();
      expect(report_cells.at(3).text()).toContain(
        formatted_report_plate[index].license_plate
      );

      await wrapper.vm.$nextTick();
      expect(report_cells.at(4).text()).toContain(
        formatted_report_plate[index].second_license_plate
      );

      await wrapper.vm.$nextTick();
      expect(report_cells.at(5).text()).toContain(
        formatted_report_plate[index].third_license_plate
      );

      await wrapper.vm.$nextTick();
      expect(report_cells.at(6).text()).toContain(
        formatted_report_plate[index].identification_number
      );

      await wrapper.vm.$nextTick();
      expect(report_cells.at(7).text()).toContain(
        formatted_report_plate[index].email
      );

      await wrapper.vm.$nextTick();
      expect(report_cells.at(8).text()).toContain(
        formatted_report_plate[index].user
      );

      await wrapper.vm.$nextTick();
      expect(report_cells.at(9).text()).toContain(
        formatted_report_plate[index].note
      );
    }
  });
  test("test render when membership type is test render when data is empty and the data is blank", async () => {
    mocks["$utility"].getSpotMembershipType = () => "CARD";
    let propsData = {
      administration: constant_report.administration_type(3),
      is_searching: true,
    };
    wrapper = await mount(TableAdministrationReportDeleteMember, {
      localVue,
      mocks,
      propsData,
    });

    wrapper.setData({
      data: { rows: [] },
      report: [],
      helper: { is_error: false },
    });
    await flushPromises();
    expect(wrapper.html()).toContain("Laporan belum tersedia");
  });
  test("test render when membership type is test render when data cannot be retreive and the data is blank, then render render error condition table", async () => {
    mocks["$utility"].getSpotMembershipType = () => "CARD";
    let propsData = {
      administration: constant_report.administration_type(3),
      is_searching: true,
    };
    wrapper = await mount(TableAdministrationReportDeleteMember, {
      localVue,
      mocks,
      propsData,
    });

    wrapper.setData({
      data: { rows: [] },
      report: [],
      helper: { is_error: true },
    });
    await flushPromises();
    expect(wrapper.html()).toContain("Gagal memuat data");
  });

  test("test loading state, the data and the view showing loading text", async () => {
    mocks["$utility"].getSpotMembershipType = () => "CARD";
    let propsData = {
      administration: constant_report.administration_type(3),
      is_searching: true,
    };
    wrapper = await mount(TableAdministrationReportDeleteMember, {
      localVue,
      mocks,
      propsData,
    });

    wrapper.setData({
      data: { rows: [] },
      report: [],
      helper: { is_loading: true },
    });
    await flushPromises();
    expect(wrapper.html()).toContain("Loading");
  });
});
