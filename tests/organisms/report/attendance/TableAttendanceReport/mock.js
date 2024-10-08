const payloadGet = {
  filter: [
    { key: 'month', value: "2022-08" },
    { key: 'spot_id', value: "h9ji....-g2b5-....-9h8i-....-n9c0...." },
    { key: 'page', value: 3 },
    { key: 'per_page', value: 20 },
  ],
}

const formattedReport = [
  { "id": "c2a8....-fc9e-....-babd-....1846....", "name": "testingnata", "officer_id": "....aaab-....-4370-....-c6ab....1c14", "shift": "06:00 - 14:00", "timestamp": "15/02/2023 14:11", "status_in": "Terlambat", "timestamp_out": "15/02/2023 14:11", "status_out": "On Time", "duration": "0 jam", "image_url": "https://spn-gate.s3-ap-southeast-1.amazonaws.com/attendance/982ef30a-0ec3-40b8-a966-7d9c5f2d9545/20230215/Attendance-1676445078091.jpg", "image_url_out": "https://spn-gate.s3-ap-southeast-1.amazonaws.com/attendance/982ef30a-0ec3-40b8-a966-7d9c5f2d9545/20230215/Attendance-1676445115734.jpg" },
  { "id": "a251....-c81a-....-9506-....fb52....", "name": "Uranus", "officer_id": "....1a45-....-4c56-....-6c80....e782", "shift": "14:00 - 22:00", "timestamp": "15/02/2023 14:10", "status_in": "Terlambat", "timestamp_out": "15/02/2023 14:11", "status_out": "Early Check Out", "duration": "0 jam", "image_url": "https://spn-gate.s3-ap-southeast-1.amazonaws.com/attendance/982ef30a-0ec3-40b8-a966-7d9c5f2d9545/20230215/Attendance-1676445041669.jpg", "image_url_out": "https://spn-gate.s3-ap-southeast-1.amazonaws.com/attendance/982ef30a-0ec3-40b8-a966-7d9c5f2d9545/20230215/Attendance-1676445096422.jpg" },
]

const dataGetReport = {
  "last_sync": "1676524788153",
  "rows": [
    {
      "duration": "0 jam",
      "id": "c2a8....-fc9e-....-babd-....1846....",
      "image_url": "https://spn-gate.s3-ap-southeast-1.amazonaws.com/attendance/982ef30a-0ec3-40b8-a966-7d9c5f2d9545/20230215/Attendance-1676445078091.jpg",
      "image_url_out": "https://spn-gate.s3-ap-southeast-1.amazonaws.com/attendance/982ef30a-0ec3-40b8-a966-7d9c5f2d9545/20230215/Attendance-1676445115734.jpg",
      "name": "testingnata",
      "officer_id": "....aaab-....-4370-....-c6ab....1c14",
      "shift": "06:00 - 14:00",
      "status_in": "L",
      "status_out": "OT",
      "timestamp": "1676445078091",
      "timestamp_out": "1676445115734"
    },
    {
      "duration": "0 jam",
      "id": "a251....-c81a-....-9506-....fb52....",
      "image_url": "https://spn-gate.s3-ap-southeast-1.amazonaws.com/attendance/982ef30a-0ec3-40b8-a966-7d9c5f2d9545/20230215/Attendance-1676445041669.jpg",
      "image_url_out": "https://spn-gate.s3-ap-southeast-1.amazonaws.com/attendance/982ef30a-0ec3-40b8-a966-7d9c5f2d9545/20230215/Attendance-1676445096422.jpg",
      "name": "Uranus",
      "officer_id": "....1a45-....-4c56-....-6c80....e782",
      "shift": "14:00 - 22:00",
      "status_in": "L",
      "status_out": "EO",
      "timestamp": "1676445041669",
      "timestamp_out": "1676445096422"
    },
  ],
  "total": 2
}

const reportHeaders = ["No.", "Nama", "ID", "Shift (Jam Kerja)", "Waktu Check In", "Status In", "Waktu Check Out", "Status Out", "Durasi", "Foto Check In", "Foto Check Out"]

const reportRows = [
  [
    "1",
    "testingnata",
    "....aaab-....-4370-....-c6ab....1c14",
    "06:00 - 14:00",
    "15/02/2023 14:11",
    "Terlambat",
    "15/02/2023 14:11",
    "On Time",
    "0 jam",
    "https://spn-gate.s3-ap-southeast-1.amazonaws.com/attendance/982ef30a-0ec3-40b8-a966-7d9c5f2d9545/20230215/Attendance-1676445078091.jpg",
    "https://spn-gate.s3-ap-southeast-1.amazonaws.com/attendance/982ef30a-0ec3-40b8-a966-7d9c5f2d9545/20230215/Attendance-1676445115734.jpg"
  ],
  [
    "2",
    "Uranus",
    "....1a45-....-4c56-....-6c80....e782",
    "14:00 - 22:00",
    "15/02/2023 14:10",
    "Terlambat",
    "15/02/2023 14:11",
    "Early Check Out",
    "0 jam",
    "https://spn-gate.s3-ap-southeast-1.amazonaws.com/attendance/982ef30a-0ec3-40b8-a966-7d9c5f2d9545/20230215/Attendance-1676445041669.jpg",
    "https://spn-gate.s3-ap-southeast-1.amazonaws.com/attendance/982ef30a-0ec3-40b8-a966-7d9c5f2d9545/20230215/Attendance-1676445096422.jpg"
  ]
]

export { payloadGet, dataGetReport, formattedReport, reportHeaders, reportRows }