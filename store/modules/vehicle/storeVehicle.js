import {vehicleService} from "~/api/vehicle.service/vehicle";

const state = () => ({
    VEHICLE_GROUP: null, // vehicles grouped into mt, mb, kl
    VEHICLE: null, // vehicles in array (not grouped into mt, mb, kl)
    VEHICLE_MAP: null // vehicles in object (the keys are the code of each vehicle)
});

const getters = {}

const actions = {
    async getVehicle({commit, dispatch}, payload) {
        return await vehicleService.get(payload.spot_id).then(data => {
            commit('setVehicleGroup', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },


    async getVehicleDetail({commit, dispatch}, payload) {
        return await vehicleService.show(payload.id, payload.spot_id).then(data => {
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    async actionVehicle({commit, dispatch}, payload) {
        return await vehicleService.action(payload.spot_id, payload).then(data => {
            dispatch("modules/utility/storeUtility/setDefaultSuccessAlert", {
                message: data.message,
                opener: payload.opener
            }, {root: true})
            commit('setVehicleGroup', null)
            commit('setVehicle', null)
            commit('mapVehicle', null)
            return data
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    async createVehicle({commit, dispatch}, payload) {
        return await vehicleService.create(payload.spot_id, payload).then(data => {
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

    async updateVehicle({commit, dispatch}, payload) {
        return await vehicleService.update(payload.id, payload.spot_id, payload).then(data => {
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

    async deleteVehicle({commit, dispatch}, payload) {
        return await vehicleService.remoce(payload.id, payload.spot_id).then(data => {
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

    mapVehicle({commit}, payload) {
        commit("mapVehicle", payload)
    },

    storeVehicle({commit}, payload) {
        commit("setVehicle", payload)
    },
};

const mutations = {
    setVehicleGroup(state, data) {
        state.VEHICLE_GROUP = data
    },

    setVehicle(state, data) {
        state.VEHICLE = data
    },

    mapVehicle(state, data) {
        state.VEHICLE_MAP = data
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};