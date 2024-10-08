import { helper } from "~/api/config/helper"

export const gateOpenReportService = {
  getGateOpenReport
};

async function getGateOpenReport(filter) {
  let axios = window.$nuxt.$axios
  return await axios.get(`/v1/mgmt/reports/field_report?${helper(filter)}`, { timeout: 500500 }).then((data) => {
    if (data.status === 200) return data.data
  }).catch(error => {
    return Promise.reject(error);
  });
}
