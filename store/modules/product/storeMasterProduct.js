import { masterProductService } from "@/api/product.service/master";

const state = () => ({
  MASTER_PRODUCT_LIST: [],
});

const getters = {};

const actions = {
  async getMasterProduct({ commit, dispatch }, payload) {
    return await masterProductService.get(payload.filter, payload.pagination, payload.order).then((data) => {
      return data;
    }).catch((error) => {
      dispatch(
        "modules/utility/storeUtility/setDefaultErrorAlert",
        { message: error.response.data.message },
        { root: true }
      );
      throw error;
    });
  },

  async getRelatedMasterProduct({ commit, dispatch }, payload) {
    return await masterProductService.getRelated(payload.id).then((data) => {
      return data.values;
    }).catch((error) => {
      dispatch(
        "modules/utility/storeUtility/setDefaultErrorAlert",
        { message: error.response.data.message },
        { root: true }
      );
      throw error;
    });
  },

  async getMasterProductDetail({ commit, dispatch }, payload) {
    return await masterProductService.show(payload.id).then((data) => {
      return data.values;
    }).catch((error) => {
      dispatch(
        "modules/utility/storeUtility/setDefaultErrorAlert",
        { message: error.response.data.message },
        { root: true }
      );
      throw error;
    });
  },

  async createMasterProduct({ commit, dispatch }, payload) {
    return await masterProductService.create(payload).then((data) => {
      commit("CLEAR_MASTER_PRODUCT");
      dispatch(
        "modules/utility/storeUtility/setDefaultSuccessAlert",
        { message: data.message },
        { root: true }
      );
      return data;
    }).catch((error) => {
      dispatch(
        "modules/utility/storeUtility/setDefaultErrorAlert",
        { message: error.response.data.message },
        { root: true }
      );
      throw error;
    });
  },

  async updateMasterProduct({ commit, dispatch }, payload) {
    return await masterProductService.update(payload.id, payload).then((data) => {
      commit("CLEAR_MASTER_PRODUCT");
      dispatch(
        "modules/utility/storeUtility/setDefaultSuccessAlert",
        { message: data.message },
        { root: true }
      );
      return data;
    })
      .catch((error) => {
        dispatch(
          "modules/utility/storeUtility/setDefaultErrorAlert",
          { message: error.response.data.message },
          { root: true }
        );
        throw error;
      });
  },

  async deleteMasterProduct({ commit, dispatch }, payload) {
    return await masterProductService.remove(payload.id).then((data) => {
      commit("CLEAR_MASTER_PRODUCT");
      dispatch(
        "modules/utility/storeUtility/setDefaultSuccessAlert",
        { message: data.message },
        { root: true }
      );
      return data;
    }).catch((error) => {
      console.log(error);
      dispatch(
        "modules/utility/storeUtility/setDefaultErrorAlert", {
        message: error.response.data.message,
        opener: payload.opener,
      },
        { root: true }
      );
      throw error;
    });
  },

  async setDefaultMasterProduct({ commit, dispatch }, payload) {
    return await masterProductService.setDefault(payload.id).then((data) => {
      commit("CLEAR_MASTER_PRODUCT");
      dispatch(
        "modules/utility/storeUtility/setDefaultSuccessAlert",
        { message: data.message },
        { root: true }
      );
      return data;
    }).catch((error) => {
      dispatch(
        "modules/utility/storeUtility/setDefaultErrorAlert",
        { message: error.response.data.message },
        { root: true }
      );
      throw error;
    });
  },

  async setStatusMasterProduct({ commit, dispatch }, payload) {
    return await masterProductService.setStatus(payload.id, payload).then((data) => {
      commit("CLEAR_MASTER_PRODUCT");
      dispatch(
        "modules/utility/storeUtility/setDefaultSuccessAlert",
        { message: data.message },
        { root: true }
      );
      return data;
    }).catch((error) => {
      dispatch(
        "modules/utility/storeUtility/setDefaultErrorAlert",
        { message: error.response.data.message },
        { root: true }
      );
      throw error;
    });
  },
};

const mutations = {
  SET_MASTER_PRODUCT(state, data) {
    state.MASTER_PRODUCT_LIST = data;
  },
  CLEAR_MASTER_PRODUCT(state) {
    state.MASTER_PRODUCT_LIST = [];
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
