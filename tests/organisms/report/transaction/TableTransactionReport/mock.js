export const spotId = "xsxsxsxs-xsxs-xsxs-xsxsxsxsxsxs"

export const vehicleMap = {
  MT1: "Motor",
  MB1: "Mobil"
}

export const filterDefault = {
  date: "2023-03-03", time_range: { start: "00:00", end: "23:59" }, page: 1, per_page: 10,
  status: "", officer: "", vehicle: "", product: ""
}

export const payloadGetDefault = {
  filter: [
    { key: "date", value: "2023-03-03" },
    { key: "start", value: "00:00:00" },
    { key: "end", value: "23:59:59" },
    { key: "page", value: 1 },
    { key: "per_page", value: 10 },
    { key: "spot_id", value: spotId }
  ],
  opener: "/page",
}

export const filterWithStatus = {
  date: "2023-04-04", time_range: { start: "05:00", end: "12:00" }, page: 1, per_page: 10,
  status: { value: "P" }, officer: "", vehicle: "", product: ""
}

export const payloadGetWithStatus = {
  filter: [
    { key: "date", value: "2023-04-04" },
    { key: "start", value: "05:00:00" },
    { key: "end", value: "12:00:59" },
    { key: "page", value: 1 },
    { key: "per_page", value: 10 },
    { key: "spot_id", value: spotId },
    { key: "status", value: "P" }
  ],
  opener: "/page",
}

export const filterWithOfficer = {
  date: "2023-06-06", time_range: { start: "10:30", end: "20:59" }, page: 1, per_page: 10,
  status: "", officer: { value: "001" }, vehicle: "", product: ""
}

export const payloadGetWithOfficer = {
  filter: [
    { key: "date", value: "2023-06-06" },
    { key: "start", value: "10:30:00" },
    { key: "end", value: "20:59:59" },
    { key: "page", value: 1 },
    { key: "per_page", value: 10 },
    { key: "spot_id", value: spotId },
    { key: "officer_id", value: "001" }
  ],
  opener: "/page",
}

export const filterWithVehicle = {
  date: "2023-09-01", time_range: { start: "12:15", end: "18:59" }, page: 1, per_page: 10,
  status: "", officer: "", vehicle: [{ value: "MT1" }, { value: "MB1" }], product: ""
}

export const payloadGetWithVehicle = {
  filter: [
    { key: "date", value: "2023-09-01" },
    { key: "start", value: "12:15:00" },
    { key: "end", value: "18:59:59" },
    { key: "page", value: 1 },
    { key: "per_page", value: 10 },
    { key: "spot_id", value: spotId },
    { key: "vehicle_code", value: "MT1,MB1" }
  ],
  opener: "/page",
}

export const filterWithProduct = {
  date: "2023-05-05", time_range: { start: "20:30", end: "21:59" }, page: 1, per_page: 10,
  status: "", officer: "", vehicle: "", product: [{ value: "xxx1" }, { value: "xxx2" }]
}

export const payloadGetWithProduct = {
  filter: [
    { key: "date", value: "2023-05-05" },
    { key: "start", value: "20:30:00" },
    { key: "end", value: "21:59:59" },
    { key: "page", value: 1 },
    { key: "per_page", value: 10 },
    { key: "spot_id", value: spotId },
    { key: "product_id", value: "xxx1,xxx2" }
  ],
  opener: "/page",
}

export const dataGetReportEmpty = {
  rows: [],
  total: 0,
  last_sync: ""
}

export const dataGetReportFilled = {
  rows: [
    {
      "amount": 25000,
      "basement": false,
      "card_id": null,
      "cashback": 0,
      "created_at": "2023-07-04 03:05:40",
      "daily_membership_price": 0,
      "discount": 0,
      "emoney_card_id": null,
      "grace_period": false,
      "hs": "",
      "id": "4f897f5e-4fca-4db9-b1f9-a1d7949b93ac",
      "image_list": {
        "image_out_url": [],
        "image_url": [
          "https://spn-gate.s3-ap-southeast-1.amazonaws.com/captured/a58902cd-84e6-406c-96b9-5be0812e3bdd/20230704/4f897f5e-4fca-4db9-b1f9-a1d7949b93ac.jpg"
        ]
      },
      "prediction": {
        "lpr_in": {
          "accuracy": 0, 
          "license_color": null, 
          "license_plate": null, 
          "processed_time": 0, 
          "response_time": 0, 
          "vehicle": null
        }, 
        "lpr_out": {}
      },
      "image_out_url": "",
      "image_path": "captured/a58902cd-84e6-406c-96b9-5be0812e3bdd/20230704",
      "image_proof_url": "",
      "image_url": "https://spn-gate.s3-ap-southeast-1.amazonaws.com/captured/a58902cd-84e6-406c-96b9-5be0812e3bdd/20230704/4f897f5e-4fca-4db9-b1f9-a1d7949b93ac.jpg",
      "is_available_checkout": true,
      "is_claimed": false,
      "is_manless": true,
      "is_membership": false,
      "is_new_user": false,
      "is_offline": false,
      "is_request_check_out": false,
      "main_transaction": {},
      "membership_id": "",
      "notes": "",
      "overnight_price": 0,
      "paid_at": "",
      "paid_token": "",
      "parking_price": 5000,
      "payment_gateway": "",
      "payment_gateway_id": "",
      "payment_gateway_status": "",
      "payment_method": "",
      "point": 0,
      "pos_in": "",
      "pos_out": "",
      "price": 25000,
      "price_lock": 0,
      "process_time": 0,
      "product_detail": {},
      "reasons": "",
      "ref_detail": {
        "type": "FINDER",
        "values": {
          "created_at": "2023-07-04 07:11:26",
          "id": "178ae80a-1d36-48ba-bcd5-cbc62d81775b",
          "is_check_out": false,
          "location": {
            "code": "1A1",
            "name": "Modul 1\n Rak A\n Lantai 1"
          },
          "location_detail": {
            "created_at": "2023-06-07 08:20:07",
            "floor": 1,
            "id": "18bd1b6f-731e-45f9-898a-90c820556a85",
            "label": "A",
            "module": "1",
            "stock": 10,
            "tower_id": "5e9a2599-4051-4b8e-b8e9-3cb09ab7d0ba",
            "updated_at": "2023-06-07 08:20:07"
          },
          "location_id": "18bd1b6f-731e-45f9-898a-90c820556a85",
          "motorcycle_detail": {
            "created_at": "2021-08-16 06:12:59",
            "id": "59e769a2-2423-4b23-9bbe-e884c178657a",
            "license_plate": "MANLESS",
            "updated_at": "2021-08-16 06:12:59",
            "verification_status": "0"
          },
          "motorcycle_id": "59e769a2-2423-4b23-9bbe-e884c178657a",
          "officer_name": "",
          "prediction_hours": 0,
          "time_in": 1688454685872,
          "time_out": 0,
          "total_hours": 0,
          "transaction": null,
          "updated_at": "2023-07-04 07:11:26",
          "vehicle_code": "MT1",
          "vehicle_type": 0
        }
      },
      "ref_id": "178ae80a-1d36-48ba-bcd5-cbc62d81775b",
      "ref_type": "FINDER",
      "rf_id": "",
      "search_key": "4F897F",
      "services": [],
      "spot_detail": {},
      "spot_id": "a58902cd-84e6-406c-96b9-5be0812e3bdd",
      "status": "P",
      "time_in": 1688439940645,
      "time_out": 0,
      "total_amount": 25000,
      "total_hours": 12,
      "transaction_data": {
        "image": {
          "image_in_1": "4f897f5e-4fca-4db9-b1f9-a1d7949b93ac.jpg",
          "image_in_2": "",
          "image_out_1": "",
          "image_out_2": "",
          "image_path_1": "captured/a58902cd-84e6-406c-96b9-5be0812e3bdd/20230704",
          "image_path_2": "",
          "image_path_out_1": "",
          "image_path_out_2": ""
        }
      },
      "transaction_detail": [
        {
          "amount": 25000,
          "id": "4f897f5e-4fca-4db9-b1f9-a1d7949b93ac",
          "is_discount": false,
          "name": "Biaya Parkir",
          "parent": true,
          "price": 25000,
          "reason": "",
          "ref_id": "",
          "ref_type": "FINDER",
          "status": "P",
          "type": ""
        }
      ],
      "updated_at": "2023-07-04 07:11:36",
      "user_id": "92183b35-e297-43d8-ada4-a0c2591e3a62",
      "vehicle_code": "MT1"
    },
    {
      "amount": 25000,
      "basement": false,
      "card_id": null,
      "cashback": 0,
      "created_at": "2023-07-04 03:05:55",
      "daily_membership_price": 0,
      "discount": 0,
      "emoney_card_id": null,
      "grace_period": false,
      "hs": "",
      "id": "6d677868-3ffc-41dc-894b-fc95b6bd1481",
      "image_list": {
        "image_out_url": [],
        "image_url": [
          "https://spn-gate.s3-ap-southeast-1.amazonaws.com/captured/a58902cd-84e6-406c-96b9-5be0812e3bdd/20230704/6d677868-3ffc-41dc-894b-fc95b6bd1481.jpg"
        ]
      },
      "prediction": {
        "lpr_in": {
          "accuracy": 0, 
          "license_color": null, 
          "license_plate": null, 
          "processed_time": 0, 
          "response_time": 0, 
          "vehicle": null
        }, 
        "lpr_out": {}
      },
      "image_out_url": "",
      "image_path": "captured/a58902cd-84e6-406c-96b9-5be0812e3bdd/20230704",
      "image_proof_url": "",
      "image_url": "https://spn-gate.s3-ap-southeast-1.amazonaws.com/captured/a58902cd-84e6-406c-96b9-5be0812e3bdd/20230704/6d677868-3ffc-41dc-894b-fc95b6bd1481.jpg",
      "is_available_checkout": true,
      "is_claimed": false,
      "is_manless": true,
      "is_membership": false,
      "is_new_user": false,
      "is_offline": false,
      "is_request_check_out": false,
      "main_transaction": {},
      "membership_id": "",
      "notes": "",
      "overnight_price": 0,
      "paid_at": "",
      "paid_token": "",
      "parking_price": 5000,
      "payment_gateway": "",
      "payment_gateway_id": "",
      "payment_gateway_status": "",
      "payment_method": "",
      "point": 0,
      "pos_in": "",
      "pos_out": "",
      "price": 25000,
      "price_lock": 0,
      "process_time": 0,
      "product_detail": {},
      "reasons": "",
      "ref_detail": {
        "type": "FINDER",
        "values": {
          "created_at": "2023-07-04 07:11:40",
          "id": "71d789e9-61c9-4241-b839-ade4f490ce5d",
          "is_check_out": false,
          "location": {
            "code": "1A1",
            "name": "Modul 1\n Rak A\n Lantai 1"
          },
          "location_detail": {
            "created_at": "2023-06-07 08:20:07",
            "floor": 1,
            "id": "18bd1b6f-731e-45f9-898a-90c820556a85",
            "label": "A",
            "module": "1",
            "stock": 10,
            "tower_id": "5e9a2599-4051-4b8e-b8e9-3cb09ab7d0ba",
            "updated_at": "2023-06-07 08:20:07"
          },
          "location_id": "18bd1b6f-731e-45f9-898a-90c820556a85",
          "motorcycle_detail": {
            "created_at": "2021-08-16 06:12:59",
            "id": "59e769a2-2423-4b23-9bbe-e884c178657a",
            "license_plate": "MANLESS",
            "updated_at": "2021-08-16 06:12:59",
            "verification_status": "0"
          },
          "motorcycle_id": "59e769a2-2423-4b23-9bbe-e884c178657a",
          "officer_name": "",
          "prediction_hours": 0,
          "time_in": 1688454699940,
          "time_out": 0,
          "total_hours": 0,
          "transaction": null,
          "updated_at": "2023-07-04 07:11:40",
          "vehicle_code": "MT1",
          "vehicle_type": 0
        }
      },
      "ref_id": "71d789e9-61c9-4241-b839-ade4f490ce5d",
      "ref_type": "FINDER",
      "rf_id": "",
      "search_key": "6D6778",
      "services": [],
      "spot_detail": {},
      "spot_id": "a58902cd-84e6-406c-96b9-5be0812e3bdd",
      "status": "P",
      "time_in": 1688439954858,
      "time_out": 0,
      "total_amount": 25000,
      "total_hours": 12,
      "transaction_data": {
        "image": {
          "image_in_1": "6d677868-3ffc-41dc-894b-fc95b6bd1481.jpg",
          "image_in_2": "",
          "image_out_1": "",
          "image_out_2": "",
          "image_path_1": "captured/a58902cd-84e6-406c-96b9-5be0812e3bdd/20230704",
          "image_path_2": "",
          "image_path_out_1": "",
          "image_path_out_2": ""
        }
      },
      "transaction_detail": [
        {
          "amount": 25000,
          "id": "6d677868-3ffc-41dc-894b-fc95b6bd1481",
          "is_discount": false,
          "name": "Biaya Parkir",
          "parent": true,
          "price": 25000,
          "reason": "",
          "ref_id": "",
          "ref_type": "FINDER",
          "status": "P",
          "type": ""
        }
      ],
      "updated_at": "2023-07-04 07:11:50",
      "user_id": "92183b35-e297-43d8-ada4-a0c2591e3a62",
      "vehicle_code": "MT1"
    }
  ],
  total: 23,
  last_sync: "1688454146877"
}

export const reportFilled = [
  { "transaction_id": "4f897f5e-4fca-4db9-b1f9-a1d7949b93ac", "ref_id": "178ae80a-1d36-48ba-bcd5-cbc62d81775b", "license_plate": "MANLESS", "rf_id": "", "status": "Parkir", "time_in": "04/07/2023 10:05", "ref_time_in": "-", "time_out": "-", "ref_time_out": "-", "paid_at": "-", "product": "-", "officer_name": "-", "vehicle_code": "Motor", "amount": "25.000", "image_url": "https://spn-gate.s3-ap-southeast-1.amazonaws.com/captured/a58902cd-84e6-406c-96b9-5be0812e3bdd/20230704/4f897f5e-4fca-4db9-b1f9-a1d7949b93ac.jpg", "image_out_url": "", "image_list": { "image_out_url": [], "image_url": ["https://spn-gate.s3-ap-southeast-1.amazonaws.com/captured/a58902cd-84e6-406c-96b9-5be0812e3bdd/20230704/4f897f5e-4fca-4db9-b1f9-a1d7949b93ac.jpg"] } },
  { "transaction_id": "6d677868-3ffc-41dc-894b-fc95b6bd1481", "ref_id": "71d789e9-61c9-4241-b839-ade4f490ce5d", "license_plate": "MANLESS", "rf_id": "", "status": "Parkir", "time_in": "04/07/2023 10:05", "ref_time_in": "-", "time_out": "-", "ref_time_out": "-", "paid_at": "-", "product": "-", "officer_name": "-", "vehicle_code": "Motor", "amount": "25.000", "image_url": "https://spn-gate.s3-ap-southeast-1.amazonaws.com/captured/a58902cd-84e6-406c-96b9-5be0812e3bdd/20230704/6d677868-3ffc-41dc-894b-fc95b6bd1481.jpg", "image_out_url": "", "image_list": { "image_out_url": [], "image_url": ["https://spn-gate.s3-ap-southeast-1.amazonaws.com/captured/a58902cd-84e6-406c-96b9-5be0812e3bdd/20230704/6d677868-3ffc-41dc-894b-fc95b6bd1481.jpg"] } }
]

export const payloadDetailEmpty = {
  id: undefined,
  ref_id: undefined,
  image_list: {
    image_url: [""],
    image_out_url: [""]
  }
}

export const detailNoImage = {
  transaction_id: "xcxcxcxc-xcxc-xcxc-xcxcxcxcxcxc",
  ref_id: "xvxvxvxv-xvxv-xvxv-xvxvxvxvxvxv",
}

export const payloadDetailNoImage = {
  id: "xcxcxcxc-xcxc-xcxc-xcxcxcxcxcxc",
  ref_id: "xvxvxvxv-xvxv-xvxv-xvxvxvxvxvxv",
  image_list: {
    image_url: [""],
    image_out_url: [""]
  }
}

export const detailNoImageIn = {
  transaction_id: "xcxcxcxc-xcxc-xcxc-xcxcxcxcxcxc",
  ref_id: "xvxvxvxv-xvxv-xvxv-xvxvxvxvxvxv",
  image_list: {
    image_url: [],
    image_out_url: ["car_out1.png"]
  }
}

export const payloadDetailNoImageIn = {
  id: "xcxcxcxc-xcxc-xcxc-xcxcxcxcxcxc",
  ref_id: "xvxvxvxv-xvxv-xvxv-xvxvxvxvxvxv",
  image_list: {
    image_url: [""],
    image_out_url: ["car_out1.png"]
  }
}

export const detailNoImageOut = {
  transaction_id: "xcxcxcxc-xcxc-xcxc-xcxcxcxcxcxc",
  ref_id: "xvxvxvxv-xvxv-xvxv-xvxvxvxvxvxv",
  image_list: {
    image_url: ["car_in1.png"],
    image_out_url: []
  }
}

export const payloadDetailNoImageOut = {
  id: "xcxcxcxc-xcxc-xcxc-xcxcxcxcxcxc",
  ref_id: "xvxvxvxv-xvxv-xvxv-xvxvxvxvxvxv",
  image_list: {
    image_url: ["car_in1.png"],
    image_out_url: [""]
  }
}
