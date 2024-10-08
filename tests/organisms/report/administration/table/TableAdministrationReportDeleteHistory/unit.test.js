import { shallowMount, createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import TableAdministrationReportDeleteHistory from "@/components/organisms/report/administration/table/TableAdministrationReportDeleteHistory";
import constant_report from "@/constants/report";
import { return_report_card, return_report_plate } from "./mock";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

let propsData;
let wrapper;
var mocks = {
  $utility: {
    getSpotId: () => {
      return "id123";
    },
    getAssetUrl: () => ({}),
    formatDateMoment: () => "mocked",
    formatLocalTimezone: () => "mocked",
    getSpotMembershipType: () => "CARD",
  },
  $route: { path: "/page" },
  $sentry: {
    captureMessage: () => {},
  },
};

test("test function formatContentReport with membership plate type, the function should result data pack which allows user to render only 1 license plate, doesnt have rf id and doesnt have card id", async () => {
  propsData = {
    administration: constant_report.administration_type(3),
  };
  wrapper = await shallowMount(TableAdministrationReportDeleteHistory, {
    localVue,
    mocks,
    propsData,
  });
  wrapper.setData({ helper: { membership_type: "LICENSE_PLATE" } });
  wrapper.setData({ data: return_report_plate.values });
  await wrapper.vm.$nextTick();
  const actual_payload = wrapper.vm.formatContentReport();
  await wrapper.vm.$nextTick();
  const expected_payload = [
    {
      date: "Nov-23",
      type: "Hapus Riwayat Member",
      name: "Balbal",
      identification_number: "xxx",
      email: "iam@balbal.my.id",
      vehicle_name: "Motor Kecil",
      product_name: "MEMBERSHIP ASIX",
      start: "mocked",
      end: "mocked",
      created_at: "mocked",
      note: "-",
      user: "iqbal",
      license_plate: "B1SPN",
    },
  ];
  await wrapper.vm.$nextTick();
  expect(actual_payload).toEqual(expected_payload);
});

test("test function formatContentReport with membership card type, the function should result data pack which allows user render 2 plates, having rf id and having card id", async () => {
  await wrapper.vm.$nextTick();
  propsData = {
    administration: constant_report.administration_type(3),
  };
  wrapper = await shallowMount(TableAdministrationReportDeleteHistory, {
    localVue,
    mocks,
    propsData,
  });
  await wrapper.vm.$nextTick();
  wrapper.setData({ helper: { membership_type: "CARD" } });
  await wrapper.vm.$nextTick();
  wrapper.setData({ data: return_report_card.values });
  await wrapper.vm.$nextTick();
  const actual_payload = wrapper.vm.formatContentReport();
  const expected_payload = [
    {
      date: "Nov-23",
      type: "Hapus Riwayat Member",
      name: "Balbal",
      identification_number: "xxx",
      email: "iam@balbal.my.id",
      vehicle_name: "Motor Kecil",
      product_name: "MEMBERSHIP ASIX",
      start: "mocked",
      end: "mocked",
      created_at: "mocked",
      note: "-",
      user: "iqbal",
      rf_id: "1234",
      card_id: "2017",
      license_plate: "B1SPN",
      second_license_plate: "B2SPN",
    },
  ];
  await wrapper.vm.$nextTick();
  expect(actual_payload).toEqual(expected_payload);
});

describe("unit.TableAdministrationReportDeleteHistory.vue", () => {
  let mocksFn = {};

  beforeEach(() => {
    mocksFn["processGetData"] = jest
      .spyOn(TableAdministrationReportDeleteHistory.methods, "processGetData")
      .mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("test mounted lifecycle with true searching props. the system will call function set member type and process get data", async () => {
    propsData = {
      administration: constant_report.administration_type(3),
      is_searching: true,
    };

    mocksFn["setMemberType"] = jest
      .spyOn(TableAdministrationReportDeleteHistory.methods, "setMemberType")
      .mockImplementation();
    wrapper = await shallowMount(TableAdministrationReportDeleteHistory, {
      localVue,
      mocks,
      propsData,
    });

    await wrapper.vm.$nextTick();
    expect(mocksFn["setMemberType"]).toHaveBeenCalled();
    expect(mocksFn["processGetData"]).toHaveBeenCalled();
  });

  test("test mounted lifecycle with false searching props. the system will call function set member type and process get data", async () => {
    propsData = {
      administration: constant_report.administration_type(3),
      is_searching: false,
    };

    mocksFn["setMemberType"] = jest
      .spyOn(TableAdministrationReportDeleteHistory.methods, "setMemberType")
      .mockImplementation();
    wrapper = await shallowMount(TableAdministrationReportDeleteHistory, {
      localVue,
      mocks,
      propsData,
    });

    await wrapper.vm.$nextTick();
    expect(mocksFn["setMemberType"]).toHaveBeenCalled();
    expect(mocksFn["processGetData"]).not.toHaveBeenCalled();
  });

  test("test watcher is_searching after mounted (vue lifecycle). the system will call function set member type and process get data rwice", async () => {
    propsData = {
      administration: constant_report.administration_type(3),
      is_searching: true,
    };

    mocksFn["setMemberType"] = jest
      .spyOn(TableAdministrationReportDeleteHistory.methods, "setMemberType")
      .mockImplementation();
    wrapper = await shallowMount(TableAdministrationReportDeleteHistory, {
      localVue,
      mocks,
      propsData,
    });
    expect(mocksFn["setMemberType"]).toHaveBeenCalled();
    expect(mocksFn["processGetData"]).toHaveBeenCalled();
    await wrapper.vm.$nextTick();
    wrapper.vm.is_searching = true;
    expect(mocksFn["setMemberType"]).toHaveBeenCalled();
    expect(mocksFn["processGetData"]).toHaveBeenCalled();
  });

  test("test function passErrorToParent with filled arguments error message, should emits 'error' with error message arguments", async () => {
    propsData = {
      administration: constant_report.administration_type(3),
    };
    mocksFn["setMemberType"] = jest
      .spyOn(TableAdministrationReportDeleteHistory.methods, "setMemberType")
      .mockImplementation();
    wrapper = await shallowMount(TableAdministrationReportDeleteHistory, {
      localVue,
      mocks,
      propsData,
    });
    const expected_message = "mocked-error!";
    wrapper.vm.passErrorToParent(expected_message);
    expect(wrapper.emitted("error").length).toEqual(1);
    expect(wrapper.emitted("error")[0]).toEqual([
      { state: true, message: expected_message },
    ]);
  });

  test("test function passErrorToParent with default error message, should emits 'error' with default error message", async () => {
    propsData = {
      administration: constant_report.administration_type(3),
    };
    mocksFn["setMemberType"] = jest
      .spyOn(TableAdministrationReportDeleteHistory.methods, "setMemberType")
      .mockImplementation();
    wrapper = await shallowMount(TableAdministrationReportDeleteHistory, {
      localVue,
      mocks,
      propsData,
    });
    const expected_message = "something error!";
    wrapper.vm.passErrorToParent();
    expect(wrapper.emitted("error").length).toEqual(1);
    expect(wrapper.emitted("error")[0]).toEqual([
      { state: true, message: expected_message },
    ]);
  });

  test("test function passFormatDownloadReport with blank data rows, should emits 'ready' and blank data", async () => {
    propsData = {
      administration: constant_report.administration_type(3),
    };
    mocksFn["setMemberType"] = jest
      .spyOn(TableAdministrationReportDeleteHistory.methods, "setMemberType")
      .mockImplementation();
    wrapper = await shallowMount(TableAdministrationReportDeleteHistory, {
      localVue,
      mocks,
      propsData,
    });
    const expected_payload = { header: {}, content: [] };
    wrapper.vm.passFormatDownloadReport();
    expect(wrapper.emitted("ready").length).toEqual(1);
    expect(wrapper.emitted("ready")[0]).toEqual([expected_payload]);
  });

  test("test function passFormatDownloadReport with filled data rows, should emits 'ready' and data sets", async () => {
    propsData = {
      administration: constant_report.administration_type(3),
    };
    mocksFn["setMemberType"] = jest
      .spyOn(TableAdministrationReportDeleteHistory.methods, "setMemberType")
      .mockImplementation();
    wrapper = await shallowMount(TableAdministrationReportDeleteHistory, {
      localVue,
      mocks,
      propsData,
    });
    const expected_payload = { header: "mocked!", content: "mocked!" };
    wrapper.setData({ data: return_report_card.values });
    wrapper.vm.formatHeaderReport = jest
      .fn()
      .mockImplementation()
      .mockReturnValue("mocked!");
    wrapper.vm.formatContentReport = jest
      .fn()
      .mockImplementation()
      .mockReturnValue("mocked!");
    wrapper.vm.passFormatDownloadReport();
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("ready").length).toEqual(1);
    expect(wrapper.emitted("ready")[0]).toEqual([expected_payload]);
  });

  test("test function setMemberType, should setting the props helper membership type based on function result utility getSpotMembershipType", async () => {
    propsData = {
      administration: constant_report.administration_type(3),
    };
    jest.restoreAllMocks();
    mocks["$utility"].getSpotMembershipType = () => "card";
    wrapper = await shallowMount(TableAdministrationReportDeleteHistory, {
      localVue,
      mocks,
      propsData,
    });
    const expected_result = "card";
    wrapper.vm.setMemberType();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.helper.membership_type).toEqual(expected_result);
  });

  test("test function setPayloadGet, should passing payload with argument (month, administration, name based on props), (spot id and type based on utilities function)", async () => {
    propsData = {
      month: "mocked-month",
      administration: constant_report.administration_type(3),
    };
    wrapper = await shallowMount(TableAdministrationReportDeleteHistory, {
      localVue,
      mocks,
      propsData,
    });
    jest.restoreAllMocks();
    await wrapper.vm.$nextTick();
    const actual_payload = wrapper.vm.setPayloadGet();
    const expected_payload = {
      filter: [
        { key: "month", value: "mocked-month" },
        { key: "spot_id", value: "id123" },
        { key: "administration", value: "DELETE_MEMBERSHIP_HISTORY" },
        { key: "name", value: "" },
        { key: "type", value: "card" },
      ],
    };
    expect(expected_payload).toEqual(actual_payload);
  });

  test("test function formatHeaderReport with card membership type. the return should having 2 plates, having rf id and having card number also having specific date membership", async () => {
    propsData = {
      administration: constant_report.administration_type(3),
    };
    wrapper = await shallowMount(TableAdministrationReportDeleteHistory, {
      localVue,
      mocks,
      propsData,
    });
    wrapper.setData({ helper: { membership_type: "CARD" } });
    const actual_payload = wrapper.vm.formatHeaderReport();
    const expected_payload = {
      Tanggal: "date",
      Nama: "name",
      "Jenis Kendaraan": "vehicle_name",
      "Jenis Administrasi": "type",
      "Plat 1": "license_plate",
      RFID: "rf_id",
      "Nomor Kartu": "number",
      "Plat 2": "second_license_plate",
      "Nomor Identitas": "identification_number",
      Email: "email",
      Produk: "product_name",
      "Tanggal Terdaftar": "start",
      "Tanggal Berakhir": "end",
      "Tanggal Dibuat": "created_at",
      User: "user",
      Catatan: "note",
    };
    expect(expected_payload).toEqual(actual_payload);
  });

  test("test function formatHeaderReport with plate membership type. the result should having only 1 plate, doesnt have rf id and card number also specific date of membership", async () => {
    propsData = {
      administration: constant_report.administration_type(3),
    };
    wrapper = await shallowMount(TableAdministrationReportDeleteHistory, {
      localVue,
      mocks,
      propsData,
    });
    wrapper.setData({ helper: { membership_type: "LICENSE_PLATE" } });
    const actual_payload = wrapper.vm.formatHeaderReport();
    const expected_payload = {
      Tanggal: "date",
      Nama: "name",
      "Jenis Kendaraan": "vehicle_name",
      "Jenis Administrasi": "type",
      "Plat 1": "license_plate",
      "Nomor Identitas": "identification_number",
      Email: "email",
      Produk: "product_name",
      "Tanggal Terdaftar": "start",
      "Tanggal Berakhir": "end",
      "Tanggal Dibuat": "created_at",
      User: "user",
      Catatan: "note",
    };
    expect(expected_payload).toEqual(actual_payload);
  });

  test("test function formatContentReport with blank data, should returning blank array", async () => {
    propsData = {
      administration: constant_report.administration_type(3),
    };
    wrapper = await shallowMount(TableAdministrationReportDeleteHistory, {
      localVue,
      mocks,
      propsData,
    });
    const actual_payload = wrapper.vm.formatContentReport();
    const expected_payload = [];
    expect(actual_payload).toEqual(expected_payload);
    jest.restoreAllMocks();
  });
  test("test function formatContentReport with error state should returning blank array, then function pass error should call also send message to sentry", async () => {
    propsData = {
      administration: constant_report.administration_type(3),
    };
    delete mocks.$utility.formatDateMoment;
    delete mocks.$utility.formatLocalTimezone;
    mocks["$utility"].setErrorContextSentry = jest.fn().mockImplementation();
    wrapper = await shallowMount(TableAdministrationReportDeleteHistory, {
      localVue,
      mocks,
      propsData,
    });

    wrapper.vm.passErrorToParent = jest.fn().mockImplementation();
    wrapper.setData({ data: return_report_card.values });
    const actual_payload = wrapper.vm.formatContentReport();
    expect(mocks["$utility"].setErrorContextSentry).toHaveBeenCalled();
    expect(wrapper.vm.passErrorToParent).toHaveBeenCalled();
    expect(actual_payload).toEqual([]);
    jest.restoreAllMocks();
  });
  test("test function processGetData with success retreive, the function should call function passFormatDownloadReport and getAdministrationReport to format data", async () => {
    jest.restoreAllMocks();
    propsData = {
      administration: constant_report.administration_type(3),
    };
    mocksFn["passFormatDownloadReport"] = jest
      .spyOn(
        TableAdministrationReportDeleteHistory.methods,
        "passFormatDownloadReport"
      )
      .mockImplementation();
    mocksFn["getAdministrationReport"] = jest
      .spyOn(
        TableAdministrationReportDeleteHistory.methods,
        "getAdministrationReport"
      )
      .mockImplementation();
    wrapper = await shallowMount(TableAdministrationReportDeleteHistory, {
      localVue,
      mocks,
      propsData,
    });
    await wrapper.vm.$nextTick();
    wrapper.vm.processGetData();
    await wrapper.vm.$nextTick();
    expect(mocksFn["passFormatDownloadReport"]).toHaveBeenCalled();
    expect(mocksFn["getAdministrationReport"]).toHaveBeenCalled();
  });
  test("test function processGetData with failed retreive, the function shouldnt calling function passFormatDownloadReport and getAdministrationReport and should setting is error helper are true", async () => {
    jest.restoreAllMocks();
    propsData = {
      administration: constant_report.administration_type(3),
    };
    mocksFn["getAdministrationReport"] = jest.fn().mockImplementation();
    mocksFn["passFormatDownloadReport"] = jest
      .spyOn(
        TableAdministrationReportDeleteHistory.methods,
        "passFormatDownloadReport"
      )
      .mockImplementation();
    wrapper = await shallowMount(TableAdministrationReportDeleteHistory, {
      localVue,
      mocks,
      propsData,
    });
    await wrapper.vm.$nextTick();
    wrapper.vm.getAdministrationReport = new Error("something error!");
    await wrapper.vm.$nextTick();
    wrapper.vm.processGetData();
    await wrapper.vm.$nextTick();
    expect(mocksFn["getAdministrationReport"]).not.toHaveBeenCalled();
    expect(wrapper.vm.helper.is_error).toBe(true);
  });
});
