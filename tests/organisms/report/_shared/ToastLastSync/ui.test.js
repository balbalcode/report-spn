import { shallowMount, createLocalVue } from "@vue/test-utils";
import { BToast } from "bootstrap-vue";

import ToastLastSync from "@/components/organisms/report/_shared/ToastLastSync"

const localVue = createLocalVue()
localVue.component('b-toast', BToast)

let wrapper
const mocks = {
  $utility: {
    formatLocalTimezone: () => ""
  },
  $bvToast: {
    hide() { }
  }
}
let mocksFn = {}
const id = "toast-last-sync"

describe("ui.ToastLastSync.vue", () => {
  beforeEach(() => {
    mocksFn = {}
    wrapper = shallowMount(ToastLastSync, { localVue, mocks, propsData: { id } })
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  describe("test b-toast", () => {
    it("should be rendered correctly", async () => {
      const bToast = wrapper.findComponent({ ref: id })
      expect(bToast.exists()).toBeTruthy()
    })

    it.each([
      { last_sync: 1683609164363, visible: true },
      { last_sync: 0, visible: false },
      { last_sync: undefined, visible: false },
      { last_sync: null, visible: false },
      { last_sync: "", visible: false }
    ])('given last_sync $last_sync, b-toast visible prop should be $visible', async ({ last_sync, visible }) => {
      wrapper.setProps({ last_sync })
      await wrapper.vm.$nextTick()

      const bToast = wrapper.findComponent({ ref: id })
      expect(bToast.props("visible")).toBe(visible)
    })
  })

  it("given last_sync, info-text should be rendered", async () => {
    const textLastSync = "09/05/2023 12:12:43"
    wrapper.vm.$utility.formatLocalTimezone = mocksFn['$utility.formatLocalTimezone'] =
      jest.fn().mockReturnValue(textLastSync)

    wrapper.setProps({ last_sync: 1683609164363 })
    await wrapper.vm.$nextTick()

    const infoText = wrapper.find(`#${id}__info-text`)
    expect(infoText.exists()).toBeTruthy()
    expect(infoText.text()).toMatch(`Terakhir diperbarui ${textLastSync}`)
  })

  it("given last_sync, btn-close should be rendered", async () => {
    wrapper.vm.$bvToast.hide = mocksFn['$bvToast.hide'] = jest.fn()

    wrapper.setProps({ last_sync: 1683609164363 })
    await wrapper.vm.$nextTick()

    const btnClose = wrapper.find(`#${id}__btn-close`)
    expect(btnClose.exists()).toBeTruthy()
    
    await btnClose.trigger("click")
    expect(mocksFn['$bvToast.hide'].mock.calls).toEqual([[id]])
  })
})