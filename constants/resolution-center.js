function finder_type(index) {
    let list = [
        { text: 'Log Finder', value: "true" },
        { text: 'Log Transaksi', value: "false" }
    ]
    return (isFinite(index)) ? list[index] : list
}

function search_by_type(index) {
    let list = [
        { text: 'Cari ID', value: 'id' },
        { text: 'Cari Plat', value: 'license' },
        { text: 'Cari Key', value: 'key' },
        { text: 'Cari RF ID', value: 'rfid' },
        { text: 'Cari E-Card', value: 'emoney' }
    ]
    return (isFinite(index)) ? list[index] : list
}

function transaction_status_type(index) {
    const list = [
        { value: "D", text: "Datang" },
        { value: "P", text: "Parkir" },
        { value: "M", text: "Permintaan Ambil" },
        { value: "A", text: "Sudah Bayar" },
        { value: "K", text: "Keluar" },
        { value: "X", text: "Bermasalah" },
    ]
    return (isFinite(index)) ? list[index] : list
}

function transaction_status(code) {
    const status = {
        "D": "Datang",
        "P": "Parkir",
        "M": "Permintaan Ambil",
        "A": "Sudah Bayar",
        "W": "Pengantaran",
        "VALET_PAYMENT": "Pembayaran",
        "K": "Keluar",
        "X": "Bermasalah",
    }
    return (status.hasOwnProperty(code)) ? status[code] : code ?? "-"
}

function log_status(code) {
    const status = {
        "D": "Masuk",
        "M": "Checkout",
        "P": "Metode Pembayaran",
        "U": "Ubah Metode Pembayaran",
        "A": "Bayar",
        "K": "Transaksi Selesai",
        "X": "Transaksi Finder Bermasalah",
        "F": "Tutup Paksa",
        "I": "Ubah Plat",
        "IM": "Ubah Plat Manless",
        "C": "Klaim Tiket",
        "S": "Send",
        "LB": "Bayar Saat Masuk",
        "DELETED": "Dihapus",
        "OVERNIGHT": "Inap"
    }
    return (status.hasOwnProperty(code)) ? status[code] : code ?? "-"
}

function reason_type(index) {
    let list = [
        {text: "Sistem Bermasalah", value: "SB"},
        {text: "Tiket Ganda", value: "TG"},
        {text: "Member", value: "M"},
        {text: "Ormas", value: "O"},
        {text: "Polisi/TNI", value: "PT"},
        {text: "Direksi/BM", value: "DB"},
        {text: "Perawatan Lokasi", value: "PL"},
        {text: "Lainnya", value: "X"},
    ]
    return (isFinite(index)) ? list[index] : list
}

function reason_map() {
    let map = {}
    const list = reason_type()
    list.forEach(type => {
        map[type.value] = type.text
    })
    return map
}

function image_parts(index) {
    const list = [
        { value: "image_url", text: "Pintu Masuk" },
        { value: "image_out_url", text: "Pintu Keluar" },
    ]
    return (isFinite(index)) ? list[index] : list
}

export default {
    finder_type,
    search_by_type,
    transaction_status_type,
    transaction_status,
    log_status,
    reason_type,
    reason_map,
    image_parts
}