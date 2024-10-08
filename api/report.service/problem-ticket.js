import { helper } from "~/api/config/helper";

export const problemTicketReportService = {
  getProblemTicketReport
};

async function getProblemTicketReport(filter) {
  let axios = window.$nuxt.$axios
  return await axios.get(`/v1/mgmt/reports/problem-ticket?${helper(filter)}`, { timeout: 500500 }).then((data) => {
    if (data.status === 200) return data.data
  }).catch(error => {
    return Promise.reject(error);
  });
}