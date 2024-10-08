export const spotId = "abc-123"

export const payloadRequestDownload = {
  spot_id: spotId,
  date_range: "2024-01-01_2024-01-03",
  vehicle: ["MT1", "MB1"],
  product: ["NON_MEMBER", "xxx-2"],
  emails: ["abc@abc.com"]
}

export const formRequestDownload = {
  date_range: ["2024-01-01", "2024-01-03"],
  vehicle: ["MT1", "MB1"],
  product: [
    { id: "NON_MEMBER", name: "Non-Member" },
    { id: "xxx-2", name: "Produk Dua", price: 3000, is_complimentary: false }
  ],
  emails: ["abc@abc.com"]
}

export const userData = {
  email: "abc@abc.com"
}

export const vehicleList = [
  { value: "MT1", text: "Motor" },
  { value: "MB1", text: "Mobil" }
]

export const productList = [
  { id: "xxx-1", name: "Produk Satu", price: 0, is_complimentary: true },
  { id: "xxx-2", name: "Produk Dua", price: 3000, is_complimentary: false },
]

export const productOptions = [
  { id: "NON_MEMBER", name: "Non-Member" },
  ...productList
]