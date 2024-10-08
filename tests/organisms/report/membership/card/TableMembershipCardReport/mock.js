export const spotId = "xxx-xxx-xxx-xxx";

export const dataGet = {
  rows: [
    {
      amount: 100000,
      card_type: null,
      date: "Apr-02",
      employee_name: "buk sumarni",
      identification_number: "",
      license_plate: "B123SPNDFF",
      mgmt_user_id: "c75dxxxx-ac4e-xxxx-b5eb-xxxxf9fexxxx",
      mgmt_user_name: "Superadmin Boss",
      mgmt_user_type: "S",
      mgmt_user_username: "superrr@mail.id",
      new_member: "v",
      old_member: "-",
      paid_date: "02-04-2024 12:23:42",
      payment_method: "VA BCA",
      payment_receipt: "",
      payment_receipt_path: "",
      period: "April",
      printed_id: "696969",
      product_name: "Mobil 1 Tahun",
      product_price: 100000,
      reference: "",
      rf_id: "123123123",
      second_license_plate: null,
      timezone: "Asia/Jakarta",
      user_phone_number: "035546866699",
    },
    {
      amount: 250000,
      card_type: null,
      date: "Apr-05",
      employee_name: "pak jumadi",
      identification_number: "",
      license_plate: "B123DELETE",
      mgmt_user_id: "e87oxxxx-swf5-xxxx-90fa-xxxx96b1xxxx",
      mgmt_user_name: "Admin Boss",
      mgmt_user_type: "A",
      mgmt_user_username: "adminnn@mail.id",
      new_member: "v",
      old_member: "-",
      paid_date: "05-04-2024 09:11:03",
      payment_method: "VA BCA",
      payment_receipt: "https://via.placeholder.com/mgmt/test",
      payment_receipt_path: "mgmt/test",
      period: "April",
      printed_id: "898989",
      product_name: "Member 3 bulan",
      product_price: 250000,
      reference: "",
      rf_id: "123123123",
      second_license_plate: null,
      timezone: "Asia/Jakarta",
      user_phone_number: "075546848899",
    },
  ],
  total: {
    amount: 350000,
  },
};

export const payloadParent = {
  content: [...dataGet.rows, { date: "Total", amount: 350000 }],
};

export const payloadGetBasic = {
  filter: [
    { key: "spot_id", value: spotId },
    { key: "month", value: "2024-04" },
    { key: "type", value: "NOT_CASHIER" },
    { key: "status", value: "true" },
  ],
};

export const payloadGetWithMonth = {
  filter: [
    { key: "spot_id", value: spotId },
    { key: "month", value: "2024-02" },
    { key: "type", value: "NOT_CASHIER" },
    { key: "status", value: "true" },
  ],
};

export const selectedProductAll = [
  { text: "Membership 1 bulan", value: "1x1x-1x1x" },
  { text: "Membership 3 bulan", value: "3x3x-3x3x" },
  { text: "Seluruh Membership", value: "ALL_MEMBER" },
];

export const selectedProduct = [
  { text: "Membership 1 bulan", value: "1x1x-1x1x" },
  { text: "Membership 3 bulan", value: "3x3x-3x3x" },
];

export const strProductList = "1x1x-1x1x,3x3x-3x3x";

export const payloadGetWithProduct = {
  filter: [
    { key: "spot_id", value: spotId },
    { key: "month", value: "2024-04" },
    { key: "type", value: "NOT_CASHIER" },
    { key: "status", value: "true" },
    { key: "product_id", value: strProductList },
  ],
};

export const payloadGetWithAllProduct = {
  filter: [
    { key: "spot_id", value: spotId },
    { key: "month", value: "2024-04", },
    { key: "type", value: "NOT_CASHIER" },
    { key: "status", value: "true" },
    { key: "product_id", value: "" },
  ],
}

export const selectedUser = [
  { name: "Superadmin Boss", id: "1x1x-1x1x-vvvv" },
  { name: "Admin Boss", id: "3x3x-3x3x-vvvv" },
];

export const strUserList = "1x1x-1x1x-vvvv,3x3x-3x3x-vvvv";

export const payloadGetWithUser = {
  filter: [
    { key: "spot_id", value: spotId },
    { key: "month", value: "2024-04" },
    { key: "type", value: "NOT_CASHIER" },
    { key: "status", value: "true" },
    { key: "mgmt_user_id", value: strUserList },
  ],
}
