export const casualReportService = {
    getCasualReportIncomeByDate, getCasualReportQuantityByDate
};

async function getCasualReportIncomeByDate(month, spot_id, vehicle_codes) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v2/mgmt/reports/casual/income?month=${month}&spot_id=${spot_id}&vehicle_codes=${vehicle_codes}`,{timeout :  500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function getCasualReportQuantityByDate(month, spot_id, vehicle_codes) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v2/mgmt/reports/casual/quantity?month=${month}&spot_id=${spot_id}&vehicle_codes=${vehicle_codes}`,{timeout :  500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}