export const cashlessReportService = {
    getCashlessReportIncome, getCashlessReportIncomeByDate, getCashlessReportQuantity, getCashlessReportQuantityByDate
};

async function getCashlessReportIncome(spot_id) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v1/mgmt/reports/cashless/income?spot_id=${spot_id}`,{timeout :  500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function getCashlessReportIncomeByDate(month, spot_id) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v1/mgmt/reports/cashless/income?month=${month}&spot_id=${spot_id}`, {timeout :  500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function getCashlessReportQuantity(spot_id) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v1/mgmt/reports/cashless/quantity?spot_id=${spot_id}`,{timeout :  500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function getCashlessReportQuantityByDate(month, spot_id) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v1/mgmt/reports/cashless/quantity?month=${month}&spot_id=${spot_id}`,{timeout :  500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}