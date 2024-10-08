import {officerService} from '@/api/officer.service/officer';

const state = () => ({
    data: {},
    currentData: {}
})

const getters = {}

const actions = {
    async getOfficer({commit, dispatch}, payload) {
        return await officerService.get(payload.filter, payload.pagination, payload.order).then(data => {
            return data
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    async createOfficer({commit, dispatch}, payload) {
        return await officerService.create(payload).then(data => {
            dispatch("modules/utility/storeUtility/setDefaultSuccessAlert", {
                message: data.message,
                opener: payload.opener
            }, {root: true})
            return data
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    async updateOfficer({commit, dispatch}, payload) {
        return await officerService.update(payload.id, payload).then(data => {
            dispatch("modules/utility/storeUtility/setDefaultSuccessAlert", {
                message: data.message,
                opener: payload.opener
            }, {root: true})
            return data
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    async inviteOfficer({commit, dispatch}, payload) {
        return await officerService.invite(payload.spot_id, payload).then(data => {
            dispatch("modules/utility/storeUtility/setDefaultSuccessAlert", {
                message: data.message,
                opener: payload.opener
            }, {root: true})
            return data
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    async updatePinOfficer({commit, dispatch}, payload) {
        return await officerService.renewPin(payload.id, payload).then(data => {
            dispatch("modules/utility/storeUtility/setDefaultSuccessAlert", {
                message: data.message,
                opener: payload.opener
            }, {root: true})
            return data
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    async kickOfficer({commit, dispatch}, payload) {
        return await officerService.kick(payload.spot_id, payload.officer_id).then(data => {
            dispatch("modules/utility/storeUtility/setDefaultSuccessAlert", {
                message: data.message,
                opener: payload.opener
            }, {root: true})
            return data
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    async showOfficer({commit, dispatch}, id) {
        return await officerService.show(id).then(data => {
            return data
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    async deleteOfficer({commit, dispatch}, payload) {
        return await officerService.remove(payload.id).then(data => {
            dispatch("modules/utility/storeUtility/setDefaultSuccessAlert", {
                message: data.message,
                opener: payload.opener
            }, {root: true})
            return data
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

}

const mutations = {}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};