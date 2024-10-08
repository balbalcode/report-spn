import cookies from "js-cookie";

export function authHeader() {
  let token = cookies.get("token");

  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
}
