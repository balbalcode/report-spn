export const additionalReportService = {
    getAdditionalReportByDate
};

async function getAdditionalReportByDate(month, spot_id, service) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v1/mgmt/reports/additional?month=${month}&spot_id=${spot_id}&service=${service}`, {timeout: 500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}



