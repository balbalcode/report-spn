export const paymentListService = {
    get,
};

async function get() {
    let axios = window.$nuxt.$axios
    return axios.get(`/v1/master/payment-method-list`, {timeout: 25500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error.response);
    });
}