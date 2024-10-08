export const casualReportService = {
    getCasualReportIncome, getCasualReportIncomeByDate, getCasualReportQuantity, getCasualReportQuantityByDate
};

async function getCasualReportIncome(spot_id) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v1/mgmt/reports/casual/income?spot_id=${spot_id}`,{timeout :  500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function getCasualReportIncomeByDate(month, spot_id) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v1/mgmt/reports/casual/income?month=${month}&spot_id=${spot_id}`,{timeout :  500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function getCasualReportQuantity(spot_id) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v1/mgmt/reports/casual/quantity?spot_id=${spot_id}`,{timeout :  500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function getCasualReportQuantityByDate(month, spot_id) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v1/mgmt/reports/casual/quantity?month=${month}&spot_id=${spot_id}`,{timeout :  500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}