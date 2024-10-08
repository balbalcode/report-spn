export const spotId = "xx-xx-xxx-xxx"

export const propsBasic = { date_range: ["2023-10-01", "2023-10-02"] }
export const propsWithOfficer = {
  date_range: propsBasic.date_range,
  officer: [
    { name: "Budi", id: "id-budi" },
    { name: "Andi", id: "id-andi" },
  ]
}
export const propsWithUser = {
  date_range: propsBasic.date_range,
  user: [
    { name: "Rika", id: "id-rika" },
    { name: "Santi", id: "id-santi" },
  ]
}
export const propsWithReason = {
  date_range: propsBasic.date_range,
  reason: [
    { text: "Sistem Bermasalah", value: "SB" },
    { text: "Tiket Ganda", value: "TG" },
  ]
}

export const payloadGetBasic = {
  filter: [
    { key: "date_range", value: '2023-10-01_2023-10-02' },
    { key: "spot_id", value: spotId },
  ]
}

export const payloadGetWithOfficer = {
  filter: [
    { key: "date_range", value: '2023-10-01_2023-10-02' },
    { key: "spot_id", value: spotId },
    { key: "officer_id", value: "id-budi,id-andi" },
  ]
}

export const payloadGetWithUser = {
  filter: [
    { key: "date_range", value: '2023-10-01_2023-10-02' },
    { key: "spot_id", value: spotId },
    { key: "mgmt_user_id", value: "id-rika,id-santi" },
  ]
}

export const payloadGetWithReason = {
  filter: [
    { key: "date_range", value: '2023-10-01_2023-10-02' },
    { key: "spot_id", value: spotId },
    { key: "reason", value: "SB,TG" },
  ]
}

export const getReport = {
  rows: [
    {
      // mgmt: {
      //   name: "Franky"
      // },
      // officer: {},
      mgmt: "Franky",
      officer: "",
      time_in: "2023-08-01 08:09:38 WIB",
      // time_out_system: "2023-08-01 15:33:03 WIB",
      // time_out_manual: "",
      time_out: "2023-08-01 15:33:03 WIB",
      system_problem_at: "2024-08-02 15:55:57",
      manual_problem_at: "2024-08-02 15:55:57",
      shift_time_out: "Shift 1",
      id: "4e2cb61e-6648-482a-9863-b3d505a2b602",
      reason: "SB",
      amount: 7000,
      image: "someimage.png",
      media: "DASHBOARD"
    },
    {
      // mgmt: {},
      // officer: {
      //   name: "Robin"
      // },
      mgmt: "",
      officer: "Robin",
      time_in: "2023-08-01 14:00:06 WIB",
      // time_out_system: "",
      // time_out_manual: "2023-08-01 20:21:05 WIB",
      time_out: "2023-08-01 20:21:05 WIB",
      system_problem_at: "2024-08-01 21:55:57",
      manual_problem_at: "2024-08-01 21:55:57",
      shift_time_out: "Shift 2",
      id: "f9405030-bbeb-42b7-a2d9-4bbcc9244521",
      reason: "TG",
      amount: 5000,
      image: "someimage2.png",
      media: "OFFICER_APP"
    }
  ],
  total: {
    dashboard: 3,
    officer_app: 4,
    system: 5,
  }
}

export const formattedContentReport = [
  {
    // mgmt: {
    //   name: "Franky"
    // },
    // officer: {},
    mgmt: "Franky",
    officer: "",
    time_in: "2023-08-01 08:09:38 WIB",
    // time_out_system: "2023-08-01 15:33:03 WIB",
    // time_out_manual: "",
    time_out: "2023-08-01 15:33:03 WIB",
    system_problem_at: "2024-08-02 15:55:57",
    manual_problem_at: "2024-08-02 15:55:57",
    shift_time_out: "Shift 1",
    id: "4e2cb61e-6648-482a-9863-b3d505a2b602",
    image: "someimage.png",
    media: "DASHBOARD",
    media_text: "Dashboard",

    reporter: "Franky",
    shift: "Shift 1",
    reason: "Sistem Bermasalah",
    amount: "7.000"
  },
  {
    // mgmt: {},
    // officer: {
    //   name: "Robin"
    // },
    mgmt: "",
    officer: "Robin",
    time_in: "2023-08-01 14:00:06 WIB",
    // time_out_system: "",
    // time_out_manual: "2023-08-01 20:21:05 WIB",
    time_out: "2023-08-01 20:21:05 WIB",
    system_problem_at: "2024-08-01 21:55:57",
    manual_problem_at: "2024-08-01 21:55:57",
    shift_time_out: "Shift 2",
    id: "f9405030-bbeb-42b7-a2d9-4bbcc9244521",
    image: "someimage2.png",
    media: "OFFICER_APP",
    media_text: "Aplikasi Petugas",

    reporter: "Robin",
    shift: "Shift 2",
    reason: "Tiket Ganda",
    amount: "5.000"
  }
]