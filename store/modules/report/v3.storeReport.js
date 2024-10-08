import { incomeReportService } from '~/api/v3.report.service/income'
import { quantityReportService } from "~/api/v3.report.service/quantity";

const state = () => ({
  data: {},
  currentData: {}
});

const getters = {}

const actions = {
  getIncomeReportByTransaction({ commit, dispatch }, payload) {
    return incomeReportService.getIncomeReportByTransaction(payload.filter).then(data => {
      commit('returnData', data.values)
      return data.values
    }).catch((error) => {
      dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
        message: error.response.data.message,
        opener: payload.opener
      }, { root: true })
      throw error
    })
  },
  getIncomeReportByPayment({ commit, dispatch }, payload) {
    return incomeReportService.getIncomeReportByPayment(payload.filter).then(data => {
      commit('returnData', data.values)
      return data.values
    }).catch((error) => {
      dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
        message: error.response.data.message,
        opener: payload.opener
      }, { root: true })
      throw error
    })
  },
  getIncomeOverstayReport({ commit, dispatch }, payload) {
    return incomeReportService.getIncomeOverstayReport(payload.filter).then(data => {
      commit('returnData', data.values)
      return data.values
    }).catch((error) => {
      dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
        message: error.response.data.message,
        opener: payload.opener
      }, { root: true })
      throw error
    })
  },
  getIncomeReportByOfficer({ commit, dispatch }, payload) {
    return incomeReportService.getIncomeReportByOfficer(payload.filter, payload.version).then(data => {
      return data
    }).catch((error) => {
      dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
        message: error.response.data.message,
        opener: payload.opener
      }, { root: true })
      throw error
    })
  },
  getQuantityReportByTransaction({ commit, dispatch }, payload) {
    return quantityReportService.getQuantityReportByTransaction(payload.filter).then(data => {
      commit('returnData', data.values)
      return data.values
    }).catch((error) => {
      dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
        message: error.response.data.message,
        opener: payload.opener
      }, { root: true })
      throw error
    })
  },
  getQuantityReportByPayment({ commit, dispatch }, payload) {
    return quantityReportService.getQuantityReportByPayment(payload.filter).then(data => {
      commit('returnData', data.values)
      return data.values
    }).catch((error) => {
      dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
        message: error.response.data.message,
        opener: payload.opener
      }, { root: true })
      throw error
    })
  },
  getQuantityOverstayReport({ commit, dispatch }, payload) {
    return quantityReportService.getQuantityOverstayReport(payload.filter).then(data => {
      commit('returnData', data.values)
      return data.values
    }).catch((error) => {
      dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
        message: error.response.data.message,
        opener: payload.opener
      }, { root: true })
      throw error
    })
  },
  getQuantityInOutReport({ commit, dispatch }, payload) {
    return quantityReportService.getQuantityInOutReport(payload.filter, payload.version).then(data => {
      commit('returnData', data.values)
      return data.values
    }).catch((error) => {
      dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
        message: error.response.data.message,
        opener: payload.opener
      }, { root: true })
      throw error
    })
  },
};

const mutations = {
  returnData(state, data) {
    return data.values
  },

  clearData(state) {
    state.data = {}
    return null
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

