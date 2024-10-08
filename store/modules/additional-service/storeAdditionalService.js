import {additionalService} from "@/api/additional-service.service/additional";

const state = () => ({});

const getters = {}

const actions = {
    async getAdditional({commit, dispatch}, payload) {
        return await additionalService.get(payload.spot_id).then(data => {
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

const mutations = {};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
