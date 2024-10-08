import { helper } from "~/api/config/helper";

export const spotsService = {
    get,
    getList,
    create,
    update,
    show
};

function get(page = 1, q = "", order = "desc", per_page = 10) {
    let axios = window.$nuxt.$axios
    return axios.get(`/v1/mgmt/spots?per_page=${per_page}&page=${page}&q=${q}&order=${order}`, {timeout: 25500}).then((data) => {
       if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function getList(filter) {
    let axios = window.$nuxt.$axios;
    return await axios
        .get(`/v1/spot?${helper(filter)}`, { timeout: 25500 })
        .then((data) => {
            if (data.status === 200) return data.data;
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

function create(data) {
    let axios = window.$nuxt.$axios
    return axios.post(`/v1/spot`, data, {timeout: 65500}).then((data) => {
       if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

function update(id, data) {
    let axios = window.$nuxt.$axios
    return axios.put(`/v1/spot/${id}`, data, {timeout: 25500}).then((data) => {
       if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

function show(id) {
    let axios = window.$nuxt.$axios
    return axios.get(`/v1/spot/${id}`, {timeout: 25500}).then((data) => {
       if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}