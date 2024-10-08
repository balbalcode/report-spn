export const cashlessReportService = {
    getCashlessReportIncomeByDate, getCashlessReportQuantityByDate, getCashlessReportIncomeByShift
};

async function getCashlessReportIncomeByDate(month, spot_id, vehicle_codes) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v2/mgmt/reports/cashless/income?month=${month}&spot_id=${spot_id}&vehicle_codes=${vehicle_codes}`, {timeout :  500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function getCashlessReportQuantityByDate(month, spot_id, vehicle_codes) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v2/mgmt/reports/cashless/quantity?month=${month}&spot_id=${spot_id}&vehicle_codes=${vehicle_codes}`,{timeout :  500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function getCashlessReportIncomeByShift(month, spot_id, vehicle_codes) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v2/mgmt/reports/shift/cashless/income?month=${month}&spot_id=${spot_id}&vehicle_codes=${vehicle_codes}`,{timeout :  500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}