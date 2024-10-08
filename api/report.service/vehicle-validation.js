import { helper } from "~/api/config/helper";

export const vehicleValidationReportService = {
  get, requestAll
};

async function get(filter, pagination, order) {
  const axios = window.$nuxt.$axios
  return await axios.get(`/v1/mgmt/reports/vehicle-validation?${helper(filter, pagination, order)}`, { timeout: 500500 }).then((data) => {
    if (data.status === 200) return data.data
  }).catch(error => {
    return Promise.reject(error);
  });
}

async function requestAll(data) {
  const axios = window.$nuxt.$axios
  return await axios.post(`/v1/mgmt/reports/vehicle-validation/download`, data, { timeout: 500500 }).then((data) => {
    if (data.status === 200) return data.data
  }).catch(error => {
    return Promise.reject(error);
  });
}
