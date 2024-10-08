function download_types(index) {
  let list = [
    { value: "CSV", text: "Download Excel" },
    // { value: "PDF", text: "Download PDF" },
  ]
  return (isFinite(index)) ? list[index] : list
}

function transaction_types(report = '', index) {
  const list = [
    { value: "casual", text: "Kasual" },
    { value: "cashier_product", text: "Produk Tambahan" },
    { value: "lost_ticket", text: "Tiket Hilang" },
    { value: "administration", text: "Administrasi" },
  ]
  if (report === 'quantity') list.splice(2, 0, { value: 'member', text: "Membership" })
  return (isFinite(index)) ? list[index] : list
}

function in_out_types(index) {
  const list = [
    { value: "in", text: "Masuk" },
    { value: "out", text: "Keluar" }
  ]
  return (isFinite(index)) ? list[index] : list
}

function app_cashless(index) {
  const list = [
    { value: "app_gopay", text: "Gopay" },
    { value: "app_shopeepay", text: "Shopee Pay" },
    { value: "app_linkaja", text: "Link Aja" }
  ]
  return (isFinite(index)) ? list[index] : list
}

function report_data_types(index) {
  const list = [
    { value: "income", text: "Pendapatan" },
    { value: "quantity", text: "Kuantitas" },
  ]
  return (isFinite(index)) ? list[index] : list
}

function emoney(index) {
  const list = [
    { value: "emoney_bri", text: "Brizzi" },
    { value: "emoney_bni", text: "Tap Cash" },
    { value: "emoney_mandiri", text: "E-Money" },
    { value: "emoney_bca", text: "Flazz" },
    { value: "emoney_luminous", text: "Luminous" }
  ]
  return (isFinite(index)) ? list[index] : list
}

function static_qris(index) {
  const list = [
    { value: "qris_ovo", text: "OVO" },
    { value: "qris_dana", text: "Dana" },
    { value: "qris_gopay", text: "Gopay" },
    { value: "qris_shopeepay", text: "Shopee Pay" },
    { value: "qris_linkaja", text: "Link Aja" },
    { value: "qris_spinpay", text: "Spin Pay" },
  ]
  return (isFinite(index)) ? list[index] : list
}

function payment_types(index) {
  const list = [
    { value: "cash", text: "Tunai" },
    { value: "app_gopay", text: "Gopay (Aplikasi)" },
    { value: "app_shopeepay", text: "Shopee Pay (Aplikasi)" },
    { value: "app_linkaja", text: "Link Aja (Aplikasi)" },
    { value: "emoney_bri", text: "Brizzi" },
    { value: "emoney_bni", text: "Tap Cash" },
    { value: "emoney_mandiri", text: "E-Money" },
    { value: "emoney_bca", text: "Flazz" },
    { value: "emoney_luminous", text: "Luminous" },
    { value: "qris_ovo", text: "OVO (QRIS Statis)" },
    { value: "qris_dana", text: "Dana (QRIS Statis)" },
    { value: "qris_gopay", text: "Gopay (QRIS Statis)" },
    { value: "qris_shopeepay", text: "Shopee Pay (QRIS Statis)" },
    { value: "qris_linkaja", text: "Link Aja (QRIS Statis)" },
    { value: "qris_spinpay", text: "Spin Pay (QRIS Statis)" },
    { value: "qris_dispenser", text: "QRIS Dinamis" },
  ]
  return (isFinite(index)) ? list[index] : list
}

function cashless_outlines(index) {
  const list = [
    { value: "app", text: "Aplikasi User" },
    { value: "emoney", text: "Uang Elektronik" },
    { value: "static_qris", text: "QRIS Statis" },
    { value: "qris_dispenser", text: "QRIS Dinamis" },
  ]
  return (isFinite(index)) ? list[index] : list
}

function payment_outlines(index) {
  const list = [
    { value: "cash", text: "Tunai" },
    ...cashless_outlines(),
  ]
  return (isFinite(index)) ? list[index] : list
}

function parking_access(index) {
  const list = [
    { value: "casual", text: "Kasual" },
    { value: "member", text: "Membership" }
  ]
  return (isFinite(index)) ? list[index] : list
}

function report_by_officer_heads() {
  return {
    Shift: "shift",
    Petugas: "officer",
    Kasual: "casual",
    "Tiket Hilang": "lost_ticket",
    Total: "total"
  }
}

export {
  download_types,
  transaction_types,
  in_out_types,
  emoney,
  app_cashless,
  report_data_types,
  static_qris,
  payment_types,
  cashless_outlines,
  payment_outlines,
  parking_access,
  report_by_officer_heads
}