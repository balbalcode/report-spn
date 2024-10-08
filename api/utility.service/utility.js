export const utilityService = {
    get,
};

async function get(type) {
    let axios = window.$nuxt.$axios
    return axios.get(`/v1/setting/version?type=${type}`).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error.response.data.message);
    });

}
