import { leaveService } from '@/api/officer.service/leave';

const state = () => ({})

const getters = {}

const actions = {
  async updateOfficerLeave({ commit, dispatch }, payload) {
    return await leaveService.update(payload.id, payload).then(data => {
      dispatch("modules/utility/storeUtility/setDefaultSuccessAlert", {
        message: data.message,
        opener: payload.opener
      }, { root: true })
      return data
    }).catch((error) => {
      dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
        message: error.response.data.message,
        opener: payload.opener
      }, { root: true })
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