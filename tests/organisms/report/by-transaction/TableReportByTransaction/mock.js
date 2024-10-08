export const spotId = "dddd-xxxx-ffff-hhhh"

export const dateRange = ["2023-02-01", "2023-02-02"]

export const month = "2023-02"

export const type = "shift"

export const payloadGetWithoutType = {
  filter: [
    { key: "spot_id", value: spotId },
    { key: "date_range", value: "2023-02-01_2023-02-02" },
    { key: "month", value: month },
    { key: "type", value: "daily" }
  ],
}

export const payloadGetWithTimezone = {
  filter: [
    { key: "spot_id", value: spotId },
    { key: "date_range", value: "2023-02-01_2023-02-02" },
    { key: "month", value: month },
    { key: "type", value: "daily" },
    { key: "timezone", value: "Asia/Jakarta" }
  ],
}

export const payloadGetWithType = {
  filter: [
    { key: "spot_id", value: spotId },
    { key: "date_range", value: "2023-02-01_2023-02-02" },
    { key: "month", value: month },
    { key: "type", value: type }
  ],
}

export const vehicles = [
  { text: "Motor", value: "MT1" },
  { text: "Mobil", value: "MB1" }
]

export const getReportData = {
  "last_sync": "1689582165967",
  "rows": [
    {
      "administration": {
        "MB1": 2,
        "MT1": 5,
      },
      "cashier_product": {
        "MB1": 0,
        "MT1": 0,
      },
      "casual": {
        "MB1": 0,
        "MT1": 0,
      },
      "lost_ticket": {
        "MB1": 0,
        "MT1": 0,
      },
      "date": "Jul 10",
      "days": "Senin",
      "grand_total": 7,
      "timezone": "Asia/Jakarta",
      "total": {
        "administration": 7,
        "cashier_product": 0,
        "casual": 0,
        "lost_ticket": 0,
      }
    },
    {
      "administration": {
        "MB1": 0,
        "MT1": 2,
      },
      "cashier_product": {
        "MB1": 1,
        "MT1": 0,
      },
      "casual": {
        "MB1": 0,
        "MT1": 0,
      },
      "lost_ticket": {
        "MB1": 0,
        "MT1": 1,
      },
      "date": "Jul 11",
      "days": "Selasa",
      "grand_total": 4,
      "timezone": "Asia/Jakarta",
      "total": {
        "administration": 2,
        "cashier_product": 1,
        "casual": 0,
        "lost_ticket": 1,
      }
    },
    {
      "administration": {
        "MB1": 2,
        "MT1": 32,
      },
      "cashier_product": {
        "MB1": 0,
        "MT1": 0,
      },
      "casual": {
        "MB1": 0,
        "MT1": 1,
      },
      "lost_ticket": {
        "MB1": 0,
        "MT1": 0,
      },
      "date": "Jul 12",
      "days": "Rabu",
      "grand_total": 35,
      "timezone": "Asia/Jakarta",
      "total": {
        "administration": 34,
        "cashier_product": 0,
        "casual": 1,
        "lost_ticket": 0,
      }
    }
  ],
  "total": {
    "administration": {
      "MB1": 4,
      "MT1": 39
    },
    "cashier_product": {
      "MB1": 1,
      "MT1": 0
    },
    "casual": {
      "MB1": 0,
      "MT1": 1
    },
    "lost_ticket": {
      "MB1": 0,
      "MT1": 1
    },
    "grand_total": 46,
    "total": {
      "administration": 43,
      "cashier_product": 1,
      "casual": 1,
      "lost_ticket": 1,
    }
  }
}

export const formattedTotal = {
  "days": "Total",
  "administration_MB1": 4,
  "administration_MT1": 39,
  "total_administration": 43,
  "cashier_product_MB1": 1,
  "cashier_product_MT1": 0,
  "total_cashier_product": 1,
  "casual_MB1": 0,
  "casual_MT1": 1,
  "total_casual": 1,
  "lost_ticket_MB1": 0,
  "lost_ticket_MT1": 1,
  "total_lost_ticket": 1,
  "grand_total": 46
}

export const formattedContent = [
  {
    "date": "Jul 10",
    "days": "Senin",
    "administration_MB1": 2,
    "administration_MT1": 5,
    "total_administration": 7,
    "cashier_product_MB1": 0,
    "cashier_product_MT1": 0,
    "total_cashier_product": 0,
    "casual_MB1": 0,
    "casual_MT1": 0,
    "total_casual": 0,
    "lost_ticket_MB1": 0,
    "lost_ticket_MT1": 0,
    "total_lost_ticket": 0,
    "grand_total": 7
  },
  {
    "date": "Jul 11",
    "days": "Selasa",
    "administration_MB1": 0,
    "administration_MT1": 2,
    "total_administration": 2,
    "cashier_product_MB1": 1,
    "cashier_product_MT1": 0,
    "total_cashier_product": 1,
    "casual_MB1": 0,
    "casual_MT1": 0,
    "total_casual": 0,
    "lost_ticket_MB1": 0,
    "lost_ticket_MT1": 1,
    "total_lost_ticket": 1,
    "grand_total": 4
  },
  {
    "date": "Jul 12",
    "days": "Rabu",
    "administration_MB1": 2,
    "administration_MT1": 32,
    "total_administration": 34,
    "cashier_product_MB1": 0,
    "cashier_product_MT1": 0,
    "total_cashier_product": 0,
    "casual_MB1": 0,
    "casual_MT1": 1,
    "total_casual": 1,
    "lost_ticket_MB1": 0,
    "lost_ticket_MT1": 0,
    "total_lost_ticket": 0,
    "grand_total": 35
  },
  formattedTotal
]

export const formattedHeader = {
  "Tanggal": "date",
  "Hari": "days",
  "Kasual Mobil": "casual_MB1",
  "Kasual Motor": "casual_MT1",
  "Produk Tambahan Mobil": "cashier_product_MB1",
  "Produk Tambahan Motor": "cashier_product_MT1",
  "Tiket Hilang Mobil": "lost_ticket_MB1",
  "Tiket Hilang Motor": "lost_ticket_MT1",
  "Administrasi Mobil": "administration_MB1",
  "Administrasi Motor": "administration_MT1",
  "Total Kasual": "total_casual",
  "Total Produk Tambahan": "total_cashier_product",
  "Total Tiket Hilang": "total_lost_ticket",
  "Total Administrasi": "total_administration",
  "Grand Total": "grand_total"
}

export const calculatedTotal = {
  "administration": { "MB1": 5, "MT1": 10, },
  "cashier_product": { "MB1": 10, "MT1": 16, },
  "casual": { "MB1": 6, "MT1": 8, },
  "lost_ticket": { "MB1": 11, "MT1": 7, },
  "grand_total": 73,
  "timezone": "Asia/Jakarta",
  "total": { "administration": 15, "cashier_product": 26, "casual": 14, "lost_ticket": 18 }
}

export const dummyRows = [
  { dummy: true, start: "2023-07-01", end: "2023-07-02", date: "01 Jul 2023 s.d. 02 Jul 2023" },
  { dummy: true, start: "2023-07-03", end: "2023-07-05", date: "03 Jul 2023 s.d. 05 Jul 2023" }
]


// 01 July 2023 - 02 July 2023
export const dataReal0 = {
  rows: [
    {
      "administration": { "MB1": 1, "MT1": 0, },
      "cashier_product": { "MB1": 0, "MT1": 3, },
      "casual": { "MB1": 2, "MT1": 0, },
      "date": "Feb-01",
      "days": "Kamis",
      "gate": "gtout-t-plaza-1",
      "grand_total": 9,
      "lost_ticket": { "MB1": 2, "MT1": 1, },
      "shift": "Feb-01 07:00-19:00 Shift 1",
      "timezone": "Asia/Jakarta",
      "total": {
        "administration": 1,
        "cashier_product": 3,
        "casual": 2,
        "lost_ticket": 3
      }
    },
    {
      "administration": { "MB1": 0, "MT1": 0, },
      "cashier_product": { "MB1": 0, "MT1": 1, },
      "casual": { "MB1": 0, "MT1": 0, },
      "date": "Feb-01",
      "days": "Kamis",
      "gate": "gtout-t-plaza-1",
      "grand_total": 5,
      "lost_ticket": { "MB1": 2, "MT1": 2, },
      "shift": "Feb-01 07:00-19:00 Shift 1",
      "timezone": "Asia/Jakarta",
      "total": {
        "administration": 0,
        "cashier_product": 1,
        "casual": 0,
        "lost_ticket": 4
      }
    },
  ],
  total: {
    "administration": { "MB1": 1, "MT1": 0, },
    "cashier_product": { "MB1": 0, "MT1": 4, },
    "casual": { "MB1": 2, "MT1": 0, },
    "lost_ticket": { "MB1": 4, "MT1": 3, },
    "grand_total": 14,
    "timezone": "Asia/Jakarta",
    "total": { "administration": 1, "cashier_product": 4, "casual": 2, "lost_ticket": 7 }
  },
  last_sync: "1689582165967"
}

// 03 July 2023 - 05 July 2023
export const dataReal1 = {
  rows: [
    {
      "administration": { "MB1": 2, "MT1": 1, },
      "cashier_product": { "MB1": 1, "MT1": 3, },
      "casual": { "MB1": 1, "MT1": 4, },
      "lost_ticket": { "MB1": 0, "MT1": 1, },
      "date": "Jul 03",
      "grand_total": 14,
      "timezone": "Asia/Jakarta",
      "total": { "administration": 3, "cashier_product": 4, "casual": 5, "lost_ticket": 1 }
    }, {
      "administration": { "MB1": 0, "MT1": 4, },
      "cashier_product": { "MB1": 5, "MT1": 8, },
      "casual": { "MB1": 2, "MT1": 1, },
      "lost_ticket": { "MB1": 6, "MT1": 3, },
      "date": "Jul 04",
      "grand_total": 34,
      "timezone": "Asia/Jakarta",
      "total": { "administration": 4, "cashier_product": 13, "casual": 3, "lost_ticket": 9 }
    }, {
      "administration": { "MB1": 2, "MT1": 5, },
      "cashier_product": { "MB1": 4, "MT1": 1, },
      "casual": { "MB1": 1, "MT1": 3, },
      "lost_ticket": { "MB1": 1, "MT1": 0, },
      "date": "Jul 05",
      "grand_total": 20,
      "timezone": "Asia/Jakarta",
      "total": { "administration": 7, "cashier_product": 5, "casual": 4, "lost_ticket": 1 }
    }
  ],
  total: {
    "administration": { "MB1": 4, "MT1": 10, },
    "cashier_product": { "MB1": 10, "MT1": 12, },
    "casual": { "MB1": 4, "MT1": 8, },
    "lost_ticket": { "MB1": 7, "MT1": 4, },
    "grand_total": 59,
    "timezone": "Asia/Jakarta",
    "total": { "administration": 14, "cashier_product": 22, "casual": 12, "lost_ticket": 11 }
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
