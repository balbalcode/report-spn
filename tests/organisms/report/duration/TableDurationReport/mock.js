export const spotId = "dddd-xxxx-ffff-hhhh"

export const dateRange = ["2023-02-01", "2023-02-02"]

export const product = { text: "Member 1 bulan", value: "qwer-tyui-oplk-jhgf-dsaz" }

export const payloadGetWithoutProduct = {
  filter: [
    { key: "spot_id", value: spotId },
    { key: "date_range", value: "2023-02-01_2023-02-02" }
  ]
}

export const payloadGetWithProduct = {
  filter: [
    { key: "spot_id", value: spotId },
    { key: "date_range", value: "2023-02-01_2023-02-02" },
    { key: "product", value: product.value }
  ]
}

export const vehicles = [
  { text: "Motor", value: "MT1" },
  { text: "Mobil", value: "MB1" }
]

export const getReportData = {
  "last_sync": "1689582165967",
  "rows": [
    {
      "0-1": {
        "MB1": 2,
        "MT1": 5,
      },
      "1-2": {
        "MB1": 0,
        "MT1": 0,
      },
      "2-3": {
        "MB1": 0,
        "MT1": 0,
      },
      "3-6": {
        "MB1": 0,
        "MT1": 0,
      },
      "6-12": {
        "MB1": 0,
        "MT1": 0,
      },
      ">12": {
        "MB1": 0,
        "MT1": 1,
      },
      "date": "Jul 10",
      "grand_total": 11,
      "timezone": "Asia/Jakarta",
      "total": {
        "0-1": 10,
        "1-2": 0,
        "2-3": 0,
        "3-6": 0,
        "6-12": 0,
        ">12": 1
      }
    },
    {
      "0-1": {
        "MB1": 0,
        "MT1": 2,
      },
      "1-2": {
        "MB1": 1,
        "MT1": 0,
      },
      "2-3": {
        "MB1": 0,
        "MT1": 0,
      },
      "3-6": {
        "MB1": 0,
        "MT1": 1,
      },
      "6-12": {
        "MB1": 0,
        "MT1": 0,
      },
      ">12": {
        "MB1": 0,
        "MT1": 0,
      },
      "date": "Jul 11",
      "grand_total": 4,
      "timezone": "Asia/Jakarta",
      "total": {
        "0-1": 2,
        "1-2": 1,
        "2-3": 0,
        "3-6": 1,
        "6-12": 0,
        ">12": 0
      }
    },
    {
      "0-1": {
        "MB1": 2,
        "MT1": 32,
      },
      "1-2": {
        "MB1": 0,
        "MT1": 0,
      },
      "2-3": {
        "MB1": 0,
        "MT1": 1,
      },
      "3-6": {
        "MB1": 0,
        "MT1": 0,
      },
      "6-12": {
        "MB1": 0,
        "MT1": 0,
      },
      ">12": {
        "MB1": 0,
        "MT1": 2,
      },
      "date": "Jul 12",
      "grand_total": 37,
      "timezone": "Asia/Jakarta",
      "total": {
        "0-1": 34,
        "1-2": 0,
        "2-3": 1,
        "3-6": 0,
        "6-12": 0,
        ">12": 2
      }
    }
  ],
  "total": {
    "0-1": {
      "MB1": 4,
      "MT1": 39
    },
    "1-2": {
      "MB1": 1,
      "MT1": 0
    },
    "2-3": {
      "MB1": 0,
      "MT1": 1
    },
    "3-6": {
      "MB1": 0,
      "MT1": 1
    },
    "6-12": {
      "MB1": 0,
      "MT1": 0
    },
    ">12": {
      "MB1": 0,
      "MT1": 3
    },
    "grand_total": 49,
    "total": {
      "0-1": 43,
      "1-2": 1,
      "2-3": 1,
      "3-6": 1,
      "6-12": 0,
      ">12": 3
    }
  }
}

export const formattedContent = [
  {
    "date": "Jul 10",
    "0-1_MB1": 2,
    "0-1_MT1": 5,
    "total_0-1": 10,
    "1-2_MB1": 0,
    "1-2_MT1": 0,
    "total_1-2": 0,
    "2-3_MB1": 0,
    "2-3_MT1": 0,
    "total_2-3": 0,
    "3-6_MB1": 0,
    "3-6_MT1": 0,
    "total_3-6": 0,
    "6-12_MB1": 0,
    "6-12_MT1": 0,
    "total_6-12": 0,
    ">12_MB1": 0,
    ">12_MT1": 1,
    "total_>12": 1,
    "grand_total": 11
  },
  {
    "date": "Jul 11",
    "0-1_MB1": 0,
    "0-1_MT1": 2,
    "total_0-1": 2,
    "1-2_MB1": 1,
    "1-2_MT1": 0,
    "total_1-2": 1,
    "2-3_MB1": 0,
    "2-3_MT1": 0,
    "total_2-3": 0,
    "3-6_MB1": 0,
    "3-6_MT1": 1,
    "total_3-6": 1,
    "6-12_MB1": 0,
    "6-12_MT1": 0,
    "total_6-12": 0,
    ">12_MB1": 0,
    ">12_MT1": 0,
    "total_>12": 0,
    "grand_total": 4
  },
  {
    "date": "Jul 12",
    "0-1_MB1": 2,
    "0-1_MT1": 32,
    "total_0-1": 34,
    "1-2_MB1": 0,
    "1-2_MT1": 0,
    "total_1-2": 0,
    "2-3_MB1": 0,
    "2-3_MT1": 1,
    "total_2-3": 1,
    "3-6_MB1": 0,
    "3-6_MT1": 0,
    "total_3-6": 0,
    "6-12_MB1": 0,
    "6-12_MT1": 0,
    "total_6-12": 0,
    ">12_MB1": 0,
    ">12_MT1": 2,
    "total_>12": 2,
    "grand_total": 37
  },
  {
    "date": "Total",
    "0-1_MB1": 4,
    "0-1_MT1": 39,
    "total_0-1": 46,
    "1-2_MB1": 1,
    "1-2_MT1": 0,
    "total_1-2": 1,
    "2-3_MB1": 0,
    "2-3_MT1": 1,
    "total_2-3": 1,
    "3-6_MB1": 0,
    "3-6_MT1": 1,
    "total_3-6": 1,
    "6-12_MB1": 0,
    "6-12_MT1": 0,
    "total_6-12": 0,
    ">12_MB1": 0,
    ">12_MT1": 3,
    "total_>12": 3,
    "grand_total": 52
  },
  {
    "date": "Rata-rata",
    "0-1_MB1": 1,
    "0-1_MT1": 13,
    "total_0-1": 15,
    "1-2_MB1": 0,
    "1-2_MT1": 0,
    "total_1-2": 0,
    "2-3_MB1": 0,
    "2-3_MT1": 0,
    "total_2-3": 0,
    "3-6_MB1": 0,
    "3-6_MT1": 0,
    "total_3-6": 0,
    "6-12_MB1": 0,
    "6-12_MT1": 0,
    "total_6-12": 0,
    ">12_MB1": 0,
    ">12_MT1": 1,
    "total_>12": 1,
    "grand_total": 17
  }
]

export const formattedHeader = {
  "Tanggal": "date",
  "0-1 Jam Mobil": "0-1_MB1",
  "0-1 Jam Motor": "0-1_MT1",
  "1-2 Jam Mobil": "1-2_MB1",
  "1-2 Jam Motor": "1-2_MT1",
  "2-3 Jam Mobil": "2-3_MB1",
  "2-3 Jam Motor": "2-3_MT1",
  "3-6 Jam Mobil": "3-6_MB1",
  "3-6 Jam Motor": "3-6_MT1",
  "6-12 Jam Mobil": "6-12_MB1",
  "6-12 Jam Motor": "6-12_MT1",
  ">12 Jam Mobil": ">12_MB1",
  ">12 Jam Motor": ">12_MT1",
  "Total 0-1 Jam": "total_0-1",
  "Total 1-2 Jam": "total_1-2",
  "Total 2-3 Jam": "total_2-3",
  "Total 3-6 Jam": "total_3-6",
  "Total 6-12 Jam": "total_6-12",
  "Total >12 Jam": "total_>12",
  "Grand Total": "grand_total"
}

export const additionalTotal = {
  "0-1": {
    "MB1": 1,
    "MT1": 0
  },
  "1-2": {
    "MB1": 2,
    "MT1": 0
  },
  "2-3": {
    "MB1": 0,
    "MT1": 1
  },
  "3-6": {
    "MB1": 0,
    "MT1": 0
  },
  "6-12": {
    "MB1": 2,
    "MT1": 0
  },
  ">12": {
    "MB1": 1,
    "MT1": 3
  },
  "grand_total": 10,
  "total": {
    "0-1": 1,
    "1-2": 2,
    "2-3": 1,
    "3-6": 0,
    "6-12": 2,
    ">12": 4
  }
}

export const calculatedTotal = {
  "0-1": {
    "MB1": 5,
    "MT1": 39
  },
  "1-2": {
    "MB1": 3,
    "MT1": 0
  },
  "2-3": {
    "MB1": 0,
    "MT1": 2
  },
  "3-6": {
    "MB1": 0,
    "MT1": 1
  },
  "6-12": {
    "MB1": 2,
    "MT1": 0
  },
  ">12": {
    "MB1": 1,
    "MT1": 6
  },
  "grand_total": 59,
  "total": {
    "0-1": 44,
    "1-2": 3,
    "2-3": 2,
    "3-6": 1,
    "6-12": 2,
    ">12": 7
  }
}

export const calculatedAverage = {
  "total": { "0-1": 14, "1-2": 0, "2-3": 0, "3-6": 0, "6-12": 0, ">12": 1 },
  "0-1": { "MB1": 1, "MT1": 13 },
  "1-2": { "MB1": 0, "MT1": 0 },
  "2-3": { "MB1": 0, "MT1": 0 },
  "3-6": { "MB1": 0, "MT1": 0 },
  "6-12": { "MB1": 0, "MT1": 0 },
  ">12": { "MB1": 0, "MT1": 1 },
  "grand_total": 16
}

export const dummyRows = [
  { dummy: true, start: "2023-07-01", end: "2023-07-02", date: "01 Jul 2023 s.d. 02 Jul 2023" },
  { dummy: true, start: "2023-07-03", end: "2023-07-05", date: "03 Jul 2023 s.d. 05 Jul 2023" }
]


// 01 July 2023 - 02 July 2023
export const dataReal0 = {
  rows: [
    {
      "0-1": { "MB1": 1, "MT1": 0, },
      "1-2": { "MB1": 0, "MT1": 3, },
      "2-3": { "MB1": 2, "MT1": 0, },
      "3-6": { "MB1": 2, "MT1": 1, },
      "6-12": { "MB1": 0, "MT1": 1, },
      ">12": { "MB1": 1, "MT1": 1, },
      "date": "Jul 01",
      "grand_total": 12,
      "timezone": "Asia/Jakarta",
      "total": { "0-1": 1, "1-2": 3, "2-3": 2, "3-6": 3, "6-12": 1, ">12": 2 }
    }, {
      "0-1": { "MB1": 0, "MT1": 0, },
      "1-2": { "MB1": 0, "MT1": 1, },
      "2-3": { "MB1": 0, "MT1": 0, },
      "3-6": { "MB1": 2, "MT1": 2, },
      "6-12": { "MB1": 0, "MT1": 3, },
      ">12": { "MB1": 1, "MT1": 0, },
      "date": "Jul 02",
      "grand_total": 9,
      "timezone": "Asia/Jakarta",
      "total": { "0-1": 0, "1-2": 1, "2-3": 0, "3-6": 4, "6-12": 3, ">12": 1 }
    }
  ],
  total: {
    "0-1": { "MB1": 1, "MT1": 0, },
    "1-2": { "MB1": 0, "MT1": 4, },
    "2-3": { "MB1": 2, "MT1": 0, },
    "3-6": { "MB1": 4, "MT1": 3, },
    "6-12": { "MB1": 0, "MT1": 4, },
    ">12": { "MB1": 2, "MT1": 1, },
    "date": "Jul 02",
    "grand_total": 21,
    "timezone": "Asia/Jakarta",
    "total": { "0-1": 1, "1-2": 4, "2-3": 2, "3-6": 7, "6-12": 4, ">12": 3 }
  },
  last_sync: "1689582165967"
}

// 03 July 2023 - 05 July 2023
export const dataReal1 = {
  rows: [
    {
      "0-1": { "MB1": 2, "MT1": 1, },
      "1-2": { "MB1": 1, "MT1": 3, },
      "2-3": { "MB1": 1, "MT1": 4, },
      "3-6": { "MB1": 0, "MT1": 1, },
      "6-12": { "MB1": 0, "MT1": 0, },
      ">12": { "MB1": 1, "MT1": 0, },
      "date": "Jul 03",
      "grand_total": 14,
      "timezone": "Asia/Jakarta",
      "total": { "0-1": 3, "1-2": 4, "2-3": 5, "3-6": 1, "6-12": 0, ">12": 1 }
    }, {
      "0-1": { "MB1": 0, "MT1": 4, },
      "1-2": { "MB1": 5, "MT1": 8, },
      "2-3": { "MB1": 2, "MT1": 1, },
      "3-6": { "MB1": 6, "MT1": 3, },
      "6-12": { "MB1": 0, "MT1": 3, },
      ">12": { "MB1": 1, "MT1": 1, },
      "date": "Jul 04",
      "grand_total": 34,
      "timezone": "Asia/Jakarta",
      "total": { "0-1": 4, "1-2": 13, "2-3": 3, "3-6": 9, "6-12": 3, ">12": 2 }
    }, {
      "0-1": { "MB1": 2, "MT1": 5, },
      "1-2": { "MB1": 4, "MT1": 1, },
      "2-3": { "MB1": 1, "MT1": 3, },
      "3-6": { "MB1": 1, "MT1": 0, },
      "6-12": { "MB1": 3, "MT1": 0, },
      ">12": { "MB1": 0, "MT1": 0, },
      "date": "Jul 05",
      "grand_total": 20,
      "timezone": "Asia/Jakarta",
      "total": { "0-1": 7, "1-2": 5, "2-3": 4, "3-6": 1, "6-12": 3, ">12": 0 }
    }
  ],
  total: {
    "0-1": { "MB1": 4, "MT1": 10, },
    "1-2": { "MB1": 10, "MT1": 12, },
    "2-3": { "MB1": 4, "MT1": 8, },
    "3-6": { "MB1": 7, "MT1": 4, },
    "6-12": { "MB1": 3, "MT1": 3, },
    ">12": { "MB1": 2, "MT1": 1, },
    "date": "Jul 02",
    "grand_total": 68,
    "timezone": "Asia/Jakarta",
    "total": { "0-1": 14, "1-2": 22, "2-3": 12, "3-6": 11, "6-12": 6, ">12": 3 }
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
  rows: [...dataReal1.rows],
  total: { ...dataReal1.total },
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
    "0-1": { "MB1": 5, "MT1": 10, },
    "1-2": { "MB1": 10, "MT1": 16, },
    "2-3": { "MB1": 6, "MT1": 8, },
    "3-6": { "MB1": 11, "MT1": 7, },
    "6-12": { "MB1": 3, "MT1": 7, },
    ">12": { "MB1": 4, "MT1": 2, },
    "date": "Jul 02",
    "grand_total": 89,
    "timezone": "Asia/Jakarta",
    "total": { "0-1": 15, "1-2": 26, "2-3": 14, "3-6": 18, "6-12": 10, ">12": 6 }
  },
  last_sync: "1689582165967"
}
