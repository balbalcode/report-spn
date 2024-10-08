import { helper } from "~/api/config/helper";

export const leaveService = {
  update
};

async function update(id, data) {
  let axios = window.$nuxt.$axios
  return await axios.put(`/v1/mgmt/leave/${id}/approval`, data, { timeout: 25500 }).then((data) => {
    if (data.status === 200) return data.data
  }).catch(error => {
    return Promise.reject(error);
  });
}
