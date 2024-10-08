export const spotId = "dddd-xxxx-ffff-hhhh"

export const dateRange = ["2023-02-01", "2023-02-02"]

export const month = "2023-02"

export const type = "daily"

export const payloadGetWithoutType = {
  filter: [
    { key: "spot_id", value: spotId },
    { key: "date_range", value: "2023-02-01_2023-02-02" },
    { key: "type", value: "daily" }
  ],
  version: "v4"
}

export const payloadGetWithType = {
  filter: [
    { key: "spot_id", value: spotId },
    { key: "date_range", value: "2023-02-01_2023-02-02" },
    { key: "type", value: type }
  ],
  version: "v4"
}

export const payloadGetWithVersion = {
  filter: [
    { key: "spot_id", value: spotId },
    { key: "date_range", value: "2023-02-01_2023-02-02" },
    { key: "type", value: "daily" }
  ],
  version: "v3"
}

export const vehicles = [
  { text: "Motor", value: "MT1" },
  { text: "Mobil", value: "MB1" }
]

export const getReportData = {
  "last_sync": "1689582165967",
  "rows": [
    {
      "casual": {
        "in": { "MB1": 2, "MT1": 5, },
        "out": { "MB1": 0, "MT1": 0, }
      },
      "member": {
        "in": { "MB1": 0, "MT1": 0, },
        "out": { "MB1": 0, "MT1": 0, }
      },
      "date": "Jul 10",
      "days": "Senin",
      "timezone": "Asia/Jakarta",
      "total": {
        "casual": { "in": 7, "out": 0 },
        "member": { "in": 0, "out": 0 },
      },
      "difference": { "casual": 7, "member": 0 },
      "grand_total": { "in": 7, "out": 0 },
    },
    {
      "casual": {
        "in": { "MB1": 0, "MT1": 2, },
        "out": { "MB1": 0, "MT1": 0, }
      },
      "member": {
        "in": { "MB1": 1, "MT1": 0, },
        "out": { "MB1": 0, "MT1": 1, }
      },
      "date": "Jul 11",
      "days": "Selasa",
      "timezone": "Asia/Jakarta",
      "total": {
        "casual": { "in": 2, "out": 0 },
        "member": { "in": 1, "out": 1 },
      },
      "difference": { "casual": 2, "member": 0 },
      "grand_total": { "in": 3, "out": 1 },
    },
    {
      "casual": {
        "in": { "MB1": 2, "MT1": 32, },
        "out": { "MB1": 0, "MT1": 1, }
      },
      "member": {
        "in": { "MB1": 0, "MT1": 0, },
        "out": { "MB1": 0, "MT1": 0, }
      },
      "date": "Jul 12",
      "days": "Rabu",
      "timezone": "Asia/Jakarta",
      "total": {
        "casual": { "in": 34, "out": 1 },
        "member": { "in": 0, "out": 0 },
      },
      "difference": { "casual": 33, "member": 0 },
      "grand_total": { "in": 34, "out": 1 },
    }
  ],
  "total": {
    "casual": {
      "in": { "MB1": 4, "MT1": 39, },
      "out": { "MB1": 0, "MT1": 1, }
    },
    "member": {
      "in": { "MB1": 1, "MT1": 0, },
      "out": { "MB1": 0, "MT1": 1, }
    },
    "date": "",
    "days": "",
    "timezone": "",
    "total": {
      "casual": { "in": 43, "out": 1 },
      "member": { "in": 1, "out": 1 },
    },
    "difference": { "casual": 42, "member": 0 },
    "grand_total": { "in": 44, "out": 2 },
  }
}

export const formattedTotal = {
  "days": "Total",
  "date": "",
  "casual_in_MB1": 4,
  "casual_in_MT1": 39,
  "total_casual_in": 43,
  "casual_out_MB1": 0,
  "casual_out_MT1": 1,
  "total_casual_out": 1,
  "member_in_MB1": 1,
  "member_in_MT1": 0,
  "total_member_in": 1,
  "member_out_MB1": 0,
  "member_out_MT1": 1,
  "total_member_out": 1,
  "difference_casual": 42,
  "difference_member": 0,
  "grand_total_in": 44,
  "grand_total_out": 2
}

export const formattedContent = [
  {
    "date": "Jul 10",
    "days": "Senin",
    "casual_in_MB1": 2,
    "casual_in_MT1": 5,
    "total_casual_in": 7,
    "casual_out_MB1": 0,
    "casual_out_MT1": 0,
    "total_casual_out": 0,
    "member_in_MB1": 0,
    "member_in_MT1": 0,
    "total_member_in": 0,
    "member_out_MB1": 0,
    "member_out_MT1": 0,
    "total_member_out": 0,
    "difference_casual": 7,
    "difference_member": 0,
    "grand_total_in": 7,
    "grand_total_out": 0
  },
  {
    "date": "Jul 11",
    "days": "Selasa",
    "casual_in_MB1": 0,
    "casual_in_MT1": 2,
    "total_casual_in": 2,

    "casual_out_MB1": 0,
    "casual_out_MT1": 0,
    "total_casual_out": 0,

    "member_in_MB1": 1,
    "member_in_MT1": 0,
    "total_member_in": 1,

    "member_out_MB1": 0,
    "member_out_MT1": 1,
    "total_member_out": 1,

    "difference_casual": 2,
    "difference_member": 0,
    "grand_total_in": 3,
    "grand_total_out": 1
  },
  {
    "date": "Jul 12",
    "days": "Rabu",
    "casual_in_MB1": 2,
    "casual_in_MT1": 32,
    "total_casual_in": 34,
    "casual_out_MB1": 0,
    "casual_out_MT1": 1,
    "total_casual_out": 1,
    "member_in_MB1": 0,
    "member_in_MT1": 0,
    "total_member_in": 0,
    "member_out_MB1": 0,
    "member_out_MT1": 0,
    "total_member_out": 0,
    "difference_casual": 33,
    "difference_member": 0,
    "grand_total_in": 34,
    "grand_total_out": 1
  },
  formattedTotal
]

export const formattedHeader = {
  "Tanggal": "date",
  "Hari": "days",
  "Kasual Masuk Mobil": "casual_in_MB1",
  "Kasual Masuk Motor": "casual_in_MT1",
  "Kasual Keluar Mobil": "casual_out_MB1",
  "Kasual Keluar Motor": "casual_out_MT1",
  "Membership Masuk Mobil": "member_in_MB1",
  "Membership Masuk Motor": "member_in_MT1",
  "Membership Keluar Mobil": "member_out_MB1",
  "Membership Keluar Motor": "member_out_MT1",
  "Total Kasual Masuk": "total_casual_in",
  "Total Kasual Keluar": "total_casual_out",
  "Total Membership Masuk": "total_member_in",
  "Total Membership Keluar": "total_member_out",
  "Selisih Kasual": "difference_casual",
  "Selisih Membership": "difference_member",
  "Grand Total Masuk": "grand_total_in",
  "Grand Total Keluar": "grand_total_out"
}

export const additionalTotal = {
  "casual": {
    "in": { "MB1": 2, "MT1": 32, },
    "out": { "MB1": 0, "MT1": 1, }
  },
  "member": {
    "in": { "MB1": 0, "MT1": 0, },
    "out": { "MB1": 0, "MT1": 0, }
  },
  "date": "",
  "days": "",
  "timezone": "",
  "total": {
    "casual": { "in": 34, "out": 1 },
    "member": { "in": 0, "out": 0 },
  },
  "difference": { "casual": 33, "member": 0 },
  "grand_total": { "in": 34, "out": 1 },
}

export const calculatedTotal = {
  "casual": {
    "in": { "MB1": 4, "MT1": 39, },
    "out": { "MB1": 0, "MT1": 1, }
  },
  "member": {
    "in": { "MB1": 1, "MT1": 0, },
    "out": { "MB1": 0, "MT1": 1, }
  },
  "date": "",
  "days": "",
  "timezone": "",
  "total": {
    "casual": { "in": 43, "out": 1 },
    "member": { "in": 1, "out": 1 },
  },
  "difference": { "casual": 42, "member": 0 },
  "grand_total": { "in": 44, "out": 2 },
}

export const dummyRows = [
  { dummy: true, start: "2023-07-01", end: "2023-07-02", date: "01 Jul 2023 s.d. 02 Jul 2023" },
  { dummy: true, start: "2023-07-03", end: "2023-07-05", date: "03 Jul 2023 s.d. 05 Jul 2023" }
]


// 01 July 2023 - 02 July 2023
export const dataReal0 = {
  rows: [
    {
      "casual": {
        "in": { "MB1": 2, "MT1": 5, },
        "out": { "MB1": 0, "MT1": 0, }
      },
      "member": {
        "in": { "MB1": 0, "MT1": 0, },
        "out": { "MB1": 0, "MT1": 0, }
      },
      "date": "Jul 10",
      "days": "Senin",
      "timezone": "Asia/Jakarta",
      "total": {
        "casual": { "in": 7, "out": 0 },
        "member": { "in": 0, "out": 0 },
      },
      "difference": { "casual": 7, "member": 0 },
      "grand_total": { "in": 7, "out": 0 },
    },
    {
      "casual": {
        "in": { "MB1": 0, "MT1": 2, },
        "out": { "MB1": 0, "MT1": 0, }
      },
      "member": {
        "in": { "MB1": 1, "MT1": 0, },
        "out": { "MB1": 0, "MT1": 1, }
      },
      "date": "Jul 11",
      "days": "Selasa",
      "timezone": "Asia/Jakarta",
      "total": {
        "casual": { "in": 2, "out": 0 },
        "member": { "in": 1, "out": 1 },
      },
      "difference": { "casual": 2, "member": 0 },
      "grand_total": { "in": 3, "out": 1 },
    },
  ],
  total: {
    "casual": {
      "in": { "MB1": 2, "MT1": 7, },
      "out": { "MB1": 0, "MT1": 0, }
    },
    "member": {
      "in": { "MB1": 1, "MT1": 0, },
      "out": { "MB1": 0, "MT1": 1, }
    },
    "date": "",
    "days": "",
    "timezone": "",
    "total": {
      "casual": { "in": 9, "out": 0 },
      "member": { "in": 1, "out": 1 },
    },
    "difference": { "casual": 9, "member": 0 },
    "grand_total": { "in": 10, "out": 1 },
  },
  last_sync: "1689582165967"
}

// 03 July 2023 - 05 July 2023
export const dataReal1 = {
  rows: [
    {
      "casual": {
        "in": { "MB1": 2, "MT1": 32, },
        "out": { "MB1": 0, "MT1": 1, }
      },
      "member": {
        "in": { "MB1": 0, "MT1": 0, },
        "out": { "MB1": 0, "MT1": 0, }
      },
      "date": "Jul 12",
      "days": "Rabu",
      "timezone": "Asia/Jakarta",
      "total": {
        "casual": { "in": 34, "out": 1 },
        "member": { "in": 0, "out": 0 },
      },
      "difference": { "casual": 33, "member": 0 },
      "grand_total": { "in": 34, "out": 1 },
    }
  ],
  total: {
    "casual": {
      "in": { "MB1": 2, "MT1": 32, },
      "out": { "MB1": 0, "MT1": 1, }
    },
    "member": {
      "in": { "MB1": 0, "MT1": 0, },
      "out": { "MB1": 0, "MT1": 0, }
    },
    "date": "",
    "days": "",
    "timezone": "",
    "total": {
      "casual": { "in": 34, "out": 1 },
      "member": { "in": 0, "out": 0 },
    },
    "difference": { "casual": 33, "member": 0 },
    "grand_total": { "in": 34, "out": 1 },
  },
  last_sync: "1689582165967"
}

export const dataError = new Error({
  message: "Internal Server Error"
})

export const dataEmpty = {
  rows: [],
  total: false,
  last_sync: ""
}

export const dataReal = {
  rows: [...dataReal0.rows],
  total: { ...dataReal0.total },
  last_sync: "1689582165967"
}

export const dataDummy = {
  rows: [{ ...dummyRows[1] }],
  total: false,
  last_sync: ""
}

export const dataRealThenDummy = {
  rows: [...dataReal0.rows, { ...dummyRows[1] }],
  total: { ...dataReal0.total },
  last_sync: "1689582165967"
}

export const dataDummyThenReal = {
  rows: [{ ...dummyRows[0] }, ...dataReal1.rows],
  total: { ...dataReal1.total },
  last_sync: "1689582165967"
}

export const dataDummyThenDummy = {
  rows: [...dummyRows],
  total: false,
  last_sync: ""
}

export const dataRealThenReal = {
  rows: [...dataReal0.rows, ...dataReal1.rows],
  total: {
    "administration": { "MB1": 5, "MT1": 10, },
    "cashier_product": { "MB1": 10, "MT1": 16, },
    "casual": { "MB1": 6, "MT1": 8, },
    "lost_ticket": { "MB1": 11, "MT1": 7, },
    "date": "Jul 02",
    "grand_total": 89,
    "timezone": "Asia/Jakarta",
    "total": { "administration": 15, "cashier_product": 26, "casual": 14, "lost_ticket": 18 }
  },
  last_sync: "1689582165967"
}
