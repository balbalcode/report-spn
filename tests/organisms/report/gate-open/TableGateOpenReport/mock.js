export const spotId = "1x1x1x1x1x1x1x1x"

export const spotInfo = {
  text: "Parkiran Soul"
}

export const payloadGet = {
  filter: [
    { key: "spot_id", value: spotId },
    { key: "month", value: "2023-04" },
    { key: "page", value: 2 },
    { key: "per_page", value: 2 },
  ],
}

export const dataGetReport = {
  "data": [
    {
      "created_at": "2023-06-06 07:46:44",
      "gate_code": "gtin-HS-1",
      "gate_type": "checkin",
      "id": "058e1e71-69dd-485b-94fb-fafe4ec6bc9d",
      "image": "captured/982ef30a-0ec3-40b8-a966-7d9c5f2d9545/20230606/a3abcb97-566c-4570-bf4d-a72aa06b9dc2.jpg",
      "meta_data": {
        "additional_data": ""
      },
      "officer_id": "df19a95d-672d-4feb-8644-cdfa35857e96",
      "officer_name": "Once Mekel",
      "reason": "Gugug",
      "ref_id": "",
      "ref_type": "",
      "transaction_id": "a3abcb97-566c-4570-bf4d-a72aa06b9dc2",
      "updated_at": "2023-06-06 07:46:44"
    },
    {
      "created_at": "2023-06-06 06:07:00",
      "gate_code": "gtin-HS-1",
      "gate_type": "checkin",
      "id": "0fb42bd8-1a18-4211-a727-d7c4b2485505",
      "image": "captured/982ef30a-0ec3-40b8-a966-7d9c5f2d9545/20230606/5c82867a-5966-4f4b-bdc3-08bf586abb15.jpg",
      "meta_data": {
        "additional_data": ""
      },
      "officer_id": "df19a95d-672d-4feb-8644-cdfa35857e96",
      "officer_name": "Once Mekel",
      "reason": "Vnvjch",
      "ref_id": "",
      "ref_type": "",
      "transaction_id": "5c82867a-5966-4f4b-bdc3-08bf586abb15",
      "updated_at": "2023-06-06 06:07:00"
    }
  ],
  "total": 9
}

export const report = [
  { "date": "Jun 06 2023, 14.46", "gate_code": "gtin-HS-1", "officer_name": "Once Mekel", "reason": "Gugug", "image": "https://spn-gate.s3.ap-southeast-1.amazonaws.com/captured/982ef30a-0ec3-40b8-a966-7d9c5f2d9545/20230606/a3abcb97-566c-4570-bf4d-a72aa06b9dc2.jpg" },
  { "date": "Jun 06 2023, 13.07", "gate_code": "gtin-HS-1", "officer_name": "Once Mekel", "reason": "Vnvjch", "image": "https://spn-gate.s3.ap-southeast-1.amazonaws.com/captured/982ef30a-0ec3-40b8-a966-7d9c5f2d9545/20230606/5c82867a-5966-4f4b-bdc3-08bf586abb15.jpg" }
]

export const payloadReady = {
  name: "Laporan Palang Pintu Parkiran Soul Bulan 2023-04 (3 s.d. 4)",
  content: report,
  total_data: dataGetReport.total
}
