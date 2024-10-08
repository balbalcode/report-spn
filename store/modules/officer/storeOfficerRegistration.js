import {registrationService} from '@/api/officer.service/registration';

const state = () => ({})

const getters = {}

const actions = {
    async getRegistedOfficers({commit, dispatch}, payload) {
        return await registrationService.get(payload).then(data => {
            return data
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    async updateRegistedOfficer({commit, dispatch}, payload) {
        return await registrationService.update(payload.id, payload).then(data => {
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