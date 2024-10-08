export const shiftReportService = {
    getShiftReportByDate, getAdminShiftReportByDate, getAdminShiftDetailReportByDate
};

async function getShiftReportByDate(month, spot_id, vehicle_codes, type) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v1/mgmt/reports/shift?month=${month}&spot_id=${spot_id}&vehicle_codes=${vehicle_codes}&type=${type}`, {timeout: 500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function getAdminShiftReportByDate(date, spot_id) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v1/mgmt/reports-admin/shift?date=${date}&spot_id=${spot_id}`, {timeout: 500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function getAdminShiftDetailReportByDate(date, spot_id) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v1/mgmt/reports-admin/shift-detail?date=${date}&spot_id=${spot_id}`, {timeout: 500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}