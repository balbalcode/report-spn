const payloadGet = {
  filter: [
    { key: "month", value: "2023-01" },
    { key: "spot_id", value: "8m.....4210-u9c.....29-jc0.....32" },
    { key: "administration", value: "IDENTITY_CHANGE" },
    { key: "type", value: "card" }
  ]
}

const dataGetAdministrationReport = {
  "rows": [
    {
      "created_at": "2023-01-26 08:02:23",
      "employee_id": "e280....-0d55-....-8e8c-....c276....",
      "mgmt_user_detail": {
        "email": "iqbal.cakeuppp@gmail.com",
        "name": "ikbal"
      },
      "previous_data": {
        "email": "anjay@mail.com",
        "employee_phone": "9892150890",
        "identification_number": "",
        "name": "pa hanip"
      },
      "updated_data": {
        "email": "anjay@mail.com",
        "employee_phone": "5928304",
        "identification_number": "445566778899",
        "name": "Komandan Alib"
      }
    },
    {
      "created_at": "2023-01-26 07:22:30",
      "employee_id": "c5ec....-ef8a-....-aa06-....4ef7....",
      "mgmt_user_detail": {
        "email": "agus.jangkrik@gmail.co.id",
        "name": "Agus Jangkrik Boss"
      },
      "previous_data": {
        "email": "kaffeinss888@gmail.com",
        "employee_phone": "797501",
        "identification_number": "222rr",
        "name": "Kapein2-ganti-ke2"
      },
      "updated_data": {
        "email": "kaffeinss888@gmail.com",
        "employee_phone": "5701279",
        "identification_number": "222rr",
        "name": "Kapein2-ganti-ke3"
      }
    },
    {
      "created_at": "2023-01-26 06:41:18",
      "employee_id": "c5ec....-ef8a-....-aa06-....4ef7....",
      "mgmt_user_detail": {
        "email": "alib@anjaymail.co.id",
        "name": "Komandan Alib"
      },
      "previous_data": {
        "email": "kaffeinss888@gmail.com",
        "employee_phone": "",
        "identification_number": "222",
        "name": "Kapein2-ganti-ke2"
      },
      "updated_data": {
        "email": "kaffeinss888@gmail.com",
        "employee_phone": "7975012",
        "identification_number": "222rr",
        "name": "Kapein2-ganti-ke2"
      }
    },
    {
      "created_at": "2023-01-26 06:15:34",
      "employee_id": "c5ec....-ef8a-....-aa06-....4ef7....",
      "mgmt_user_detail": {
        "email": "agus.jangkrik@gmail.co.id",
        "name": "Agus Jangkrik Boss"
      },
      "previous_data": {
        "email": "kaffeinss888@gmail.com",
        "employee_phone": "",
        "identification_number": "222",
        "name": "Kapein2-ganti"
      },
      "updated_data": {
        "email": "kaffeinss888@gmail.com",
        "employee_phone": "57912401",
        "identification_number": "222",
        "name": "Kapein2-ganti-ke2"
      }
    },
    {
      "created_at": "2023-01-26 06:06:12",
      "employee_id": "c5ec....-ef8a-....-aa06-....4ef7....",
      "mgmt_user_detail": {
        "email": "agus.jangkrik@gmail.co.id",
        "name": "Agus Jangkrik Boss"
      },
      "previous_data": {
        "email": "kaffeinss888@gmail.com",
        "employee_phone": "93750279",
        "identification_number": "222",
        "name": "Kapein2"
      },
      "updated_data": {
        "email": "kaffeinss888@gmail.com",
        "employee_phone": "4982149",
        "identification_number": "222",
        "name": "Kapein2-ganti"
      }
    },
  ],
  "total": {}
}

const reportContent = [
  {
    date: '26 Jan 2023 15:02:23',
    type: 'Ganti Profil',
    previous_name: 'pa hanip',
    previous_identification_number: '',
    previous_email: 'anjay@mail.com',
    updated_name: 'Komandan Alib',
    updated_identification_number: '445566778899',
    updated_email: 'anjay@mail.com',
    user: 'ikbal',
    previous_employee_phone: '9892150890',
    updated_employee_phone: '5928304'
  },
  {
    date: '26 Jan 2023 14:22:30',
    type: 'Ganti Profil',
    previous_name: 'Kapein2-ganti-ke2',
    previous_identification_number: '222rr',
    previous_email: 'kaffeinss888@gmail.com',
    updated_name: 'Kapein2-ganti-ke3',
    updated_identification_number: '222rr',
    updated_email: 'kaffeinss888@gmail.com',
    user: 'Agus Jangkrik Boss',
    previous_employee_phone: '797501',
    updated_employee_phone: '5701279'
  },
  {
    date: '26 Jan 2023 13:41:18',
    type: 'Ganti Profil',
    previous_name: 'Kapein2-ganti-ke2',
    previous_identification_number: '222',
    previous_email: 'kaffeinss888@gmail.com',
    updated_name: 'Kapein2-ganti-ke2',
    updated_identification_number: '222rr',
    updated_email: 'kaffeinss888@gmail.com',
    user: 'Komandan Alib',
    previous_employee_phone: '',
    updated_employee_phone: '7975012'
  },
  {
    date: '26 Jan 2023 13:15:34',
    type: 'Ganti Profil',
    previous_name: 'Kapein2-ganti',
    previous_identification_number: '222',
    previous_email: 'kaffeinss888@gmail.com',
    updated_name: 'Kapein2-ganti-ke2',
    updated_identification_number: '222',
    updated_email: 'kaffeinss888@gmail.com',
    user: 'Agus Jangkrik Boss',
    previous_employee_phone: '',
    updated_employee_phone: '57912401'
  },
  {
    date: '26 Jan 2023 13:06:12',
    type: 'Ganti Profil',
    previous_name: 'Kapein2',
    previous_identification_number: '222',
    previous_email: 'kaffeinss888@gmail.com',
    updated_name: 'Kapein2-ganti',
    updated_identification_number: '222',
    updated_email: 'kaffeinss888@gmail.com',
    user: 'Agus Jangkrik Boss',
    previous_employee_phone: '93750279',
    updated_employee_phone: '4982149'
  }
]

const reportHeader = { "Tanggal": "date", "Jenis Administrasi": "type", "Nama (Lama)": "previous_name", "Nomor Identitas (Lama)": "previous_identification_number", "Email (Lama)": "previous_email", "Nama (Baru)": "updated_name", "Nomor Identitas (Baru)": "updated_identification_number", "Email (Baru)": "updated_email", "Petugas": "user" }

export { payloadGet, dataGetAdministrationReport, reportContent, reportHeader }