import {incomeReportService} from '~/api/v2.report.service/income'
import {motorcycleReportService} from "~/api/v2.report.service/motorcycle";
import {casualReportService} from "~/api/v2.report.service/casual";
import {cashlessReportService} from "~/api/v2.report.service/cashless";

const state = () => ({
    data: {},
    currentData: {}
});

const getters = {}

const actions = {
    getIncomeReportByDate({commit, dispatch}, payload) {
        return incomeReportService.getIncomeReportByDate(payload.month, payload.spot_id, payload.vehicle_codes, payload.type).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    getMotorcycleReportByDate({commit, dispatch}, payload) {
        return motorcycleReportService.getMotorcycleReportByDate(payload.month, payload.spot_id, payload.vehicle_codes, payload.type).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    getCasualReportIncomeByDate({commit, dispatch}, payload) {
        return casualReportService.getCasualReportIncomeByDate(payload.month, payload.spot_id, payload.vehicle_codes).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    getCasualReportQuantityByDate({commit, dispatch}, payload) {
        return casualReportService.getCasualReportQuantityByDate(payload.month, payload.spot_id, payload.vehicle_codes).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    getCashlessReportIncomeByDate({commit, dispatch}, payload) {
        return cashlessReportService.getCashlessReportIncomeByDate(payload.month, payload.spot_id, payload.vehicle_codes).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    getCashlessReportQuantityByDate({commit, dispatch}, payload) {
        return cashlessReportService.getCashlessReportQuantityByDate(payload.month, payload.spot_id, payload.vehicle_codes).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    getCashlessReportIncomeByShift({commit, dispatch}, payload) {
        return cashlessReportService.getCashlessReportIncomeByShift(payload.month, payload.spot_id, payload.vehicle_codes).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
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

