import {userService} from "@/api/user.service/user";

const state = () => ({});

const getters = {}

const actions = {
    async getUser({commit, dispatch}, payload) {
        return await userService.get(payload.filter, payload.pagination, payload.order).then(data => {
            return data
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    async getUserBySpotId({commit, dispatch}, payload) {
        return await userService.getBySpot(payload.filter, payload.pagination, payload.order).then(data => {
            return data
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    async getUserDetail({commit, dispatch}, payload) {
        return await userService.show(payload.id).then(data => {
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    async createUser({commit, dispatch}, payload) {
        return await userService.create(payload).then(data => {
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

    async updateUser({commit, dispatch}, payload) {
        return await userService.update(payload.id, payload).then(data => {
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

    async deleteUser({commit, dispatch}, payload) {
        return await userService.remove(payload.id).then(data => {
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

    async inviteUser({commit, dispatch}, payload) {
        return await userService.invite(payload.spot_id, payload).then(data => {
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

    async updateAccessUser({commit, dispatch}, payload) {
        return await userService.update_access(payload.id, payload.spot_id, payload).then(data => {
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

    async removeAccessUser({commit, dispatch}, payload) {
        return await userService.remove_access(payload.id, payload.spot_id).then(data => {
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


};

const mutations = {};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
