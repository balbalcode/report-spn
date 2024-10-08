export function product_types_map(key) {
  const object = {
    PARKING: { value: "PARKING", text: "Tarif Parkir", caption: "Tarif parkir dasar yang harus ditentukan pada lokasi parkir", icon: "ic-parking-circle", bundle: ["PARKING", "GRACE_PERIOD", "OVERSTAY"], color: "blue" },
    GRACE_PERIOD: { value: "GRACE_PERIOD", text: "Grace Period", caption: "Periode bebas biaya parkir dalam waktu tertentu", icon: "ic-calendar-salary", color: "cyan" },
    OVERSTAY: { value: "OVERSTAY", text: "Inap", caption: "Penambahan biaya jika melebihi waktu tertentu", icon: "ic-clock", color: "purple" },
    FREE: { value: "FREE", text: "Free", caption: "Bebas biaya parkir", icon: "ic-person-sign", color: "indigo" },
    LOST_TICKET: { value: "LOST_TICKET", text: "Tiket Hilang", caption: "Denda jika kehilangan tiket parkir", icon: "ic-receipt", color: "teal" },
    MEMBERSHIP: { value: "MEMBERSHIP", text: "Member Berbayar", caption: "Berlangganan parkir berbayar (hari, bulan, tahun)", icon: "ic-credit-card-02", bundle: ["MEMBERSHIP", "OVERSTAY"], color: "orange" },
    COMPLIMENT: { value: "COMPLIMENT", text: "Member Compliment", caption: "Berlangganan parkir tidak berbayar (hari, bulan, tahun)", icon: "ic-money-bill-wave-alt", bundle: ["COMPLIMENT", "OVERSTAY"], color: "pink" },
    ADMINISTRATIVE: { value: "ADMINISTRATIVE", text: "Administratif", caption: "Biaya perubahan data/ ganti kartu terkait member", icon: "ic-credit-card-buyer", color: "yellow" },
    VALET: { value: "VALET", text: "Valet", caption: "Tarif untuk layanan tambahan valet pada lokasi parkir", icon: "ic-parking-key", color: "green" },
  }
  return key ? object[key] : object
}

export function parking_product_types(index) {
  let list = [
    product_types_map("PARKING"),
    product_types_map("GRACE_PERIOD"),
    product_types_map("OVERSTAY"),
    product_types_map("FREE"),
    product_types_map("LOST_TICKET"),
  ]
  return (isFinite(index)) ? list[index] : list
}

export function membership_product_types(index) {
  let list = [
    product_types_map("MEMBERSHIP"),
    product_types_map("COMPLIMENT"),
    product_types_map("ADMINISTRATIVE"),
  ]
  return (isFinite(index)) ? list[index] : list
}

export function other_product_types(index) {
  let list = [
    product_types_map("VALET")
  ]
  return (isFinite(index)) ? list[index] : list
}

export function product_types(index) {
  let list = [
    product_types_map("PARKING"),
    product_types_map("MEMBERSHIP"),
    product_types_map("COMPLIMENT"),
    product_types_map("GRACE_PERIOD"),
    product_types_map("OVERSTAY"),
    product_types_map("FREE"),
    product_types_map("LOST_TICKET"),
    product_types_map("ADMINISTRATIVE"),
    product_types_map("VALET")
  ]
  return (isFinite(index)) ? list[index] : list
}

export function vehicle_types_map(key) {
  let obj = {
    "MT": { value: "MT", text: "Motor", icon: "ic-motorcycle" },
    "MB": { value: "MB", text: "Mobil", icon: "ic-car-01" },
    "MBX": { value: "MBX", text: "Mobil Box", icon: "ic-truck-01" },
    "TR": { value: "TR", text: "Truk", icon: "ic-truck-03" },
    "TX": { value: "TX", text: "Taksi", icon: "ic-taxi" },
    "SP": { value: "SP", text: "Sepeda", icon: "ic-bike" }
  }
  return key ? obj[key] : obj
}

export function vehicle_types(index) {
  let list = [
    vehicle_types_map("MT"),
    vehicle_types_map("MB"),
    vehicle_types_map("MBX"),
    vehicle_types_map("TR"),
    vehicle_types_map("TX"),
    vehicle_types_map("SP")
  ]
  return (isFinite(index)) ? list[index] : list
}

export function grace_period_source(index) {
  let list = [
    { value: "new", text: "Buat produk Grace Period" },
    { value: "existing", text: "Pilih produk Grace Period" },
  ]
  return (isFinite(index)) ? list[index] : list
}

export function overstay_source(index) {
  let list = [
    { value: "new", text: "Buat produk Inap" },
    { value: "existing", text: "Pilih produk Inap" },
  ]
  return (isFinite(index)) ? list[index] : list
}

export function overstay_parameter_map(key) {
  const object = {
    TIME: "Rentang Waktu",
    DURATION: "Durasi"
  }

  return key ? object[key] : object
}

export function fine_type_map(key) {
  const object = {
    FINE_ONLY: "Hanya bayar denda",
    PRICE_FINE: "Denda + tarif casual",
  }
  return key ? object[key] : object
}

export function parking_price_type(index) {
  let list = [
    { text: 'Tarif Flat', value: 'FLAT' },
    { text: 'Tarif Progresif', value: 'PROGRESSIVE' },
    { text: 'Tarif Progresif Terbatas', value: 'LIMITED_PROGRESSIVE' },
    { text: 'Tarif per Periode', value: 'PERIOD' },
  ]
  return (isFinite(index)) ? list[index] : list
}

export function parking_price_type_map(key) {
  let object = {
    FLAT: 'Tarif Flat',
    PROGRESSIVE: 'Tarif Progresif',
    LIMITED_PROGRESSIVE: 'Tarif Progresif Terbatas',
    PERIOD: 'Tarif per Periode',
  }
  return key ? object[key] : object
}

export function parking_count_type(index) {
  let list = [
    { text: "Pertambahan waktu", value: "INCREMENT" },
    { text: "Rentang waktu", value: "RANGE" },
  ]
  return (isFinite(index)) ? list[index] : list
}

export function parking_count_type_map(key) {
  let object = {
    INCREMENT: "Pertambahan waktu",
    RANGE: "Rentang waktu",
  }
  return key ? object[key] : object
}