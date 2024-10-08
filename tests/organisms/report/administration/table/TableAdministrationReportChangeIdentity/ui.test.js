import { shallowMount, createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import TableAdministrationReportChangeIdentity from "@/components/organisms/report/administration/table/TableAdministrationReportChangeIdentity";
import { dataGetAdministrationReport, payloadGet, reportContent, reportHeader } from "./mock";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

let wrapper;
const mocks = {
  $utility: {
    getSpotId() { },
    getSpotMembershipType() { },
    getAssetUrl() { },
    dateUTCToLocal() { },
    formatLocalTimezone() { },
    setErrorContextSentry() { }
  },
  $sentry: {
    captureMessage() { }
  }
}

describe("ui.TableAdministrationReportChangeIdentity.vue", () => {
  let mocksFn = {}

  beforeEach(() => {
    mocksFn = {}
    mocksFn['setMemberType'] = jest.spyOn(TableAdministrationReportChangeIdentity.methods, 'setMemberType').mockImplementation()
    mocksFn['processGetData'] = jest.spyOn(TableAdministrationReportChangeIdentity.methods, 'processGetData').mockImplementation()

    const propsData = { is_searching: false, month: "2023-01", administration: { text: "Ganti Periode", value: "CHANGE_PERIOD" } }
    wrapper = shallowMount(TableAdministrationReportChangeIdentity, { localVue, mocks, propsData })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it.each([
    {
      case: "given helper.is_loading true, should render content-span-loading",
      helper: { is_loading: true, is_error: false }, data: { rows: [] }, report: [],
      loading_content_exists: true, error_content_exists: false, empty_content_exists: false, table_content_exists: false
    },
    {
      case: "given helper.is_error true, should render content-span-error",
      helper: { is_loading: false, is_error: true }, data: { rows: [] }, report: [],
      loading_content_exists: false, error_content_exists: true, empty_content_exists: false, table_content_exists: false
    },
    {
      case: "given data empty, should render content-span-empty",
      helper: { is_loading: false, is_error: false }, data: { rows: [] }, report: [],
      loading_content_exists: false, error_content_exists: false, empty_content_exists: true, table_content_exists: false
    },
    {
      case: "given data not empty, should render wrapper-table-report",
      helper: { is_loading: false, is_error: false }, data: dataGetAdministrationReport, report: reportContent,
      loading_content_exists: false, error_content_exists: false, empty_content_exists: false, table_content_exists: true
    }
  ])('$case', async ({ helper, data, report, loading_content_exists, error_content_exists, empty_content_exists, table_content_exists }) => {
    wrapper.vm.helper = helper
    await wrapper.vm.$nextTick()
    wrapper.vm.data = data
    await wrapper.vm.$nextTick()
    wrapper.vm.report = report
    await wrapper.vm.$nextTick()

    const loading_content = wrapper.findComponent({ ref: "content-span-loading" })
    expect(loading_content.exists()).toBe(loading_content_exists)

    const error_content = wrapper.findComponent({ ref: "content-span-error" })
    expect(error_content.exists()).toBe(error_content_exists)

    const empty_content = wrapper.findComponent({ ref: "content-span-empty" })
    expect(empty_content.exists()).toBe(empty_content_exists)

    const table_content = wrapper.find("#wrapper-table-report")
    expect(table_content.exists()).toBe(table_content_exists)
  })

  it("table should display data according report data", async () => {
    wrapper.vm.helper.is_loading = false
    await wrapper.vm.$nextTick()
    wrapper.vm.helper.is_error = false
    await wrapper.vm.$nextTick()
    wrapper.vm.data = dataGetAdministrationReport
    await wrapper.vm.$nextTick()
    wrapper.vm.report = reportContent
    await wrapper.vm.$nextTick()

    const tbody = wrapper.find("tbody")
    expect(tbody.exists()).toBe(true)

    const list_tr = tbody.findAll("tr")
    for (let index = 0; index < list_tr.length; index++) {
      const list_td = list_tr.at(index).findAll("td")
      expect(list_td.at(0).text()).toContain(reportContent[index].date)
      expect(list_td.at(1).text()).toContain(reportContent[index].type)
      expect(list_td.at(2).text()).toContain(reportContent[index].previous_name)
      expect(list_td.at(3).text()).toContain(reportContent[index].previous_identification_number)
      expect(list_td.at(4).text()).toContain(reportContent[index].previous_email)
      expect(list_td.at(5).text()).toContain(reportContent[index].previous_employee_phone)
      expect(list_td.at(6).text()).toContain(reportContent[index].updated_name)
      expect(list_td.at(7).text()).toContain(reportContent[index].updated_identification_number)
      expect(list_td.at(8).text()).toContain(reportContent[index].updated_email)
      expect(list_td.at(9).text()).toContain(reportContent[index].updated_employee_phone)
      expect(list_td.at(10).text()).toContain(reportContent[index].user)
    }
  })
})