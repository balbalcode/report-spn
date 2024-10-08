import { helper } from "~/api/config/helper";

export const registrationService = {
  get,
  update,
};

async function get(payload) {
  let axios = window.$nuxt.$axios;
  return await axios
    .get(
      `/v1/mgmt/officer/approvals?${helper(
        payload.filter,
        payload.pagination
      )}`,
      { timeout: 25500 }
    )
    .then((data) => {
      if (data.status === 200) return data.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

async function update(id, data) {
  let axios = window.$nuxt.$axios;
  return await axios
    .put(`/v1/mgmt/officer/${id}/approval`, data, { timeout: 25500 })
    .then((data) => {
      if (data.status === 200) return data.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
