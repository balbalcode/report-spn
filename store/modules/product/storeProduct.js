import {productService} from "@/api/product.service/product";

const state = () => ({
    PRODUCT_LIST: [],
});

const getters = {}

const actions = {
    async getMembershipProduct({commit, dispatch}, payload) {
        return await productService.get(payload.spot_id, payload.filter, payload.pagination, payload.order).then(data => {
            return data
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    async getMembershipProductDetail({commit, dispatch}, payload) {
        return await productService.show(payload.spot_id, payload.membership_id).then(data => {
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    async createMembershipProduct({commit, dispatch}, payload) {
        return await productService.create(payload.spot_id, payload).then(data => {
            commit('CLEAR_PRODUCT')
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

    async updateMembershipProduct({commit, dispatch}, payload) {
        return await productService.update(payload.spot_id, payload.id, payload).then(data => {
            commit('CLEAR_PRODUCT')
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

};

const mutations = {
    SET_PRODUCT(state, data) {
        state.PRODUCT_LIST = data
    },
    CLEAR_PRODUCT(state) {
        state.PRODUCT_LIST = []
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
