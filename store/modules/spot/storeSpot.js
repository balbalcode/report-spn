import {spotsService} from '~/api/spots.service/spots';

const state = () => ({
    currentSpot: {}
})

const getters = {
    getStateCurrentSpot(state) {
        return (state.currentSpot) ? state.currentSpot : {}
    },
}

const actions = {
    async getSpot({dispatch}) {
        return await spotsService.get().then(data => {
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    async getSpotList({dispatch}, payload) {
        return await spotsService.getList(payload.filter).then(data => {
            return data
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    async getSpotDetail({commit, dispatch}, payload) {
        return await spotsService.show(payload.id).then(data => {
            commit('toggleCurrentSpot', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    async createSpot({commit, dispatch}, payload) {
        return await spotsService.create(payload).then(data => {
            commit('toggleCurrentSpot', data.values)
            dispatch("modules/utility/storeUtility/setDefaultSuccessAlert", {
                message: data.message,
                opener: payload.opener
            }, {root: true})
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    async updateSpot({commit, dispatch}, payload) {
        return await spotsService.update(payload.id, payload).then(data => {
            commit('toggleCurrentSpot', data.values)
            dispatch("modules/utility/storeUtility/setDefaultSuccessAlert", {
                message: data.message,
                opener: payload.opener
            }, {root: true})
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

const mutations = {
    toggleCurrentSpot(state, currentSpot) {
        state.currentSpot = currentSpot;
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};




