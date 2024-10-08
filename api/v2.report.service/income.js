export const incomeReportService = {
    getIncomeReportByDate
};

async function getIncomeReportByDate(month, spot_id, vehicle_codes, type) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v2/mgmt/reports/income?month=${month}&spot_id=${spot_id}&vehicle_codes=${vehicle_codes}&type=${type}`, {timeout: 500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}