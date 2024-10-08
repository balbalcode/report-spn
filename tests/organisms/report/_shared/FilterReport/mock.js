export const VEHICLE_RETURN = {
  mt: [
    {
      name: "mt-mocked-1",
      code: "mt-mocked-1",
      alias: "mt-mocked-1",
    },
  ],
  mb: [
    {
      name: "mb-mocked-1",
      code: "mb-mocked-1",
      alias: "mb-mocked-1",
    },
  ],
  kl: [
    {
      name: "kl-mocked-1",
      code: "kl-mocked-1",
      alias: "kl-mocked-1",
    },
  ],
};

export const FORMATTED_VEHICLE = [
  {
    text: "mt-mocked-1",
    value: "mt-mocked-1",
    alias: "mt-mocked-1",
  },
  {
    text: "mb-mocked-1",
    value: "mb-mocked-1",
    alias: "mb-mocked-1",
  },
  {
    text: "kl-mocked-1",
    value: "kl-mocked-1",
    alias: "kl-mocked-1",
  },
];

export const locationOptions = [
  { text: "Spot 1", value: "c80-1924m1c2-biqw" }
]

export const columnOptions = [
  { text: "Sebelas", value: 11 },
  { text: "Sepuluh", value: 10 },
  { text: "Sembilan", value: 9 }
]

export const payloadGetOfficer = {
  filter: [
    { key: "spot_id", value: "xxx-xxx-111" },
    { key: "data_type", value: "selectbox" },
    { key: "name", value: "udi" }
  ],
}

export const payloadGetUser = {
  filter: [
    { key: "spot_id", value: "xxx-xxx-222" },
    { key: "data_type", value: "selectbox" },
    { key: "name", value: "jav" }
  ],
}

export const superadminOptions = [
  { text: "Superadmin 1", value: 9 },
  { text: "Superadmin 2", value: 88 }
]

export const userOptions = [
  { text: "User 1", value: 5 },
  { text: "User 2", value: 2 }
]

export const userData = [
  { name: "User 1", id: 5 },
  { name: "User 2", id: 2 }
]

export const allUserOptions = [
  { text: "User 1", value: 5 },
  { text: "User 2", value: 2 },
  { text: "Superadmin 1", value: 9 },
  { text: "Superadmin 2", value: 88 }
]

export const exampleOptionLessThan10 = [
  { text: "Opt 1", value: 1 },
  { text: "Opt 2", value: 2 },
  { text: "Opt 3", value: 3 },
  { text: "Opt 4", value: 4 },
  { text: "Opt 5", value: 5 },
  { text: "Opt 6", value: 6 },
  { text: "Opt 7", value: 7 },
  { text: "Opt 8", value: 8 },
  { text: "Opt 9", value: 9 },
]

export const exampleOption10 = [
  ...exampleOptionLessThan10,
  { text: "Opt 10", value: 10 },
]

export const exampleOptionMoreThan10 = [
  ...exampleOption10,
  { text: "Opt 11", value: 11 },
]