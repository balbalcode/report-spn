function type(index) {
    let list = [
        {value: "CARD", text: "Membership Kartu"},
        {value: "PLATE", text: "Membership Plat"},
    ]
    return (isFinite(index)) ? list[index] : list
}

function actions(index) {
    let list = [
        {text: "Tambah Membership", value: "form"},
        {text: "Cari Membership", value: "search"},
    ]
    return (isFinite(index)) ? list[index] : list
}

function filter_type(index) {
    let list = [
        {text: "Plat Nomor", value: "license_plate"},
        {text: "RF ID", value: "rf_id"},
        {text: "Nomor Kartu", value: "card_id"},
        {text: "Nama Pegawai/Pengguna", value: "employee_name"},
        {text: "Email", value: "email"},
        {text: "Nomor Identitas", value: "identification_number"},
    ]
    return (isFinite(index)) ? list[index] : list
}

function status(index) {
    let list = [
        {text: "Aktif", value: "Y"},
        {text: "Tidak Aktif", value: "N"}
    ]
    return (isFinite(index)) ? list[index] : list
}

function submission_status(index) {
    let list = [
        {text: "Menunggu", value: "WAITING_APPROVAL"},
        {text: "Disetujui", value: "APPROVED"},
        {text: "Ditolak", value: "DECLINED"}
    ]
    return (isFinite(index)) ? list[index] : list
}

function submission_status_map(index) {
    let list = {
        "WAITING_APPROVAL": "Menunggu",
        "APPROVED": "Disetujui",
        "DECLINED": "Tidak Disetujui"
    }
    return index ? list[index] : list
}

function payment_submission_status(index) {
    let list = [
        {text: "Sudah Dibayar", value: "PAID"},
        {text: "Belum Dibayar", value: "UNPAID"},
        {text: "Gagal Bayar", value: "EXPIRED"}
    ]
    return (isFinite(index)) ? list[index] : list
}


function payment_submission_status_map(index) {
    let list = {
        "PAID": "Sudah Dibayar", 
        "UNPAID": "Belum Dibayar", 
        "EXPIRED": "Gagal Bayar", 
    }
    return (isFinite(index)) ? list[index] : list
}

function search_key_submission(index) {
    let list = [
        {value: "license_plate", text: "Plat Nomor"},
        {value: "rfid", text: "RFID"},
        {value: "name", text: "Nama"},
        {value: "phone_number", text: "Telepon/ WA"},
    ]
    return (isFinite(index)) ? list[index] : list
}

export default {
    status, type, actions, filter_type, submission_status, submission_status_map, payment_submission_status, search_key_submission, payment_submission_status_map
}