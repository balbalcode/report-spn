import { helper } from "~/api/config/helper";

export const attendanceReportService = {
  getAttendanceReport,
  getLeaveReport
};

async function getAttendanceReport(filter, pagination, order) {
  const axios = window.$nuxt.$axios
  return await axios.get(`/v1/mgmt/reports/attendance?${helper(filter, pagination, order)}`, { timeout: 500500 }).then((data) => {
    if (data.status === 200) return data.data
  }).catch(error => {
    return Promise.reject(error);
  });
}

async function getLeaveReport(filter) {
  const axios = window.$nuxt.$axios
  return await axios.get(`/v1/mgmt/reports/leave?${helper(filter)}`, { timeout: 500500 }).then((data) => {
    if (data.status === 200) return data.data
  }).catch(error => {
    return Promise.reject(error);
  });
}
