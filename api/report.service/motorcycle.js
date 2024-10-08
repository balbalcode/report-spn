export const motorcycleReportService = {
    getMotorcycleReport, getMotorcycleReportByDate
};

async function getMotorcycleReport(spot_id) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v1/mgmt/reports/quantity?spot_id=${spot_id}`,{timeout :  500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function getMotorcycleReportByDate(month, spot_id) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v1/mgmt/reports/quantity?month=${month}&spot_id=${spot_id}`,{timeout :  500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}