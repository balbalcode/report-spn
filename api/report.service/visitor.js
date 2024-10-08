export const visitorReportService = {
    getVisitorReportByDate
};


async function getVisitorReportByDate(date, spot_id) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v1/visitor?per_page=1000&date=${date}&spot_id=${spot_id}`, {timeout: 500500}).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}