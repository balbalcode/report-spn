import {paymentListService} from "~/api/master.service/payment-list";

const state = () => ({})

const getters = {}

const actions = {

    async getPaymentMethod({dispatch}) {
        return await paymentListService.get().then(data => {
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




