
import { helper } from "~/api/config/helper";

export const officerService = {
    get,
    show,
    update,
    invite,
    kick,
    renewPin,
    remove,
    create
};

async function get(filter, pagination, order) {
  let axios = window.$nuxt.$axios;
  return await axios
    .get(`/v1/officer?${helper(filter, pagination, order)}`, { timeout: 25500 })
    .then((data) => {
      if (data.status === 200) return data.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

async function create(data) {
  let axios = window.$nuxt.$axios;
  return await axios
    .post(`/v1/officer`, data, { timeout: 25500 })
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
    .put(`/v1/officer/${id}`, data, { timeout: 25500 })
    .then((data) => {
      if (data.status === 200) return data.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

async function renewPin(id, data) {
  let axios = window.$nuxt.$axios;
  return await axios
    .put(`/v1/officer/${id}/pin`, data, { timeout: 25500 })
    .then((data) => {
      if (data.status === 200) return data.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

async function invite(spot_id, data) {
  let axios = window.$nuxt.$axios;
  return await axios
    .post(`/v1/spot/${spot_id}/officer`, data, { timeout: 25500 })
    .then((data) => {
      if (data.status === 200) return data.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

async function kick(spot_id, officer_id) {
  let axios = window.$nuxt.$axios;
  return await axios
    .delete(`/v1/spot/${spot_id}/officer/${officer_id}`, { timeout: 25500 })
    .then((data) => {
      if (data.status === 200) return data.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

async function show(id) {
  let axios = window.$nuxt.$axios;
  return await axios
    .get(`/v1/officer/${id}`, { timeout: 25500 })
    .then((data) => {
      if (data.status === 200) return data.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

async function remove(id) {
  let axios = window.$nuxt.$axios;
  return await axios
    .delete(`/v1/officer/${id}`, { timeout: 25500 })
    .then((data) => {
      if (data.status === 200) return data.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
