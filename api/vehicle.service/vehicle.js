export const vehicleService = {
    get,
    show,
    create,
    action,
    update,
    remove,
};

async function get(spot_id) {
    let axios = window.$nuxt.$axios
    return axios.get(`/v1/spot/${spot_id}/vehicles`, {timeout: 25500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });

}

async function show(id, spot_id) {
    let axios = window.$nuxt.$axios
    return axios.get(`/v1/spot/${spot_id}/vehicles/${id}`, {timeout: 25500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function action(spot_id, data) {
    let axios = window.$nuxt.$axios
    return axios.post(`/v1/spot/${spot_id}/vehicles`, data, {timeout: 25500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function create(spot_id, data) {
    let axios = window.$nuxt.$axios
    return axios.post(`/v1/spot/${spot_id}/vehicles`, data, {timeout: 25500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function update(id, spot_id, data) {
    let axios = window.$nuxt.$axios
    delete data.id
    return axios.put(`/v1/spot/${spot_id}/vehicles`, data, {timeout: 25500}).then((data) => {
        return data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function remove(spot_id) {
    let axios = window.$nuxt.$axios
    return axios.delete(`/v1/spot/${spot_id}/vehicles/`, {timeout: 25500}).then((data) => {
        return data
    }).catch(error => {
        return Promise.reject(error);
    });
}
