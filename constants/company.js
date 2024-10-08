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

function search_type(index) {
    let list = [
        {text: "Plat Nomor", value: "license_plate"},
        {text: "Nama Pegawai/Pengguna", value: "employee_name"},
        {text: "Kartu RF ID", value: "rf_id"},
    ]
    return (isFinite(index)) ? list[index] : list
}

function status(index) {
    let list = [
        {value: "Y", text: "Aktif"},
        {value: "N", text: "Tidak Aktif"},
    ]
    return (isFinite(index)) ? list[index] : list
}


export default {
    type,
    status,
    actions,
    search_type,
}