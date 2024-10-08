// this is a configuration for our axios
// to use this configuration in your service, we called it with axios = window.$nuxt.axios
// NB. window.$nuxt.$axios only work in client side
import jscookie from "js-cookie";

const unprotected = [
  "/login",
  "/logout",
  "/forgot",
  "/login/",
  "/logout/",
  "/forgot/",
  "/shettle",
  "/shettle/",
  "/shettle/process",
  "/shettle/process/",
];
let token = jscookie.get("token");
let refresh_token = jscookie.get("refresh_token");
let expired = jscookie.get("exp");
let error_response;
const apiAborter = new AbortController();
const signal = apiAborter.signal;

export default async function ({ app, store, route }) {
  if (unprotected.includes(route.path)) return true;
  async function checkExpiredToken() {
    try {
      expired = JSON.parse(expired);
      if (new Date().getTime() > expired.access_token) {
        const payload = {
          access_token: token,
          refresh_token: refresh_token,
        };
        const new_token = await store.dispatch(
          "modules/auth/storeAuth/refresh",
          payload
        );
        jscookie.set("token", new_token.values.access_token);
        jscookie.set("refresh_token", new_token.values.refresh_token);
        token = new_token.values.access_token;
        refresh_token = new_token.values.refresh_token;
      }
    } catch (error) {
      if (![undefined, "", null].includes(token)) {
        apiAborter.abort("access token was expired");
        window.location.href = "/logout?type=token";
      }
    }
  }

  await checkExpiredToken();

  app.$axios.defaults.baseURL = process.env.baseUrl;
  app.$axios.setHeader("accept-encoding", null);
  app.$axios.setHeader("Content-Type", "application/json");
  app.$axios.setHeader("Authorization", `Bearer ${token}`);

  app.$axios.onRequest((config) => {
    config.signal = signal;
    return config;
  });
  app.$axios.onError(async (error) => {
    if (typeof error.response !== "undefined") {
      // 401 error (this is only run after user has a token or has logged in)
      if (error.response.status === 401) {
        // setting fallback url
        jscookie.set("fallback_url", window.$nuxt.$route.path);
        jscookie.remove("token");

        // this condition will prevent set same message for next request.
        error_response = {
          response: {
            status: 401,
            data: {
              message: "Anda tidak memiliki akses untuk mengakses laman ini",
              values: "", 
            },
          },
        };
        apiAborter.abort("access token was expired");
        window.location.href = "/logout?type=token";
        throw error_response;
      } else {
        return Promise.reject(error);
      }
    } else {
      throw {
        response: {
          status: 500,
          data: {
            message: "Terdapat Gangguan Pada Server",
            values: "",
          },
        },
      };
    }
  });
}
