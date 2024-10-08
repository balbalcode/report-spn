export const counterReportService = {
    getCounterReportByDate
};

async function getCounterReportByDate(month, spot_id, vehicle_codes) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v1/mgmt/reports/counter?month=${month}&spot_id=${spot_id}&vehicle_codes=${vehicle_codes}`, {timeout: 500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}
