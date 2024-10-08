const return_report_card = {
  message: "",
  values: {
    rows: [
      {
        date: "Nov-23",
        name: "Balbal",
        identification_number: "xxx",
        type: "DELETE_MEMBERSHIP_HISTORY",
        email: "iam@balbal.my.id",
        motorcycle: [],
        card: {
          license_plate: "B1SPN",
          second_license_plate: "B2SPN",
          rf_id: "1234",
          card_id: "2017",
          start: "1669074762714",
          end: "1669174762714",
          created_at: "2022-11-22 03:53:43",
          product_detail: {
            name: "MEMBERSHIP ASIX",
            vehicle_detail: {
              name: "Motor Kecil",
              code: "MT1",
              alias: "MT",
            },
          },
        },
        mgmt_user_detail: {
          email: "iqbal@soulparking.co.id",
          name: "iqbal",
        },
        message: '{"note":"","reason":""}',
      },
    ],
    total: {
      amount: 0,
    },
  },
};

const formatted_report_card = [
  {
    date: "Nov-23",
    name: "Balbal",
    identification_number: "xxx",
    type: "DELETE_MEMBERSHIP_HISTORY",
    email: "iam@balbal.my.id",
    license_plate: "B1SPN",
    second_license_plate: "B2SPN",
    rf_id: "1234",
    card_id: "2017",
    start: "1669074762714",
    created_at: "2022-11-22 03:53:43",
    end: "1669174762714",
    product_name: "MEMBERSHIP ASIX",
    vehicle_name: "Motor Kecil",
    user: "iqbal",
    note: "",
  },
];

const return_report_plate = {
  message: "",
  values: {
    rows: [
      {
        date: "Nov-23",
        name: "Balbal",
        type: "DELETE_MEMBERSHIP_HISTORY",
        identification_number: "xxx",
        email: "iam@balbal.my.id",
        motorcycle: [
          {
            license_plate: "B1SPN",
            start: "1669074762714",
            created_at: "2022-11-22 03:53:43",
            end: "1669174762714",
            product_detail: {
              name: "MEMBERSHIP ASIX",
              vehicle_detail: {
                name: "Motor Kecil",
                code: "MT1",
                alias: "MT",
              },
            },
          },
        ],
        card: {},
        mgmt_user_detail: {
          email: "iqbal@soulparking.co.id",
          name: "iqbal",
        },
        message: '{"note":"","reason":""}',
      },
    ],
    total: {
      amount: 0,
    },
  },
};

const formatted_report_plate = [
  {
    date: "Nov-23",
    name: "Balbal",
    identification_number: "xxx",
    type: "DELETE_MEMBERSHIP_HISTORY",
    email: "iam@balbal.my.id",
    license_plate: "B11SPN",
    start: "1669074762714",
    created_at: "2022-11-22 03:53:43",
    end: "1669174762714",
    license_plate: "B1SPN",
    product_name: "MEMBERSHIP ASIX",
    vehicle_name: "Motor Kecil",
    user: "iqbal",
    note: "",
  },
];

export { return_report_card, return_report_plate, formatted_report_card, formatted_report_plate };
