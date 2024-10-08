export function form_types(index) {
  let list = [
    { value: "REQUEST", text: "Formulir Permintaan Barang" },
    { value: "TRANSFER", text: "Formulir Pengiriman Barang" },
  ]
  return (isFinite(index)) ? list[index] : list
}

export function form_types_filter(index) {
  let list = [
    ...form_types(),
    { value: "RECEIVE", text: "Formulir Penerimaan Barang" },
  ]
  return (isFinite(index)) ? list[index] : list
}

export function form_status(index) {
  let list = [
    { value: "CREATED", text: "Diajukan / Dikirim" },
    { value: "CONFIRMED", text: "Diterima" },
    { value: "CANCELED", text: "Dibatalkan" },
  ]
  return (isFinite(index)) ? list[index] : list
}

export function inventory_status(index) {
  let list = [
    { value: "USED", text: "Terpakai" },
    { value: "NOT_USED", text: "Tidak Terpakai" },
    { value: "BROKEN", text: "Rusak" },
    { value: "ON_THE_WAY", text: "Dikirim" },
  ]
  return (isFinite(index)) ? list[index] : list
}

export function inventory_status_map(key) {
  const object = {
    USED: "Terpakai",
    NOT_USED: "Tidak Terpakai",
    BROKEN: "Rusak",
    ON_THE_WAY: "Dikirim",
  }
  return key ? object[key] : object
}
