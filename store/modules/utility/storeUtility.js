import {utilityService} from "@/api/utility.service/utility"

const state = () => ({
    alert: [],
    has_option_spot: true,
    selected_timezone: "",
    toggling_menu: false,
    active_single_dropdown: {},
    active_stacked_dropdown: []
});


const getters = {
    getAlert(state) {
        return state.alert
    },

    getOptionSpot(state) {
        return state.has_option_spot
    },

    getStackedDropdown(state) {
        return state.active_stacked_dropdown
    },

    getSingleDropdown(state) {
        return state.active_single_dropdown
    },
}

const actions = {

    togglingMenu({ commit }, payload) {
        commit('setTogglingMenu', payload)
    },

    setOptionSpot({commit}, payload) {
        commit('setOptionsSpot', payload)
    },

    setAlert({commit}, payload) {
        commit('pushAlert', payload);
    },

    setDefaultErrorAlert({commit}, error) {
        let payload = {
            type: "danger",
            title: "Gagal Memproses Data",
            opener: error.opener ?? window.$nuxt.$route.path,
            content: error.message,
            duration: 8000
        }
        commit('pushAlert', payload);
    },

    setDefaultSuccessAlert({commit}, error) {
        let payload = {
            type: "success",
            title: "Berhasil Memproses Data ",
            opener: error.opener ?? window.$nuxt.$route.path,
            content: error.message,
            duration: 8000
        }
        commit('pushAlert', payload);
    },

    setSuccessAlert({commit}, payload) {
        payload = {
            type: "success",
            title: payload.title,
            content: payload.message,
            opener: payload.opener ?? window.$nuxt.$route.path,
            duration: 8000
        }
        commit('pushAlert', payload);
    },

    setErrorAlert({commit}, payload) {
        payload = {
            type: "danger",
            title: payload.title,
            content: payload.message,
            opener: payload.opener ?? window.$nuxt.$route.path,
            duration: 8000
        }
        commit('pushAlert', payload);
    },

    removeAlert({commit}, payload) {
        commit('popAlert', payload)
    },

    clearAlert({commit}) {
        commit('clearAlert')
    },

    appendStackedDropdown({commit}, payload) {
        commit("appendStackedDropdown", payload)
    },

    popStackedDropdown({commit}, payload) {
        commit("popStackedDropdown", payload)
    },

    setSingleDropdown({commit}, payload) {
        commit("setSingleDropdown", payload)
    },

    clearSingleDropdown({commit}) {
        commit("clearSingleDropdown")
    },

    clearStackedDropdown({commit}) {
        commit("clearStackedDropdown")
    },

    async getCurrentVersionCode({commit}, payload) {
        return await utilityService.get(payload.type).then(data => {
            return data.values
        }).catch((e) => {
            throw e
        })
    }
}

const mutations = {
    setOptionsSpot(state, status) {
        state.has_option_spot = status
    },

    setSelectedTimezone(state, timezone) {
        let selected_timezone = timezone
        if (!selected_timezone) {
            const spot = window.$nuxt.$utility.getSelectedSpot()
            if (spot && spot.timezone) selected_timezone = spot.timezone
        }
        state.selected_timezone = selected_timezone
    },

    pushAlert(state, alert) {
        state.alert.push(alert);
    },

    popAlert(state, index) {
        state.alert.splice(index, 1)
    },

    clearAlert(state) {
        state.alert = []
    },

    clearSingleDropdown(state) {
        state.active_single_dropdown = null
    },

    clearStackedDropdown(state) {
        state.active_stacked_dropdown = null
    },

    appendStackedDropdown(state, data) {
        state.active_stacked_dropdown.push(data)
    },

    popStackedDropdown(state, data) {
        let index = state.active_stacked_dropdown.indexOf(data)
        state.active_stacked_dropdown.slice(index, 1)
    },

    setSingleDropdown(state, data) {
        state.active_single_dropdown = data
    },

    setTogglingMenu(state, data) {
        state.toggling_menu = data
    }
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};

