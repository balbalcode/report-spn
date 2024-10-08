export const dailyReportService = {
    getDailyReportByDate, getDailyStatsByDate
};

async function getDailyStatsByDate(date, spot_id) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v1/mgmt/reports/daily-stats?date=${date}&spot_id=${spot_id}`,{timeout :  500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function getDailyReportByDate(date, spot_id) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v1/mgmt/reports/daily-analytics?date=${date}&spot_id=${spot_id}`,{timeout :  500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}