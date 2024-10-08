export const additionalService = {
    get
};

async function get(spot_id) {
    let axios = window.$nuxt.$axios
    return axios.get(`/v1/spot/${spot_id}/service`, {timeout: 25500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}
