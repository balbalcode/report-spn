export const spotId = "xxxx-x-x-x-xxxx"

export const responseGet = {
  "message": "",
  "total_values": 100,
  "values": {
    "rows": [
      {
        "shift": "2024-04-06 - Shift 4 (15:00 - 21:00)",
        "casual": 10000000,
        "lost_ticket": 20000,
        "total": 10020000,
        "officer": "Hudya"
      },
      {
        "shift": "2024-04-06 - Shift 5 (21:00 - 23:00)",
        "casual": 10000000,
        "lost_ticket": 20000,
        "total": 10020000,
        "officer": "Ikbal"
      },
      {
        "shift": "2024-04-07 - Shift 2 (06:00 - 11:00)",
        "casual": 40000000,
        "lost_ticket": 20000,
        "total": 25000000,
        "officer": "Hudya"
      },
      {
        "shift": "2024-04-07 - Shift 3 (11:00 - 15:00)",
        "casual": 40000000,
        "lost_ticket": 20000,
        "total": 25000000,
        "officer": "Ikbal"
      },
    ],
    "total": {
      "casual": 20000000,
      "lost_ticket": 40000,
      "total": 20040000,
    }
  },
}

export const unformattedData = [
  {
    "shift": "2024-04-06 - Shift 5 (21:00 - 23:00)",
    "casual": "10.000.000",
    "lost_ticket": "20.000",
    "total": "10.020.000",
    "officer": "Ikbal"
  },
  {
    "shift": "2024-04-06 - Shift 4 (15:00 - 21:00)",
    "casual": "10.000.000",
    "lost_ticket": "20.000",
    "total": "10.020.000",
    "officer": "Hudya"
  },
  {
    "shift": "2024-04-07 - Shift 3 (11:00 - 15:00)",
    "casual": "40.000.000",
    "lost_ticket": "50.000",
    "total": "25.000.000",
    "officer": "Ikbal"
  },
  {
    "shift": "2024-04-07 - Shift 2 (06:00 - 11:00)",
    "casual": "40.000.000",
    "lost_ticket": "50.000",
    "total": "25.000.000",
    "officer": "Hudya"
  },
]

export const formattedData = [
  {
    "shift": "2024-04-06 - Shift 4 (15:00 - 21:00)",
    "casual": "10.000.000",
    "lost_ticket": "20.000",
    "total": "10.020.000",
    "officer": "Hudya"
  },
  {
    "shift": "2024-04-06 - Shift 5 (21:00 - 23:00)",
    "casual": "10.000.000",
    "lost_ticket": "20.000",
    "total": "10.020.000",
    "officer": "Ikbal"
  },
  {
    "shift": "2024-04-07 - Shift 2 (06:00 - 11:00)",
    "casual": "40.000.000",
    "lost_ticket": "50.000",
    "total": "25.000.000",
    "officer": "Hudya"
  },
  {
    "shift": "2024-04-07 - Shift 3 (11:00 - 15:00)",
    "casual": "40.000.000",
    "lost_ticket": "50.000",
    "total": "25.000.000",
    "officer": "Ikbal"
  }
]

export const formattedTotal = {
  shift: "Total",
  casual: "20.000.000",
  lost_ticket: "20.000",
  total: "20.040.000"
}

export const payloadGetBasic = {
  filter: [
    { key: "page", value: 1 },
    { key: "per_page", value: 25 },
    { key: "month", value: "2023-07" },
    { key: "spot_id", value: spotId }
  ],
  version: "v3"
}

export const payloadGetWithOfficer = {
  filter: [
    { key: "page", value: 1 },
    { key: "per_page", value: 25 },
    { key: "month", value: "2023-07" },
    { key: "spot_id", value: spotId },
    { key: "officer_id", value: "x-x-x-x,y-y-y-y" }
  ],
  version: "v3"
}

export const payloadGetWithTimezone = {
  filter: [
    { key: "page", value: 1 },
    { key: "per_page", value: 25 },
    { key: "month", value: "2023-07" },
    { key: "spot_id", value: spotId },
    { key: "timezone", value: "Asia/Jakarta" }
  ],
  version: "v3"
}

export const payloadGetWithVersion = {
  filter: [
    { key: "page", value: 1 },
    { key: "per_page", value: 25 },
    { key: "month", value: "2023-07" },
    { key: "spot_id", value: spotId },
  ],
  version: "v4"
}

export const payloadDownload = {
  content: [...formattedData, formattedTotal],
  page: 1,
  total_page: 2
}