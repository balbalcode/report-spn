import {helper} from "~/api/config/helper";

export const productService = {
    get,
    show,
    create,
    update
};

async function get(spot_id, filter, pagination, order) {
    let axios = window.$nuxt.$axios
    return axios.get(`/v1/spot/${spot_id}/membership?${helper(filter, pagination, order)}`, {timeout: 25500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function show(spot_id, membership_id) {
    let axios = window.$nuxt.$axios
    return axios.get(`/v1/spot/${spot_id}/membership/${membership_id}`, {timeout: 25500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function create(spot_id, data) {
    let axios = window.$nuxt.$axios
    return axios.post(`/v1/spot/${spot_id}/membership`, data, {timeout: 25500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function update(spot_id, membership_id, data) {
    let axios = window.$nuxt.$axios
    delete data.id
    return axios.put(`/v1/spot/${spot_id}/membership/${membership_id}`, data, {timeout: 25500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}