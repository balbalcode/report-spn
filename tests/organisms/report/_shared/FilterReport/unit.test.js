import { shallowMount, createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import FilterReport from "@/components/organisms/report/_shared/FilterReport";
import {
  FORMATTED_VEHICLE,
  VEHICLE_RETURN,
  allUserOptions,
  columnOptions,
  locationOptions,
  payloadGetOfficer,
  superadminOptions,
  userData,
  userOptions,
  exampleOptionLessThan10,
  exampleOption10,
  exampleOptionMoreThan10,
  payloadGetUser,
} from "./mock";
import Vuelidate from "vuelidate";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuelidate);

let wrapper;
let mocks = {
  $utility: {
    getSpotId: () => "mocked-spot",
    setErrorContextSentry: () => { },
    getOptionProductMembership: () => {
      return [
        {
          name: "product-mocked-name",
          id: "product-mocked-id",
        },
      ];
    },
    getVehicle: () => {
      return VEHICLE_RETURN;
    },
    formatDateMoment: () => "",
  },
  $sentry: {
    captureMessage() { },
  },
};

describe("unit.FilterReport.vue", () => {
  let mocksFn = {};

  beforeEach(() => {
    mocksFn = {};
    wrapper = shallowMount(FilterReport, { localVue, mocks });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("test watcher transaction_type when the selected value is MEMBER, should set value gate type is same with same value with gate type", async () => {
    wrapper.vm.gate_type = "mocked";
    wrapper.vm.helper.old_gate_type = "mockeds";
    await wrapper.vm.$nextTick();
    wrapper.vm.transaction_type = { value: "MEMBER" };
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.gate_type).toEqual("mockeds");
    expect(wrapper.vm.helper.gate_type).toEqual(true);
  });
  test("test watcher transaction_type when the selected value isn't MEMBER, should set value old gate type is same with same value with gate type then set gate type to blank object", async () => {
    wrapper.vm.gate_type = "mocked";
    await wrapper.vm.$nextTick();
    wrapper.vm.transaction_type = { value: "NOT-MEMBER" };
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.helper.old_gate_type).toEqual("mocked");
    expect(wrapper.vm.gate_type).toEqual({});
    expect(wrapper.vm.helper.gate_type).toEqual(false);
  });

  describe("test validations", () => {
    describe("location", () => {
      it.each([
        {
          case: "given has_location=false, $v.location.$error should be false",
          propsData: { has_location: false, is_single_location: false },
          location: "",
          $v: { maxLength: true, $error: false },
        },
        {
          case: "given has_location=true and is_single_location=true, $v.location.$error should be false",
          propsData: { has_location: true, is_single_location: true },
          location: "",
          $v: { maxLength: true, $error: false },
        },
        {
          case: "given has_location=true, is_single_location=false and location empty, $v.location.$error should be false",
          propsData: { has_location: true, is_single_location: false },
          location: [],
          $v: { maxLength: true, $error: false },
        },
        {
          case: "given has_location=true, is_single_location=false and location.length<10, $v.location.$error should be false",
          propsData: { has_location: true, is_single_location: false },
          location: exampleOptionLessThan10,
          $v: { maxLength: true, $error: false },
        },
        {
          case: "given has_location=true, is_single_location=false and location.length=10, $v.location.$error should be false",
          propsData: { has_location: true, is_single_location: false },
          location: exampleOption10,
          $v: { maxLength: true, $error: false },
        },
        {
          case: "given has_location=true, is_single_location=false and location.length>10, $v.location.$error should be true",
          propsData: { has_location: true, is_single_location: false },
          location: exampleOptionMoreThan10,
          $v: { maxLength: false, $error: true },
        },
      ])("$case", async ({ propsData, location, $v }) => {
        wrapper.setProps(propsData);
        await wrapper.vm.$nextTick();

        wrapper.vm.location = location;
        await wrapper.vm.$nextTick();

        wrapper.vm.$v.location.$touch();
        expect(wrapper.vm.$v.location.maxLength).toBe($v.maxLength);
        expect(wrapper.vm.$v.location.$error).toBe($v.$error);
      });
    });

    describe("product", () => {
      it.each([
        {
          case: "given has_product=false, $v.product.$error should be false",
          propsData: {
            has_product: false,
            is_single_product: false,
            has_non_member: false,
          },
          product: "",
          prefix_product: "NON_MEMBER",
          $v: { maxLength: true, required: true, $error: false },
        },
        {
          case: "given has_product=true and is_single_product=true and has_non_member=false and product blank, should not pased",
          propsData: {
            has_product: true,
            is_single_product: true,
            has_non_member: false,
          },
          product: {},
          prefix_product: "NON_MEMBER",
          $v: { maxLength: true, required: false, $error: true },
        },
        {
          case: "given has_product=true and is_single_product=true and has_non_member=false and product filled, should not pased",
          propsData: {
            has_product: true,
            is_single_product: true,
            has_non_member: false,
          },
          product: { value: "mocked" },
          prefix_product: "NON_MEMBER",
          $v: { maxLength: true, required: true, $error: false },
        },
        {
          case: "given has_product=true and is_single_product=false and has_non_member=false and product blank, should not pased",
          propsData: {
            has_product: true,
            is_single_product: false,
            has_non_member: false,
          },
          product: [],
          prefix_product: "NON_MEMBER",
          $v: { maxLength: true, required: false, $error: true },
        },
        {
          case: "given has_product=true and is_single_product=false and has_non_member=false and filled < 10, should not pased",
          propsData: {
            has_product: true,
            is_single_product: false,
            has_non_member: false,
          },
          product: ["mocked"],
          prefix_product: "NON_MEMBER",
          $v: { maxLength: true, required: true, $error: false },
        },
        {
          case: "given has_product=true and is_single_product=false and has_non_member=false and filled > 10, should not pased",
          propsData: {
            has_product: true,
            is_single_product: false,
            has_non_member: false,
          },
          product: [
            "mocked",
            "mocked",
            "mocked",
            "mocked",
            "mocked",
            "mocked",
            "mocked",
            "mocked",
            "mocked",
            "mocked",
            "mocked",
            "mocked",
            "mocked",
            "mocked",
          ],
          prefix_product: "NON_MEMBER",
          $v: { maxLength: false, required: true, $error: true },
        },

        {
          case: "given has_product=true and is_single_product=true and has_non_member=true and product blank, should not pased",
          propsData: {
            has_product: true,
            is_single_product: true,
            has_non_member: true,
          },
          product: {},
          prefix_product: "MEMBER",
          $v: { maxLength: true, required: false, $error: true },
        },
        {
          case: "given has_product=true and is_single_product=true and has_non_member=true and product filled, should not pased",
          propsData: {
            has_product: true,
            is_single_product: true,
            has_non_member: true,
          },
          product: { value: "mocked" },
          prefix_product: "MEMBER",
          $v: { maxLength: true, required: true, $error: false },
        },
        {
          case: "given has_product=true and is_single_product=false and has_non_member=true and product blank, should not pased",
          propsData: {
            has_product: true,
            is_single_product: false,
            has_non_member: true,
          },
          product: [],
          prefix_product: "MEMBER",
          $v: { maxLength: true, required: false, $error: true },
        },
        {
          case: "given has_product=true and is_single_product=false and has_non_member=true and filled < 10, should not pased",
          propsData: {
            has_product: true,
            is_single_product: false,
            has_non_member: true,
          },
          product: ["mocked"],
          prefix_product: "MEMBER",
          $v: { maxLength: true, required: true, $error: false },
        },
        {
          case: "given has_product=true and is_single_product=false and has_non_member=true and filled > 10, should not pased",
          propsData: {
            has_product: true,
            is_single_product: false,
            has_non_member: true,
          },
          product: [
            "mocked",
            "mocked",
            "mocked",
            "mocked",
            "mocked",
            "mocked",
            "mocked",
            "mocked",
            "mocked",
            "mocked",
            "mocked",
            "mocked",
            "mocked",
            "mocked",
          ],
          prefix_product: "MEMBER",
          $v: { maxLength: false, required: true, $error: true },
        },
      ])("$case", async ({ propsData, product, prefix_product, $v }) => {
        wrapper.setProps(propsData);
        await wrapper.vm.$nextTick();

        wrapper.vm.helper.prefix_product = prefix_product;
        await wrapper.vm.$nextTick();

        wrapper.vm.product = product;
        await wrapper.vm.$nextTick();

        wrapper.vm.$v.product.$touch();
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.$v.product.maxLength).toBe($v.maxLength);
        expect(wrapper.vm.$v.product.$error).toBe($v.$error);
        expect(wrapper.vm.$v.product.required).toBe($v.required);
      });
    });

    describe("user", () => {
      it.each([
        {
          case: "given has_user=false, $v.user.$error should be false",
          propsData: { has_user: false },
          user: "",
          $v: { maxLength: true, $error: false },
        },
        {
          case: "given has_user=true and user empty, $v.user.$error should be false",
          propsData: { has_user: true },
          user: [],
          $v: { maxLength: true, $error: false },
        },
        {
          case: "given has_user=true and user.length<10, $v.user.$error should be false",
          propsData: { has_user: true },
          user: exampleOptionLessThan10,
          $v: { maxLength: true, $error: false },
        },
        {
          case: "given has_user=true and user.length=10, $v.user.$error should be false",
          propsData: { has_user: true },
          user: exampleOption10,
          $v: { maxLength: true, $error: false },
        },
        {
          case: "given has_user=true and user.length>10, $v.user.$error should be true",
          propsData: { has_user: true },
          user: exampleOptionMoreThan10,
          $v: { maxLength: false, $error: true },
        },
      ])("$case", async ({ propsData, user, $v }) => {
        wrapper.setProps(propsData);
        await wrapper.vm.$nextTick();

        wrapper.vm.user = user;
        await wrapper.vm.$nextTick();

        wrapper.vm.$v.user.$touch();
        expect(wrapper.vm.$v.user.maxLength).toBe($v.maxLength);
        expect(wrapper.vm.$v.user.$error).toBe($v.$error);
      });
    });

    describe("officer", () => {
      it.each([
        {
          case: "given has_officer=false, $v.officer.$error should be false",
          propsData: { has_officer: false, is_single_officer: false },
          officer: "",
          $v: { maxLength: true, $error: false },
        },
        {
          case: "given has_officer=true and is_single_officer=true, $v.officer.$error should be false",
          propsData: { has_officer: true, is_single_officer: true },
          officer: "",
          $v: { maxLength: true, $error: false },
        },
        {
          case: "given has_officer=true, is_single_officer=false and officer empty, $v.officer.$error should be false",
          propsData: { has_officer: true, is_single_officer: false },
          officer: [],
          $v: { maxLength: true, $error: false },
        },
        {
          case: "given has_officer=true, is_single_officer=false and officer.length<10, $v.officer.$error should be false",
          propsData: { has_officer: true, is_single_officer: false },
          officer: exampleOptionLessThan10,
          $v: { maxLength: true, $error: false },
        },
        {
          case: "given has_officer=true, is_single_officer=false and officer.length=10, $v.officer.$error should be false",
          propsData: { has_officer: true, is_single_officer: false },
          officer: exampleOption10,
          $v: { maxLength: true, $error: false },
        },
        {
          case: "given has_officer=true, is_single_officer=false and officer.length>10, $v.officer.$error should be true",
          propsData: { has_officer: true, is_single_officer: false },
          officer: exampleOptionMoreThan10,
          $v: { maxLength: false, $error: true },
        },
      ])("$case", async ({ propsData, officer, $v }) => {
        wrapper.setProps(propsData);
        await wrapper.vm.$nextTick();

        wrapper.vm.officer = officer;
        await wrapper.vm.$nextTick();

        wrapper.vm.$v.officer.$touch();
        expect(wrapper.vm.$v.officer.maxLength).toBe($v.maxLength);
        expect(wrapper.vm.$v.officer.$error).toBe($v.$error);
      });
    });

    describe("leave_type", () => {
      it.each([
        {
          case: "given has_leave_type=false, $v.leave_type.$error should be false",
          propsData: { has_leave_type: false },
          leave_type: "",
          $v: { minLength: true, $error: false },
        },
        {
          case: "given has_leave_type=true and leave_type empty, $v.leave_type.$error should be true",
          propsData: { has_leave_type: true },
          leave_type: [],
          $v: { minLength: false, $error: true },
        },
        {
          case: "given has_leave_type=true and leave_type filled, $v.leave_type.$error should be false",
          propsData: { has_leave_type: true },
          leave_type: exampleOptionLessThan10,
          $v: { minLength: true, $error: false },
        },
      ])("$case", async ({ propsData, leave_type, $v }) => {
        wrapper.setProps(propsData);
        await wrapper.vm.$nextTick();

        wrapper.vm.leave_type = leave_type;
        await wrapper.vm.$nextTick();

        wrapper.vm.$v.leave_type.$touch();
        expect(wrapper.vm.$v.leave_type.maxLength).toBe($v.maxLength);
        expect(wrapper.vm.$v.leave_type.$error).toBe($v.$error);
      });
    });
  });

  test("test created life cycle, should call function processGetOptions passUpdateToParent", async () => {
    mocksFn["processGenerateCaption"] = jest
      .spyOn(FilterReport.methods, "processGenerateCaption")
      .mockImplementation();
    mocksFn["processGetOptions"] = jest
      .spyOn(FilterReport.methods, "processGetOptions")
      .mockImplementation();
    mocksFn["processClearFilter"] = jest
      .spyOn(FilterReport.methods, "processClearFilter")
      .mockImplementation();
    mocksFn["setDefaultFilter"] = jest
      .spyOn(FilterReport.methods, "setDefaultFilter")
      .mockImplementation();
    mocksFn["passUpdateToParent"] = jest
      .spyOn(FilterReport.methods, "passUpdateToParent")
      .mockImplementation();

    wrapper = shallowMount(FilterReport, { localVue, mocks });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(mocksFn["processGenerateCaption"]).toHaveBeenCalled();
    expect(mocksFn["processGetOptions"]).toHaveBeenCalled();
    expect(mocksFn["processClearFilter"]).toHaveBeenCalled();
    expect(mocksFn["setDefaultFilter"]).toHaveBeenCalled();
    expect(mocksFn["passUpdateToParent"]).toHaveBeenCalled();
  });

  describe("setDefaultFilter", () => {
    it.each([
      {
        case: "given has_period true, should set default month", has_period: true, month: "2024-01",
        fnMocked: { '$utility.formatDateMoment': { returnedValue: "2024-01" } }
      }, {
        case: "given has_period false, shouldn't set default month", has_period: false, month: "",
        fnMocked: { '$utility.formatDateMoment': {} }
      }
    ])("$case", async ({ has_period, month, fnMocked }) => {
      wrapper.vm.$utility.formatDateMoment = mocksFn['$utility.formatDateMoment'] =
        jest.fn().mockReturnValueOnce(fnMocked['$utility.formatDateMoment'].returnedValue)

      wrapper.setProps({ has_period })
      await wrapper.vm.$nextTick();

      wrapper.vm.setDefaultFilter();
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.month).toEqual(month)
    })

    it.each([
      {
        case: "given has_date true, should set default date", has_date: true, date: "2024-01-23",
        fnMocked: { '$utility.formatDateMoment': { returnedValue: "2024-01-23" } }
      }, {
        case: "given has_date false, shouldn't set default date", has_date: false, date: "",
        fnMocked: { '$utility.formatDateMoment': {} }
      }
    ])("$case", async ({ has_date, date, fnMocked }) => {
      wrapper.vm.$utility.formatDateMoment = mocksFn['$utility.formatDateMoment'] =
        jest.fn().mockReturnValueOnce(fnMocked['$utility.formatDateMoment'].returnedValue)

      wrapper.setProps({ has_date })
      await wrapper.vm.$nextTick();

      wrapper.vm.setDefaultFilter();
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.date).toEqual(date)
    })

    it.each([
      {
        case: "given has_date_range true, should set default date_range", has_date_range: true, date_range: ["2024-01-23", "2024-01-23"],
        fnMocked: { '$utility.formatDateMoment': { returnedValue: "2024-01-23" } }
      }, {
        case: "given has_date_range false, shouldn't set default date_range", has_date_range: false, date_range: [],
        fnMocked: { '$utility.formatDateMoment': {} }
      }
    ])("$case", async ({ has_date_range, date_range, fnMocked }) => {
      wrapper.vm.$utility.formatDateMoment = mocksFn['$utility.formatDateMoment'] =
        jest.fn().mockReturnValueOnce(fnMocked['$utility.formatDateMoment'].returnedValue)

      wrapper.setProps({ has_date_range })
      await wrapper.vm.$nextTick();

      wrapper.vm.setDefaultFilter();
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.date_range).toEqual(date_range)
    })

    it.each([
      {
        case: "given has_timezone true, should set default timezone", has_timezone: true, timezone: "Asia/Jakarta",
        fnMocked: { '$utility.getSpotTimezone': { returnedValue: "Asia/Jakarta" } }
      }, {
        case: "given has_timezone false, shouldn't set default timezone", has_timezone: false, timezone: "",
        fnMocked: { '$utility.getSpotTimezone': {} }
      }
    ])("$case", async ({ has_timezone, timezone, fnMocked }) => {
      wrapper.vm.$utility.getSpotTimezone = mocksFn['$utility.getSpotTimezone'] =
        jest.fn().mockReturnValueOnce(fnMocked['$utility.getSpotTimezone'].returnedValue)

      wrapper.setProps({ has_timezone })
      await wrapper.vm.$nextTick();

      wrapper.vm.setDefaultFilter();
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.timezone).toEqual(timezone)
    })

    it.each([
      {
        case: "given has_column_setting true, should call setDefaultColumn",
        has_column_setting: true, fnMocked: { 'setDefaultColumn': { calls: [[]] } }
      }, {
        case: "given has_column_setting false, shouldn't call setDefaultColumn",
        has_column_setting: false, fnMocked: { 'setDefaultColumn': { calls: [] } }
      }
    ])("$case", async ({ has_column_setting, fnMocked }) => {
      wrapper.vm.setDefaultColumn = mocksFn['setDefaultColumn'] = jest.fn()

      wrapper.setProps({ has_column_setting })
      await wrapper.vm.$nextTick();

      wrapper.vm.setDefaultFilter();
      await wrapper.vm.$nextTick();

      expect(mocksFn['setDefaultColumn'].mock.calls).toEqual(fnMocked['setDefaultColumn'].calls)
    })

    it.each([
      {
        case: "given has_vehicle true, should call setDefaultVehicle",
        has_vehicle: true, fnMocked: { 'setDefaultVehicle': { calls: [[]] } }
      }, {
        case: "given has_vehicle false, shouldn't call setDefaultVehicle",
        has_vehicle: false, fnMocked: { 'setDefaultVehicle': { calls: [] } }
      }
    ])("$case", async ({ has_vehicle, fnMocked }) => {
      wrapper.vm.setDefaultVehicle = mocksFn['setDefaultVehicle'] = jest.fn()

      wrapper.setProps({ has_vehicle })
      await wrapper.vm.$nextTick();

      wrapper.vm.setDefaultFilter();
      await wrapper.vm.$nextTick();

      expect(mocksFn['setDefaultVehicle'].mock.calls).toEqual(fnMocked['setDefaultVehicle'].calls)
    })
  })

  describe("setDefaultLocation", () => {
    it.each([
      {
        is_single_location: true,
        is_required_location: true,
        location_options: locationOptions,
        location: locationOptions[0],
      },
      {
        is_single_location: true,
        is_required_location: true,
        location_options: [],
        location: {},
      },
      {
        is_single_location: true,
        is_required_location: false,
        location_options: locationOptions,
        location: {},
      },
      {
        is_single_location: true,
        is_required_location: false,
        location_options: [],
        location: {},
      },
      {
        is_single_location: false,
        is_required_location: true,
        location_options: locationOptions,
        location: [locationOptions[0]],
      },
      {
        is_single_location: false,
        is_required_location: true,
        location_options: [],
        location: [],
      },
      {
        is_single_location: false,
        is_required_location: false,
        location_options: locationOptions,
        location: [],
      },
      {
        is_single_location: false,
        is_required_location: false,
        location_options: [],
        location: [],
      },
    ])(
      "given is_single_location:$is_single_location, is_required_location:$is_required_location, options.location.length:$location_options.length, should set location to $location",
      async ({
        is_single_location,
        is_required_location,
        location_options,
        location,
      }) => {
        wrapper.setProps({ is_single_location, is_required_location });
        await wrapper.vm.$nextTick();

        wrapper.vm.options.location = [...location_options];
        await wrapper.vm.$nextTick();

        wrapper.vm.setDefaultLocation();
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.location).toEqual(location);
      }
    );
  });

  describe("setDefaultColumn", () => {
    test.each([
      {
        case: "given is_init_all_column true, should set column with option_column",
        propsData: { option_column: columnOptions, is_init_all_column: true },
        column: columnOptions,
      },
      {
        case: "given is_init_all_column false, should set column with option_column",
        propsData: { option_column: columnOptions, is_init_all_column: false },
        column: [],
      },
    ])("$case", async ({ propsData, column }) => {
      wrapper.setProps(propsData);
      await wrapper.vm.$nextTick();

      wrapper.vm.setDefaultColumn();

      expect(wrapper.vm.column).toEqual(column);
    });
  });

  describe("setDefaultVehicle", () => {
    test.each([
      {
        case: "given is_init_all_vehicle true, should set vehicle with options.vehicle",
        propsData: { is_init_all_vehicle: true },
        vehicle: FORMATTED_VEHICLE,
      },
      {
        case: "given is_init_all_vehicle false, should set vehicle with options.vehicle",
        propsData: { is_init_all_vehicle: false },
        vehicle: [],
      },
    ])("$case", async ({ propsData, vehicle }) => {
      wrapper.vm.options.vehicle = [...FORMATTED_VEHICLE];
      wrapper.setProps(propsData);
      await wrapper.vm.$nextTick();

      wrapper.vm.setDefaultVehicle();

      expect(wrapper.vm.vehicle).toEqual(vehicle);
    });
  });

  test("test function passUpdateToParent, should call function setPayloadParent and emit update with argument based on return of function setPayloadParent", async () => {
    wrapper.vm.setPayloadParent = mocksFn["setPayloadParent"] = jest
      .fn()
      .mockReturnValue("mocked");
    await wrapper.vm.$nextTick();
    wrapper.vm.passUpdateToParent();
    await wrapper.vm.$nextTick();
    expect(mocksFn["setPayloadParent"]).toHaveBeenCalled();
    expect(wrapper.emitted("update")).toBeDefined();
  });

  test("test function passErrorToParent, should emit error state true and giving message error based on function arguments", () => {
    wrapper.vm.passErrorToParent("mocked");
    expect(wrapper.emitted("error")).toBeDefined();
    expect(wrapper.emitted("error")[0][0]).toEqual({
      state: true,
      message: "mocked",
    });
  });

  describe("test function setPayloadParent", () => {
    it.each([
      {
        case: "with no props, should return payload blank",
        props: {},
        expectedValue: {},
        numsOfCalls: {
          formatPayloadTimeRange: 0,
          getSpotId: 0,
        },
      },
      {
        case: "with props has_period is true, should return value payload which has object month",
        expectedValue: { month: "mocked-period" },
        props: { has_period: true },
        numsOfCalls: {
          formatPayloadTimeRange: 0,
          getSpotId: 0,
        },
      },
      {
        case: "with props has_date is true, should return value payload which has object date",
        expectedValue: { date: "mocked-date" },
        props: { has_date: true },
        numsOfCalls: {
          formatPayloadTimeRange: 0,
          getSpotId: 0,
        },
      },
      {
        case: "with props has_date_range is true, should return value payload which has object date_range",
        expectedValue: { date_range: ["2022-01-01", "2022-01-10"] },
        props: { has_date_range: true },
        numsOfCalls: {
          formatPayloadTimeRange: 0,
          getSpotId: 0,
        },
      },
      {
        case: "with props has_time_range is true, should return value payload which has object time_range",
        expectedValue: { time_range: "mocked-time_range" },
        props: { has_time_range: true },
        numsOfCalls: {
          formatPayloadTimeRange: 1,
          getSpotId: 0,
        },
      },
      {
        case: "with props has_spot is true, should return value payload which has object spot_id",
        expectedValue: { spot_id: "mocked-spot" },
        props: { has_spot: true },
        numsOfCalls: {
          formatPayloadTimeRange: 0,
          getSpotId: 1,
        },
      },
      {
        case: "with props has_vehicle is true, should return value payload which has object vehicle",
        expectedValue: { vehicle: "mocked-vehicle" },
        props: { has_vehicle: true },
        numsOfCalls: {
          formatPayloadTimeRange: 0,
          getSpotId: 0,
        },
      },
      {
        case: "with props has_product is true, should return value payload which has object product",
        expectedValue: { product: [{ value: "mocked-product" }] },
        props: { has_product: true },
        numsOfCalls: {
          formatPayloadTimeRange: 0,
          getSpotId: 0,
        },
      },
      {
        case: "with props has_user is true, should return value payload which has object user",
        expectedValue: { user: "mocked-user" },
        props: { has_user: true },
        numsOfCalls: {
          formatPayloadTimeRange: 0,
          getSpotId: 0,
        },
      },
      {
        case: "with props has_officer is true, should return value payload which has object officer",
        expectedValue: { officer: "mocked-officer" },
        props: { has_officer: true },
        numsOfCalls: {
          formatPayloadTimeRange: 0,
          getSpotId: 0,
        },
      },
      {
        case: "with props has_shift is true, should return value payload which has object shift",
        expectedValue: { shift: "mocked-shift" },
        props: { has_shift: true },
        numsOfCalls: {
          formatPayloadTimeRange: 0,
          getSpotId: 0,
        },
      },
      {
        case: "with props has_type is true, should return value payload which has object type",
        expectedValue: { type: "mocked-type" },
        props: { has_type: true },
        numsOfCalls: {
          formatPayloadTimeRange: 0,
          getSpotId: 0,
        },
      },
      {
        case: "with props has_pos is true, should return value payload which has object pos",
        expectedValue: { pos: "mocked-pos" },
        props: { has_pos: true },
        numsOfCalls: {
          formatPayloadTimeRange: 0,
          getSpotId: 0,
        },
      },
      {
        case: "with props has_column_setting is true, should return value payload which has object column",
        expectedValue: { column: "mocked-column_setting" },
        props: { has_column_setting: true },
        numsOfCalls: {
          formatPayloadTimeRange: 0,
          getSpotId: 0,
        },
      },
      {
        case: "with props has_service is true, should return value payload which has object service",
        expectedValue: { service: "mocked-service" },
        props: { has_service: true },
        numsOfCalls: {
          formatPayloadTimeRange: 0,
          getSpotId: 0,
        },
      },
      {
        case: "with props has_location is true, should return value payload which has object location",
        expectedValue: { location: "mocked-location" },
        props: { has_location: true },
        numsOfCalls: {
          formatPayloadTimeRange: 0,
          getSpotId: 0,
        },
      },
      {
        case: "with props has_administration_type is true, should return value payload which has object administration",
        expectedValue: { administration_type: "mocked-administration_type" },
        props: { has_administration_type: true },
        numsOfCalls: {
          formatPayloadTimeRange: 0,
          getSpotId: 0,
        },
      },
      {
        case: "with props has_transaction_type is true, should return value payload which has object transaction_type",
        expectedValue: { transaction_type: "mocked-transaction_type" },
        props: { has_transaction_type: true },
        numsOfCalls: {
          formatPayloadTimeRange: 0,
          getSpotId: 0,
        },
      },
      {
        case: "with props has_transaction_status is true, should return value payload which has object transaction_status",
        expectedValue: { transaction_status: "mocked-transaction_status" },
        props: { has_transaction_status: true },
        numsOfCalls: {
          formatPayloadTimeRange: 0,
          getSpotId: 0,
        },
      },
      {
        case: "with props has_reason is true, should return value payload which has object reason",
        expectedValue: { reason: ["mocked-reason"] },
        props: { has_reason: true },
        numsOfCalls: {
          formatPayloadTimeRange: 0,
          getSpotId: 0,
        },
      },
    ])("$case", async (data) => {
      wrapper.vm.options.product = [{ value: "mocked-product" }];
      await wrapper.vm.$nextTick();
      wrapper.vm.formatPayloadTimeRange = mocksFn["formatPayloadTimeRange"] =
        jest.fn().mockReturnValue("mocked-time_range");
      wrapper.vm.$utility.getSpotId = mocksFn["getSpotId"] = jest
        .fn()
        .mockReturnValue("mocked-spot");
      wrapper.setProps(data.props);
      wrapper.setData(data.expectedValue);
      await wrapper.vm.$nextTick();
      wrapper.vm.product = ["mocked-product"];
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      let actual_value = wrapper.vm.setPayloadParent();
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      expect(mocksFn["formatPayloadTimeRange"]).toHaveBeenCalledTimes(
        data.numsOfCalls.formatPayloadTimeRange
      );
      expect(mocksFn["getSpotId"]).toHaveBeenCalledTimes(
        data.numsOfCalls.getSpotId
      );
      expect(actual_value).toEqual(data.expectedValue);
    });
  });

  test("test function setPayloadProduct non member selected, should directy return non member", async () => {
    wrapper.setProps({ is_single_product: true });
    await wrapper.vm.$nextTick();
    wrapper.vm.product = "mocked";
    await wrapper.vm.$nextTick();
    wrapper.vm.helper.prefix_product = "NON_MEMBER";
    await wrapper.vm.$nextTick();
    const ACTUAL_PAYLOAD = wrapper.vm.setPayloadProduct();
    await wrapper.vm.$nextTick();
    expect(ACTUAL_PAYLOAD).toEqual([{ value: "NON_MEMBER" }]);
  });

  test("test function setPayloadProduct with single options product, should directy return product", async () => {
    wrapper.setProps({ is_single_product: true });
    await wrapper.vm.$nextTick();
    wrapper.vm.helper.prefix_product = "MEMBER";
    await wrapper.vm.$nextTick();
    wrapper.vm.product = "mocked";
    await wrapper.vm.$nextTick();
    const ACTUAL_PAYLOAD = wrapper.vm.setPayloadProduct();
    await wrapper.vm.$nextTick();
    expect(ACTUAL_PAYLOAD).toEqual("mocked");
  });

  test("test function setPayloadProduct with no single options product and options product more than 5 options, should directly return product", async () => {
    wrapper.vm.options.product = [
      "mocked-1",
      "mocked-2",
      "mocked-3",
      "mocked-4",
      "mocked-5",
      "mocked-6",
    ];
    await wrapper.vm.$nextTick();
    wrapper.vm.helper.prefix_product = "MEMBER";
    await wrapper.vm.$nextTick();
    wrapper.vm.product = "mocked";
    await wrapper.vm.$nextTick();
    const ACTUAL_PAYLOAD = wrapper.vm.setPayloadProduct();
    await wrapper.vm.$nextTick();
    expect(ACTUAL_PAYLOAD).toEqual("mocked");
  });

  test("test function setPayloadProduct with no single options product and options product less than 5 options, should return product inside object value", async () => {
    wrapper.vm.options.product = ["mocked"];
    await wrapper.vm.$nextTick();
    wrapper.vm.helper.prefix_product = "MEMBER";
    await wrapper.vm.$nextTick();
    wrapper.vm.product = ["mocked-1", "mocked-2"];
    await wrapper.vm.$nextTick();
    const ACTUAL_PAYLOAD = wrapper.vm.setPayloadProduct();
    await wrapper.vm.$nextTick();
    expect(ACTUAL_PAYLOAD).toEqual([
      { value: "mocked-1" },
      { value: "mocked-2" },
    ]);
  });

  test("test function setPayloadParent with helper gate type are true, should set return value gate type is equal with payload", async () => {
    wrapper.vm.gate_type = "mocked-gate-type";
    wrapper.vm.helper.gate_type = true;
    await wrapper.vm.$nextTick();
    let actual_value = wrapper.vm.setPayloadParent();
    await wrapper.vm.$nextTick();
    expect(actual_value).toEqual({ gate_type: "mocked-gate-type" });
  });

  test("test function setPayloadGetOptionOfficer, should return payload to get officer", async () => {
    wrapper.vm.$utility.getSpotId = mocksFn['$utility.getSpotId'] = jest.fn().mockReturnValueOnce("xxx-xxx-111")

    wrapper.vm.helper.search.officer = "udi"
    await wrapper.vm.$nextTick()

    let receivedPayload = wrapper.vm.setPayloadGetOptionOfficer();
    expect(receivedPayload).toEqual(payloadGetOfficer);
  });

  test("test function setPayloadGetOptionUser, should return payload to get user", async () => {
    wrapper.vm.$utility.getSpotId = mocksFn['$utility.getSpotId'] = jest.fn().mockReturnValueOnce("xxx-xxx-222")

    wrapper.vm.helper.search.user = "jav"
    await wrapper.vm.$nextTick()

    let receivedPayload = wrapper.vm.setPayloadGetOptionUser();
    expect(receivedPayload).toEqual(payloadGetUser);
  });

  test("test function setPayloadGetOptionService, should return payload below and call function getSpotId once", async () => {
    wrapper.vm.$utility.getSpotId = mocksFn['$utility.getSpotId'] = jest.fn().mockReturnValueOnce("mocked-spot-xxx")
    let actual_value = wrapper.vm.setPayloadGetOptionService();
    let expected_value = { spot_id: "mocked-spot-xxx" };
    expect(expected_value).toEqual(actual_value);
  });

  test("test function toggleSelectOptionLeaveReason, should set value leave_reason same with options.leave_reason", async () => {
    wrapper.vm.options.leave_reason = [
      { text: "Keluarga", value: "FAMILY", type: "PERMISSION" },
    ];
    wrapper.vm.toggleSelectOptionLeaveReason();

    expect(wrapper.vm.leave_reason).toEqual(["FAMILY"]);
  });

  test("test function toggleSelectOptionVehicle, should set value vehicle same with options.vehicle", async () => {
    wrapper.vm.options.vehicle = "mocked";
    wrapper.vm.toggleSelectOptionVehicle();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.vehicle).toEqual("mocked");
  });

  test("test function toggleClearOptionColumn, should set value column to []", async () => {
    wrapper.vm.toggleClearOptionColumn();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.column).toEqual([]);
  });

  test("test function toggleClearOptionVehicle, should set value vehicle to []", async () => {
    wrapper.vm.toggleClearOptionVehicle();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.vehicle).toEqual([]);
  });

  test("test function toggleClearOptionLeaveReason, should set value leave_reason to []", async () => {
    wrapper.vm.leave_reason = ["WEDDING"];

    wrapper.vm.toggleClearOptionLeaveReason();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.leave_reason).toEqual([]);
  });

  test("test function toggleClearOptionColumn, should set value column to []", async () => {
    wrapper.vm.toggleClearOptionColumn();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.column).toEqual([]);
  });

  test("test function formatOptionsProduct with hasn't non member props, should having value product options from utility getOptionProductMembership and haven't options non member", async () => {
    let expected_value = [{ text: "Product", value: "secret" }];
    wrapper.vm.$utility.getOptionProductMembership = mocksFn[
      "getOptionProductMembership"
    ] = jest.fn().mockReturnValue([{ name: "Product", id: "secret" }]);
    wrapper.setProps({ has_non_member: false });
    wrapper.vm.formatOptionsProduct();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.options.product).toEqual(expected_value);
  });

  describe("test function formatPayloadTimeRange ", () => {
    it.each([
      {
        case: "having value 10:00 in time_range index 0, should return start time is equal with time_range index 0",
        time_range: ["10:00", ""],
        expected_value: { start: "10:00", end: "" },
      },
      {
        case: "havingvalue is 'None' in time_range index 0, should return start time is ''",
        time_range: ["None", ""],
        expected_value: { start: "", end: "" },
      },
      {
        case: "haven't time_range value in index 0, should return start time is ''",
        time_range: ["", ""],
        expected_value: { start: "", end: "" },
      },
      {
        case: "having value 12:00 in time_range index 1, should return end time is equal with time_range index 0",
        time_range: ["", "12:00"],
        expected_value: { start: "", end: "12:00" },
      },
      {
        case: "havingvalue is 'None' in time_range index 1, should return end time is ''",
        time_range: ["", "None"],
        expected_value: { start: "", end: "" },
      },
      {
        case: "haven't time_range value in index 1, should return end time is ''",
        time_range: ["", ""],
        expected_value: { start: "", end: "" },
      },
    ])("$case", async ({ time_range, expected_value }) => {
      wrapper.vm.time_range = time_range;
      let actual_value = wrapper.vm.formatPayloadTimeRange();
      expect(actual_value).toEqual(expected_value);
    });
  });

  test("test function formatOptionsVehicle with normal condition, should set options vehicle and vehicle value are same and was formatted", async () => {
    wrapper.vm.$utility.getVehicle = mocksFn["getVehicle"] = jest
      .fn()
      .mockReturnValue(VEHICLE_RETURN);
    wrapper.vm.formatOptionsVehicle();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.vehicle).toEqual(FORMATTED_VEHICLE);
    expect(wrapper.vm.options.vehicle).toEqual(FORMATTED_VEHICLE);
  });

  test("test function formatOptionsVehicle with bad condition, should call function setErrorContextSentry, captureMessage and passErrorToParent", async () => {
    const error = new Error("Error");
    wrapper.vm.$utility.getVehicle = mocksFn["$utility.getVehicle"] = jest
      .fn()
      .mockRejectedValue(error);
    wrapper.vm.$utility.setErrorContextSentry = mocksFn[
      "$utility.setErrorContextSentry"
    ] = jest.fn();
    wrapper.vm.$sentry.captureMessage = mocksFn["$sentry.captureMessage"] =
      jest.fn();
    wrapper.vm.passErrorToParent = mocksFn["passErrorToParent"] = jest.fn();

    await wrapper.vm.formatOptionsVehicle();

    expect(mocksFn["$utility.setErrorContextSentry"]).toHaveBeenCalled();
    expect(mocksFn["$sentry.captureMessage"]).toHaveBeenCalled();
    expect(mocksFn["passErrorToParent"]).toHaveBeenCalled();
  });

  test("test function processResetUser, should set value user to {}", async () => {
    wrapper.vm.processResetUser();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.user).toEqual([]);
  });

  test("test function processResetTransactionType, should set value transaction_type to {}", async () => {
    wrapper.vm.processResetTransactionType();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.transaction_type).toEqual({});
  });

  test("test function processResetGateType, should set value gate_type to {}", async () => {
    wrapper.vm.processResetGateType();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.gate_type).toEqual({});
  });

  describe("test function processGetOptions", () => {
    it.each([
      {
        case: "with no has anything, should not call function and didnt set anything also set helper rendering is true",
        props: {},
        hasExpectValue: {
          state: false,
          value: "",
        },
        numsOfCalls: {
          formatOptionsVehicle: 0,
          formatOptionsProduct: 0,
          processGetService: 0,
          processGetLocation: 0,
        },
      },
      {
        case: "has_vehicle",
        props: { has_vehicle: true },
        hasExpectValue: {
          state: false,
          value: "",
        },
        numsOfCalls: {
          formatOptionsVehicle: 1,
          formatOptionsProduct: 0,
          processGetService: 0,
          processGetLocation: 0,
        },
      },
      {
        case: "has_product",
        props: { has_product: true },
        hasExpectValue: {
          state: false,
          value: "",
        },
        numsOfCalls: {
          formatOptionsVehicle: 0,
          formatOptionsProduct: 1,
          processGetService: 0,
          processGetLocation: 0,
        },
      },
      {
        case: "has_user",
        props: { has_user: true },
        hasExpectValue: {
          state: false,
          value: "",
        },
        numsOfCalls: {
          formatOptionsVehicle: 0,
          formatOptionsProduct: 0,
          processGetService: 0,
          processGetLocation: 0,
        },
      },
      {
        case: "has_officer",
        props: { has_officer: true },
        hasExpectValue: {
          state: false,
          value: "",
        },
        numsOfCalls: {
          formatOptionsVehicle: 0,
          formatOptionsProduct: 0,
          processGetService: 0,
          processGetLocation: 0,
        },
      },
      {
        case: "has_service",
        props: { has_service: true },
        hasExpectValue: {
          state: false,
          value: "",
        },
        numsOfCalls: {
          formatOptionsVehicle: 0,
          formatOptionsProduct: 0,
          processGetService: 1,
          processGetLocation: 0,
        },
      },
      {
        case: "has_location",
        props: { has_location: true },
        hasExpectValue: {
          state: false,
          value: "",
        },
        numsOfCalls: {
          formatOptionsVehicle: 0,
          formatOptionsProduct: 0,
          processGetService: 0,
          processGetLocation: 1,
        },
      },
      {
        case: "has_column_setting",
        props: { has_column_setting: true, option_column: ["mocked"] },
        hasExpectValue: {
          state: true,
          field: "column",
          value: ["mocked"],
        },
        numsOfCalls: {
          formatOptionsVehicle: 0,
          formatOptionsProduct: 0,
          processGetService: 0,
          processGetLocation: 0,
        },
      },
      {
        case: "has_administration_type",
        props: { has_administration_type: true },
        hasExpectValue: {
          state: true,
          field: "administration_type",
          value: {
            text: "Ganti Plat",
            value: "DATA_CHANGE",
          },
        },
        numsOfCalls: {
          formatOptionsVehicle: 0,
          formatOptionsProduct: 0,
          processGetService: 0,
          processGetLocation: 0,
        },
      },
    ])("$case", async (data) => {
      wrapper.vm.formatOptionsVehicle = mocksFn["formatOptionsVehicle"] =
        jest.fn();
      wrapper.vm.formatOptionsProduct = mocksFn["formatOptionsProduct"] =
        jest.fn();
      wrapper.vm.processGetService = mocksFn["processGetService"] = jest.fn();
      wrapper.vm.processGetLocation = mocksFn["processGetLocation"] = jest.fn();
      wrapper.setProps(data.props);
      await wrapper.vm.$nextTick();
      wrapper.vm.processGetOptions();
      await wrapper.vm.$nextTick();
      expect(mocksFn["formatOptionsVehicle"]).toHaveBeenCalledTimes(
        data.numsOfCalls.formatOptionsVehicle
      );
      expect(mocksFn["formatOptionsProduct"]).toHaveBeenCalledTimes(
        data.numsOfCalls.formatOptionsProduct
      );
      expect(mocksFn["processGetService"]).toHaveBeenCalledTimes(
        data.numsOfCalls.processGetService
      );
      expect(mocksFn["processGetLocation"]).toHaveBeenCalledTimes(
        data.numsOfCalls.processGetLocation
      );
      if (data.hasExpectValue.state) {
        expect(wrapper.vm[`${data.hasExpectValue.field}`]).toEqual(
          data.hasExpectValue.value
        );
      }
      expect(wrapper.vm.helper.is_rendering).toEqual(false);
    });
  });

  test("test function processGetService with normal condition, should call function setPayloadGetOptionService, getAdditional and formatOptionsService", async () => {
    wrapper.vm.setPayloadGetOptionService = mocksFn[
      "setPayloadGetOptionService"
    ] = jest.fn();
    wrapper.vm.getAdditional = mocksFn["getAdditional"] = jest.fn();
    wrapper.vm.formatOptionsService = mocksFn["formatOptionsService"] =
      jest.fn();
    await wrapper.vm.$nextTick();
    wrapper.vm.processGetService();
    await wrapper.vm.$nextTick();
    expect(mocksFn["setPayloadGetOptionService"]).toHaveBeenCalled();
    expect(mocksFn["getAdditional"]).toHaveBeenCalled();
    expect(mocksFn["formatOptionsService"]).toHaveBeenCalled();
  });

  test("test function processGetService with bad condition, should call function setErrorContextSentry, captureMessage and passErrorToParent", async () => {
    wrapper.vm.setPayloadGetOptionService = mocksFn[
      "setPayloadGetOptionService"
    ] = new Error();
    wrapper.vm.getAdditional = mocksFn["getAdditional"] = new Error();
    wrapper.vm.formatOptionsService = mocksFn["formatOptionsService"] =
      new Error();
    wrapper.vm.$utility.setErrorContextSentry = mocksFn[
      "setErrorContextSentry"
    ] = jest.fn();
    wrapper.vm.$sentry.captureMessage = mocksFn["captureMessage"] = jest.fn();
    wrapper.vm.passErrorToParent = mocksFn["passErrorToParent"] = jest.fn();
    await wrapper.vm.$nextTick();
    wrapper.vm.processGetService();
    await wrapper.vm.$nextTick();
    expect(mocksFn["setErrorContextSentry"]).toHaveBeenCalled();
    expect(mocksFn["captureMessage"]).toHaveBeenCalled();
    expect(mocksFn["passErrorToParent"]).toHaveBeenCalled();
  });

  test("test function processGetLocation with normal condition, should set value options.location {mocked: 'mocked'}'", async () => {
    const LOCATION = {
      name: "mocked-location",
    };
    localStorage.setItem("spots", JSON.stringify(LOCATION));
    wrapper.vm.$utility.setErrorContextSentry = mocksFn[
      "setErrorContextSentry"
    ] = jest.fn();
    wrapper.vm.$sentry.captureMessage = mocksFn["captureMessage"] = jest.fn();
    wrapper.vm.passErrorToParent = mocksFn["passErrorToParent"] = jest.fn();
    await wrapper.vm.$nextTick();
    wrapper.vm.processGetLocation();
    await wrapper.vm.$nextTick();
    expect(mocksFn["setErrorContextSentry"]).not.toHaveBeenCalled();
    expect(mocksFn["captureMessage"]).not.toHaveBeenCalled();
    expect(mocksFn["passErrorToParent"]).not.toHaveBeenCalled();
    expect(wrapper.vm.options.location).toEqual(LOCATION);
  });

  test("test function processGetLocation with bad condition, should call function setErrorContextSentry, captureMessage and passErrorToParent", async () => {
    localStorage.setItem("spots", "abc,mocked");
    wrapper.vm.$utility.setErrorContextSentry = mocksFn[
      "setErrorContextSentry"
    ] = jest.fn();
    wrapper.vm.$sentry.captureMessage = mocksFn["captureMessage"] = jest.fn();
    wrapper.vm.passErrorToParent = mocksFn["passErrorToParent"] = jest.fn();
    await wrapper.vm.$nextTick();
    wrapper.vm.processGetLocation();
    await wrapper.vm.$nextTick();
    expect(mocksFn["setErrorContextSentry"]).toHaveBeenCalled();
    expect(mocksFn["captureMessage"]).toHaveBeenCalled();
    expect(mocksFn["passErrorToParent"]).toHaveBeenCalled();
  });

  test("test function processClearFilter, should set value vehicle = [] user = [], officer = {}, leave_reason = [], column = [], product = [], administration_type = [], transaction_type = {}, gate_type = {}, service = [], shift = {}, pos = {}, location = [], reason = [], ", async () => {
    wrapper.vm.processClearFilter();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.vehicle).toEqual([]);
    expect(wrapper.vm.user).toEqual([]);
    expect(wrapper.vm.officer).toEqual([]);
    expect(wrapper.vm.leave_reason).toEqual([]);
    expect(wrapper.vm.date_range).toEqual([]);
    expect(wrapper.vm.column).toEqual([]);
    expect(wrapper.vm.product).toEqual([]);
    expect(wrapper.vm.administration_type).toEqual({});
    expect(wrapper.vm.transaction_type).toEqual({});
    expect(wrapper.vm.gate_type).toEqual({});
    expect(wrapper.vm.service).toEqual([]);
    expect(wrapper.vm.shift).toEqual({});
    expect(wrapper.vm.pos).toEqual({});
    expect(wrapper.vm.location).toEqual([]);
    expect(wrapper.vm.reason).toEqual([]);
    expect(wrapper.vm.helper.prefix_product).toEqual("NON_MEMBER");
  });

  describe("test function processGenerateCaption", () => {
    it.each([
      {
        case: "props has_period is true, should render words 'Periode'",
        data: { gate_type: false },
        props: { has_period: true },
        expect: "Periode",
      },
      {
        case: "props has_date is true, should render words 'Tanggal'",
        data: { gate_type: false },
        props: { has_date: true },
        expect: "Tanggal",
      },
      {
        case: "props has_date_range is true, should render words 'Rentang Tanggal'",
        data: { gate_type: false },
        props: { has_date_range: true },
        expect: "Rentang Tanggal",
      },
      {
        case: "props has_time_range is true, should render words 'Durasi'",
        data: { gate_type: false },
        props: { has_time_range: true },
        expect: "Durasi",
      },
      {
        case: "props has_vehicle is true, should render words 'Kendaraan'",
        data: { gate_type: false },
        props: { has_vehicle: true },
        expect: "Jenis Kendaraan",
      },
      {
        case: "props has_product is true, should render words 'Produk'",
        data: { gate_type: false },
        props: { has_product: true },
        expect: "Produk",
      },
      {
        case: "props has_user is true, should render words 'Admin'",
        data: { gate_type: false },
        props: { has_user: true },
        expect: "Admin/Pengguna",
      },
      {
        case: "props has_officer is true, should render words 'Petugas'",
        data: { gate_type: false },
        props: { has_officer: true },
        expect: "Petugas",
      },
      {
        case: "props has_shift is true, should render words 'Shift'",
        data: { gate_type: false },
        props: { has_shift: true },
        expect: "Shift",
      },
      {
        case: "props has_type is true, should render words 'Laporan'",
        data: { gate_type: false },
        props: { has_type: true },
        expect: "Jenis Laporan",
      },
      {
        case: "props has_pos is true, should render words 'Pos'",
        data: { gate_type: false },
        props: { has_pos: true },
        expect: "Pos",
      },
      {
        case: "props has_column_setting is true, should render words 'Kolom'",
        data: { gate_type: false },
        props: { has_column_setting: true },
        expect: "Visibilitas Kolom",
      },
      {
        case: "props has_service is true, should render words 'Tambahan'",
        data: { gate_type: false },
        props: { has_service: true },
        expect: "Layanan Tambahan",
      },
      {
        case: "props has_location is true, should render words 'Lokasi'",
        data: { gate_type: false },
        props: { has_location: true },
        expect: "Daftar Lokasi",
      },
      {
        case: "props has_leave_type is true, should render words 'Tipe Izin, Alasan Izin'",
        data: { gate_type: false },
        props: { has_leave_type: true },
        expect: "Tipe Izin, Alasan Izin",
      },
      {
        case: "props has_administration_type is true, should render words 'Administrasi'",
        data: { gate_type: false },
        props: { has_administration_type: true },
        expect: "Tipe Administrasi",
      },
      {
        case: "props has_transaction_type is true, should render words 'Transaksi'",
        data: { gate_type: false },
        props: { has_transaction_type: true },
        expect: "Tipe Transaksi",
      },
      {
        case: "props has_transaction_status is true, should render words 'Transaksi'",
        data: { gate_type: false },
        props: { has_transaction_status: true },
        expect: "Status Transaksi",
      },
      {
        case: "props has_reason is true, should render words 'Alasan'",
        data: { gate_type: false },
        props: { has_reason: true },
        expect: "Alasan",
      },
      {
        case: "has helper gate type is true, should set value tooltip text has 'Tipe Palang/Gate'",
        data: { gate_type: true },
        props: {},
        expect: "Tipe Palang/Gate",
      },
    ])("$case", async (data) => {
      wrapper.setProps(data.props);
      wrapper.vm.helper.gate_type = data.data.gate_type;
      await wrapper.vm.$nextTick();

      wrapper.vm.processGenerateCaption();

      expect(wrapper.vm.helper.tooltip.text).toEqual(data.expect);
    });
  });
});
