import {finderService} from "@/api/finder.service/finder";

const state = () => ({})

const getters = {}

const actions = {
    async getFinderLog({commit, dispatch}, payload) {
        return await finderService.getLogs(payload.id).then(data => {
            return data.values
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




