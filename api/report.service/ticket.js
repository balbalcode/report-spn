import { helper } from "~/api/config/helper"

export const ticketReportService = {
    getTicketReportByDate
};

async function getTicketReportByDate(filter) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v1/mgmt/reports/ticket?${helper(filter)}`, { timeout: 500500 }).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}