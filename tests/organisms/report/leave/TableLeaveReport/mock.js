export const getReport = {
  "message": "",
  "total_values": 100,
  "values": [
    {
      "id": "xx-1",
      "officer_id": "zz-1",
      "officer_name": "Howard",
      "leave_type": "SICK",
      "leave_reason": "",
      "leave_start": "03 Nov 2023",
      "leave_end": "03 Nov 2023",
      "leave_days": "1",
      "letter_image": "https://via.placeholder.com/256x176?text=Surat+izin+petugas",
      "status": "0_PENDING",
      "mgmt_user_detail": {}
    },
    {
      "id": "xx-2",
      "officer_id": "zz-2",
      "officer_name": "Sheldon",
      "leave_type": "LEAVE",
      "leave_reason": "WEDDING",
      "leave_start": "20 Feb 2024",
      "leave_end": "22 Feb 2024",
      "leave_days": "3",
      "letter_image": "",
      "status": "1_APPROVED",
      "mgmt_user_detail": {
        "name": "Agung Suragung",
        "id": "ww-2"
      }
    },
    {
      "id": "xx-1",
      "officer_id": "zz-1",
      "officer_name": "Howard",
      "leave_type": "SICK",
      "leave_reason": "",
      "leave_start": "12 Mar 2024",
      "leave_end": "13 Mar 2024",
      "leave_days": "2",
      "letter_image": "https://via.placeholder.com/256x176?text=Surat+izin+petugas",
      "status": "2_REJECTED",
      "mgmt_user_detail": {
        "name": "Ujang Surajang",
        "id": "ww-1"
      }
    }
  ]
}

export const formattedData = [
  {
    "id": "xx-1",
    "officer_id": "zz-1",
    "officer_name": "Howard",
    "leave_type": "SICK",
    "leave_reason": "",
    "leave_start": "03 Nov 2023",
    "leave_end": "03 Nov 2023",
    "leave_days": "1",
    "letter_image": "https://via.placeholder.com/256x176?text=Surat+izin+petugas",
    "status": "0_PENDING",
    "mgmt_user_detail": {},
    "leave_range_date": "03 Nov 2023 - 03 Nov 2023",
    "leave_type_text": "Sakit",
    "leave_reason_text": "-",
    "status_text": "Menunggu",
    "status_variant": "primary",
    "checker": "-"
  }, {
    "id": "xx-2",
    "officer_id": "zz-2",
    "officer_name": "Sheldon",
    "leave_type": "LEAVE",
    "leave_reason": "WEDDING",
    "leave_start": "20 Feb 2024",
    "leave_end": "22 Feb 2024",
    "leave_days": "3",
    "letter_image": "",
    "status": "1_APPROVED",
    "mgmt_user_detail": {
      "name": "Agung Suragung",
      "id": "ww-2"
    },
    "leave_range_date": "20 Feb 2024 - 22 Feb 2024",
    "leave_type_text": "Cuti",
    "leave_reason_text": "Menikah",
    "status_text": "Disetujui",
    "status_variant": "success",
    "checker": "Agung Suragung"
  }, {
    "id": "xx-1",
    "officer_id": "zz-1",
    "officer_name": "Howard",
    "leave_type": "SICK",
    "leave_reason": "",
    "leave_start": "12 Mar 2024",
    "leave_end": "13 Mar 2024",
    "leave_days": "2",
    "letter_image": "https://via.placeholder.com/256x176?text=Surat+izin+petugas",
    "status": "2_REJECTED",
    "mgmt_user_detail": {
      "name": "Ujang Surajang",
      "id": "ww-1"
    },
    "leave_range_date": "12 Mar 2024 - 13 Mar 2024",
    "leave_type_text": "Sakit",
    "leave_reason_text": "-",
    "status_text": "Ditolak",
    "status_variant": "danger",
    "checker": "Ujang Surajang"
  }
]

export const spotId = "hahahahihihi"

export const payloadGetBasic = {
  filter: [
    { key: "spot_id", value: spotId },
    { key: "month", value: "2023-08" },
    { key: "page", value: 1 },
    { key: "per_page", value: 10 },
  ],
}

export const payloadGetWithOfficer = {
  filter: [
    { key: "spot_id", value: spotId },
    { key: "month", value: "2023-08" },
    { key: "page", value: 1 },
    { key: "per_page", value: 10 },
    { key: "officer_id", value: "xx1-xx2-xx3-xx4" }
  ],
}

export const payloadGetWithLeaveType = {
  filter: [
    { key: "spot_id", value: spotId },
    { key: "month", value: "2023-08" },
    { key: "page", value: 1 },
    { key: "per_page", value: 10 },
    { key: "leave_type", value: "PERMISSION,SICK" }
  ],
}

export const payloadGetWithLeaveReason = {
  filter: [
    { key: "spot_id", value: spotId },
    { key: "month", value: "2023-08" },
    { key: "page", value: 1 },
    { key: "per_page", value: 10 },
    { key: "leave_type", value: "LEAVE" },
    { key: "leave_reason", value: "BIRTH,FUNERAL" }
  ],
}