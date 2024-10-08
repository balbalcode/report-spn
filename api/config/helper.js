export function helper(filter, pagination, order) {
  let params = [];

  // its for destructing pagination object
  if (pagination) {
    if (pagination.current_page)
      params.push({ key: "page", value: pagination.current_page });
    if (pagination.per_page)
      params.push({ key: "per_page", value: pagination.per_page });
  }

  // its for destructing filter object
  // so the json will be translated to filter like this &JSONKEY=JSONVALUE
  if (filter && filter.length) {
    params = params.concat(filter);
  }

  if (order) {
    if (order.type) params.push({ key: "order", value: order.type });
    if (order.query) params.push({ key: "q", value: order.query });
  }

  return params.map((item) => `${item.key}=${item.value}`).join("&");
}
