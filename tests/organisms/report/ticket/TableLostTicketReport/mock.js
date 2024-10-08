export const getReport = {
  "rows": [
    {
      "created_at": "2023-10-11 03:06:28",
      "description": "",
      "eta": 0,
      "fine": 0,
      "id": "90e2bbfb-5b1a-4f36-9690-7efa703735e1",
      "license_plate": "NAKAKAN",
      "mgmt_user_detail": {},
      "mgmt_user_id": "",
      "mgmt_user_name": "",
      "officer_detail": {
        "name": "PIERCE THE VEIL",
      },
      "officer_id": "e967ba17-7059-4991-9d0d-a89ae98c97c2",
      "officer_name": "PIERCE THE VEIL",
      "overnight_price": 0,
      "parking_price": 15,
      "photo_url": "https://spn-gate.s3-ap-southeast-1.amazonaws.com/ticket/a58902cd-84e6-406c-96b9-5be0812e3bdd/2023101120231011_1006184804345390949784408.jpg",
      "price": 0,
      "search_key": "",
      "spot_detail": {},
      "spot_id": "a58902cd-84e6-406c-96b9-5be0812e3bdd",
      "spot_name": "Head Office (Testing)",
      "status": "NONE",
      "stnk_number": "",
      "total_hours": 24,
      "total_price": 15,
      "transaction_detail": {
        "time_in": 1696907170584,
        "time_out": 1696993564132,
        "vehicle_code": "MB1"
      },
      "transaction_id": "3d450922-15af-4821-b4ba-ce6ec827338d",
      "type": "PRICE_FINE",
      "updated_at": "2023-10-11 03:06:28"
    },
    {
      "created_at": "2023-10-09 04:19:51",
      "description": "",
      "eta": 0,
      "fine": 10,
      "id": "fa7db924-a3ce-406f-80b7-6ba10ffdd5bf",
      "license_plate": "sadasd",
      "mgmt_user_detail": {},
      "mgmt_user_id": "",
      "mgmt_user_name": "",
      "officer_detail": {
        "name": "fajar mengtest",
      },
      "officer_id": "8c297eb6-5b55-4b46-a664-52b0a1e12930",
      "officer_name": "fajar mengtest",
      "overnight_price": 1,
      "parking_price": 10,
      "photo_url": "",
      "price": 0,
      "search_key": "",
      "spot_id": "a58902cd-84e6-406c-96b9-5be0812e3bdd",
      "spot_name": "Head Office (Testing)",
      "status": "NONE",
      "stnk_number": "sdw12321321312",
      "total_hours": 25,
      "total_price": 21,
      "transaction_detail": {
        "time_in": 1696738740000,
        "time_out": 1696825154000,
        "vehicle_code": "MB1"
      },
      "transaction_id": "6fa21027-d501-44bd-ad6e-a1a360b6df16",
      "type": "PRICE_FINE",
      "updated_at": "2023-10-09 04:19:51"
    }
  ],
  "total": {
    "cashier": "",
    "date": "",
    "date_in": "",
    "fine": 44,
    "hours": "",
    "hours_in": "",
    "license_motorcycle": "",
    "license_plate": "",
    "mgmt_user_name": "",
    "overnight_price": 3,
    "parking_price": 212,
    "status": "",
    "total_price": 315
  }
}

export const formattedContentReport = [
  {
    "id": "90e2bbfb-5b1a-4f36-9690-7efa703735e1",
    "transaction_id": "3d450922-15af-4821-b4ba-ce6ec827338d",
    "license_plate": "NAKAKAN",
    "time_in": "10/10/2023 10:06:10",
    "time_out": "11/10/2023 10:06:04",
    "total_hours": "1 Hari",
    "submitter": "Aplikasi Kasir",
    "stnk_number": "-",
    "photo_url": "https://spn-gate.s3-ap-southeast-1.amazonaws.com/ticket/a58902cd-84e6-406c-96b9-5be0812e3bdd/2023101120231011_1006184804345390949784408.jpg",
    "vehicle_code": "Mobil",
    "fine_type": "Denda + tarif casual",
    "officer_name": "PIERCE THE VEIL",
    "parking_price": "15",
    "overnight_price": "0",
    "fine": "0",
    "total_price": "15"
  },
  {
    "id": "fa7db924-a3ce-406f-80b7-6ba10ffdd5bf",
    "transaction_id": "6fa21027-d501-44bd-ad6e-a1a360b6df16",
    "license_plate": "SADASD",
    "time_in": "08/10/2023 11:19:00",
    "time_out": "09/10/2023 11:19:14",
    "total_hours": "1 Hari 1 Jam",
    "submitter": "Kasir",
    "stnk_number": "sdw12321321312",
    "photo_url": "",
    "vehicle_code": "Mobil",
    "fine_type": "Denda + tarif casual",
    "officer_name": "fajar mengtest",
    "parking_price": "10",
    "overnight_price": "1",
    "fine": "10",
    "total_price": "21"
  }
]

export const formattedTotalReport = {
  "transaction_id": "Total",
  "parking_price": "212",
  "fine": "44",
  "overnight_price": "3",
  "total_price": "315"
}

export const vehicleMap = {
  MT1: "Motor",
  MB1: "Mobil"
}

export const spotId = "qqqq-wwww-eeee-rrrr"

export const payloadGetBasic = {
  filter: [
    { key: "month", value: "2023-09" },
    { key: "spot_id", value: "qqqq-wwww-eeee-rrrr" },
    { key: "status", value: "all" },
    { key: "page", value: 1 },
    { key: "per_page", value: 10 }
]
}

export const payloadGetWithOfficer = {
  filter: [
    { key: "month", value: "2023-09" },
    { key: "spot_id", value: "qqqq-wwww-eeee-rrrr" },
    { key: "status", value: "all" },
    { key: "page", value: 1 },
    { key: "per_page", value: 10 },
    { key: "officer_id", value: "ffff-gggg-hhhh-jjjj,abc" }
  ]
}
