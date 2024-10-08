import {helper} from "~/api/config/helper";

export const userService = {
    get,
    getBySpot,
    show,
    create,
    update,
    remove,
    invite,
    update_access,
    remove_access
};

async function get(filter, pagination, order) {
    let axios = window.$nuxt.$axios
    return axios.get(`/v1/mgmt/users?${helper(filter, pagination, order)}`, {timeout: 25500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });

}

async function getBySpot(filter, pagination, order) {
    let axios = window.$nuxt.$axios
    return axios.get(`/v1/mgmt/users?${helper(filter, pagination, order)}`, {timeout: 25500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}


async function show(id) {
    let axios = window.$nuxt.$axios
    return axios.get(`/v1/mgmt/users/${id}`, {timeout: 25500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function create(data) {
    let axios = window.$nuxt.$axios
    return axios.post(`/v1/mgmt/users`, data, {timeout: 25500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function update(id, data) {
    let axios = window.$nuxt.$axios
    delete data.id
    return axios.put(`/v1/mgmt/users/${id}`, data, {timeout: 25500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function remove(data) {
    let axios = window.$nuxt.$axios
    delete data.id
    return axios.delete(`/v1/mgmt/users/${data}`, {timeout: 25500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function invite(spot_id, data) {
    let axios = window.$nuxt.$axios
    return axios.post(`/v1/mgmt/spots/${spot_id}/users`, data, {timeout: 25500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function update_access(id, spot_id, data) {
    let axios = window.$nuxt.$axios
    return axios.put(`/v1/mgmt/spots/${spot_id}/users/${id}`, data, {timeout: 25500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function remove_access(id, spot_id) {
    let axios = window.$nuxt.$axios
    return axios.delete(`/v1/mgmt/spots/${spot_id}/users/${id}`, {timeout: 25500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

