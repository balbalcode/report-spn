export const incomeReportService = {
    getIncomeReport, getIncomeReportByDate
};

async function getIncomeReport(spot_id) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v1/mgmt/reports/income?spot_id=${spot_id}`,{timeout :  500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function getIncomeReportByDate(month, spot_id) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v1/mgmt/reports/income?month=${month}&spot_id=${spot_id}`,{timeout :  500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}