import { helper } from "~/api/config/helper";

export const masterProductService = {
    get,
    show,
    create,
    update,
    remove,
    setDefault,
    setStatus,
    getRelated
};

async function get(filter, pagination, order) {
    let axios = window.$nuxt.$axios
    return axios.get(`/v1/mgmt/master-product?${helper(filter, pagination, order)}`, { timeout: 25500 }).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function show(id) {
    let axios = window.$nuxt.$axios
    return axios.get(`/v1/mgmt/master-product/${id}`, { timeout: 25500 }).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function create(data) {
    let axios = window.$nuxt.$axios
    return axios.post(`/v1/mgmt/master-product`, data, { timeout: 25500 }).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function update(id, data) {
    let axios = window.$nuxt.$axios
    delete data.id
    return axios.put(`/v1/mgmt/master-product/${id}`, data, { timeout: 25500 }).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function remove(id) {
    let axios = window.$nuxt.$axios
    return axios.delete(`/v1/mgmt/master-product/${id}`, { timeout: 25500 }).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function setDefault(id) {
    let axios = window.$nuxt.$axios
    return axios.post(`/v1/mgmt/master-product/${id}/activation`, { timeout: 25500 }).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function setStatus(id, payload) {
    let axios = window.$nuxt.$axios
    return axios.put(`/v1/mgmt/master-product/${id}/status`, payload, { timeout: 25500 }).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function getRelated(id) {
    let axios = window.$nuxt.$axios
    return axios.get(`/v1/mgmt/master-product/${id}/related`, { timeout: 25500 }).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}