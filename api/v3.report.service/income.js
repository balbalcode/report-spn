import { helper } from "../config/helper";

export const incomeReportService = {
  getIncomeReportByTransaction,
  getIncomeReportByPayment,
  getIncomeOverstayReport,
  getIncomeReportByOfficer
};

async function getIncomeReportByTransaction(filter) {
  const axios = window.$nuxt.$axios
  return await axios.get(`/v3/mgmt/reports/income/transaction?${helper(filter)}`, { timeout: 500500 }).then((data) => {
    if (data.status === 200) return data.data
  }).catch(error => {
    return Promise.reject(error);
  });
}

async function getIncomeReportByPayment(filter) {
  const axios = window.$nuxt.$axios
  return await axios.get(`/v3/mgmt/reports/income/payment?${helper(filter)}`, { timeout: 500500 }).then((data) => {
    if (data.status === 200) return data.data
  }).catch(error => {
    return Promise.reject(error);
  });
}

async function getIncomeOverstayReport(filter) {
  const axios = window.$nuxt.$axios
  return await axios.get(`/v3/mgmt/reports/income/overstay?${helper(filter)}`, { timeout: 500500 }).then((data) => {
    if (data.status === 200) return data.data
  }).catch(error => {
    return Promise.reject(error);
  });
}

async function getIncomeReportByOfficer(filter, version) {
  const axios = window.$nuxt.$axios
  // available version: v3, v4
  return await axios.get(`/${version}/mgmt/reports/income/officer?${helper(filter)}`, { timeout: 500500 }).then((data) => {
    if (data.status === 200) return data.data
  }).catch(error => {
    return Promise.reject(error);
  });
}