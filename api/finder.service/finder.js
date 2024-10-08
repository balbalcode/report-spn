export const finderService = {
    getLogs
};

async function getLogs(finder_id) {
    let axios = window.$nuxt.$axios
    return axios.get(`/v1/finder/${finder_id}/logs`,{timeout: 25500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error.response);
    });
}