import { createLocalVue, shallowMount } from "@vue/test-utils"
import BootstrapVue from "bootstrap-vue"
import TableAttendanceReport from "@/components/organisms/report/attendance/TableAttendanceReport"
import { dataGetReport, formattedReport, payloadGet, reportHeaders, reportRows } from "./mock"

const localVue = createLocalVue()
localVue.use(BootstrapVue)

let wrapper

const mocks = {
  $utility: {
    formatLocalTimezone() { },
    getSpotId() { },
    setErrorContextSentry() { },
    getAssetUrl() { }
  },
  $sentry: {
    captureMessage() { }
  }
}

describe("unit.TableAttendanceReport.vue", () => {
  let mocksFn = {}

  beforeEach(() => {
    mocksFn = {}
    mocksFn['processGetData'] = jest.spyOn(TableAttendanceReport.methods, 'processGetData').mockImplementation()
    wrapper = shallowMount(TableAttendanceReport, { localVue, mocks })
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
      case: "given data.rows.length < 1, should render content-span-empty",
      helper: { is_loading: false, is_error: false }, data: { rows: [] }, report: [],
      loading_content_exists: false, error_content_exists: false, empty_content_exists: true, table_content_exists: false
    },
    {
      case: "given data.rows.length > 0, should render wrapper-table-content",
      helper: { is_loading: false, is_error: false }, data: { rows: dataGetReport.rows }, report: formattedReport,
      loading_content_exists: false, error_content_exists: false, empty_content_exists: false, table_content_exists: true
    },
  ])('$case', async ({ helper, data, report, loading_content_exists, error_content_exists, empty_content_exists, table_content_exists }) => {
    wrapper.vm.helper.is_error = helper.is_error
    wrapper.vm.helper.is_loading = helper.is_loading
    wrapper.vm.data = data
    wrapper.vm.report = report
    await wrapper.vm.$nextTick()

    const loading_content = wrapper.findComponent({ ref: "content-span-loading" })
    expect(loading_content.exists()).toBe(loading_content_exists)

    const error_content = wrapper.findComponent({ ref: "content-span-error" })
    expect(error_content.exists()).toBe(error_content_exists)

    const empty_content = wrapper.findComponent({ ref: "content-span-empty" })
    expect(empty_content.exists()).toBe(empty_content_exists)

    const table_content = wrapper.find("#wrapper-table-content")
    expect(table_content.exists()).toBe(table_content_exists)
  })

  it("given data.rows & report are not empty, should show appropiate headers & data on table", async () => {
    wrapper.vm.data.rows = dataGetReport.rows
    wrapper.vm.report = formattedReport
    await wrapper.vm.$nextTick()

    const headers = wrapper.findAll("#wrapper-table-content table thead tr th")
    for (let indexHeader = 0; indexHeader < headers.length; indexHeader++) {
      expect(headers.at(indexHeader).text()).toMatch(reportHeaders[indexHeader])
    }

    const overviewLabelCells = [2, 9, 10]

    const rows = wrapper.findAll("#wrapper-table-content table tbody tr")
    for (let indexRow = 0; indexRow < rows.length; indexRow++) {
      const cells = rows.at(indexRow).findAll("td")
      for (let indexCell = 0; indexCell < cells.length; indexCell++) {
        if (!overviewLabelCells.includes(indexCell)) {
          expect(rows.at(indexRow).text()).toMatch(reportRows[indexRow][indexCell])
        }
      }

      const overviewOfficerId = wrapper.findComponent({ ref: `overview-officer-id-${indexRow}` })
      expect(overviewOfficerId.exists()).toBe(true)
      expect(overviewOfficerId.props("value")).toMatch(reportRows[indexRow][2])

      const overviewImageUrl = wrapper.findComponent({ ref: `overview-image-url-${indexRow}` })
      expect(overviewImageUrl.exists()).toBe(true)
      expect(overviewImageUrl.props("value")).toMatch(reportRows[indexRow][9])

      const overviewImageUrlOut = wrapper.findComponent({ ref: `overview-image-url-out-${indexRow}` })
      expect(overviewImageUrlOut.exists()).toBe(true)
      expect(overviewImageUrlOut.props("value")).toMatch(reportRows[indexRow][10])
    }
  })

  it("trigger click on a certain row, should call toggleModalImage", async () => {
    wrapper.vm.toggleModalImage = mocksFn['toggleModalImage'] = jest.fn()
    wrapper.vm.data.rows = dataGetReport.rows
    wrapper.vm.report = formattedReport
    await wrapper.vm.$nextTick()

    const rows = wrapper.findAll("#wrapper-table-content table tbody tr")

    await rows.at(1).trigger("click")
    await wrapper.vm.$nextTick()

    await rows.at(0).trigger("click")
    await wrapper.vm.$nextTick()

    expect(mocksFn['toggleModalImage'].mock.calls).toEqual([[formattedReport[1]], [formattedReport[0]]])
  })

  it("trigger click on btn-close-modal, should call toggleModalImage", async () => {
    wrapper.vm.toggleModalImage = mocksFn['toggleModalImage'] = jest.fn()
    wrapper.vm.selected_data = formattedReport[0]
    wrapper.vm.modal.modal_image = true
    await wrapper.vm.$nextTick()

    const btnCloseModal = wrapper.findComponent({ ref: "btn-close-modal" })
    await btnCloseModal.trigger("click")
    await wrapper.vm.$nextTick()

    expect(mocksFn['toggleModalImage'].mock.calls).toEqual([[]])
  })
})