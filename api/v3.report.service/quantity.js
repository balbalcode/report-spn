import { helper } from "../config/helper";

export const quantityReportService = {
  getQuantityReportByTransaction,
  getQuantityReportByPayment,
  getQuantityOverstayReport,
  getQuantityInOutReport,
};

async function getQuantityReportByTransaction(filter) {
  const axios = window.$nuxt.$axios;
  return await axios
    .get(`/v3/mgmt/reports/quantity/transaction?${helper(filter)}`, {
      timeout: 500500,
    })
    .then((data) => {
      if (data.status === 200) return data.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

async function getQuantityReportByPayment(filter) {
  const axios = window.$nuxt.$axios;
  return await axios
    .get(`/v3/mgmt/reports/quantity/payment?${helper(filter)}`, {
      timeout: 500500,
    })
    .then((data) => {
      if (data.status === 200) return data.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

async function getQuantityOverstayReport(filter) {
  const axios = window.$nuxt.$axios;
  return await axios
    .get(`/v3/mgmt/reports/quantity/overstay?${helper(filter)}`, {
      timeout: 500500,
    })
    .then((data) => {
      if (data.status === 200) return data.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

async function getQuantityInOutReport(filter, version) {
  const axios = window.$nuxt.$axios;
  return await axios
    // available version: v3, v4
    .get(`/${version}/mgmt/reports/quantity/in-out?${helper(filter)}`, {
      timeout: 500500,
    })
    .then((data) => {
      if (data.status === 200) return data.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
