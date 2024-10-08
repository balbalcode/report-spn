import {helper} from "~/api/config/helper"

export const transactionReportService = {
  getTransactionReport, requestTransactionReport
};

async function getTransactionReport(filter) {
  const axios = window.$nuxt.$axios
  return await axios.get(`/v1/mgmt/reports/transaction?${helper(filter)}`, {timeout: 500500}).then((data) => {
      if (data.status === 200) return data.data
  }).catch(error => {
      return Promise.reject(error);
  });
}

async function requestTransactionReport(payload) {
  const axios = window.$nuxt.$axios
  return await axios.post(`/v1/mgmt/reports/transaction/download`, payload, {timeout: 120500}).then((data) => {
      if (data.status === 200) return data.data
  }).catch(error => {
      return Promise.reject(error);
  });
}