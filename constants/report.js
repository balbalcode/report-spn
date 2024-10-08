function type(index) {
    let list = [
        {value: "CSV", text: "Download Excel"},
        {value: "PDF", text: "Download PDF"},
    ]
    return (isFinite(index)) ? list[index] : list
}

function attendance_status(key) {
    let map = {
        OT: "On Time",
        L: "Terlambat",
        EO: "Early Check Out"
    }
    return key ? map[key] : map
}

function attendance_report_header() {
    return {
        "Nama": "name",
        "ID": "officer_id",
        "Shift": "shift",
        "Waktu Check In": "timestamp",
        "Status In": "status_in",
        "Waktu Check Out": "timestamp_out",
        "Status Out": "status_out",
        "Durasi": "duration",
        "Foto Check In": "image_url",
        "Foto Check Out": "image_url_out",
    };
}

function vehicle_validation_report_header() {
    return {
      "Transaksi": "transaction_id",
      "Plat Nomor": "license_plate",
      "RF ID": "rf_id",
      "Kendaraan Member": "vehicle_code_member",
      "Kendaraan Masuk": "vehicle_code",
      "Kendaraan Keluar": "vehicle_code_out",
      "Status": "status",
      "Waktu Masuk Transaksi": "time_in",
      "Waktu Keluar Transaksi": "time_out",
      "Waktu Bayar": "paid_at",
      "Tarif": "amount"
    };
}

function income_column(index) {
    let list = [
        {value: "casual", text: "Casual"},
        {value: "member", text: "Membership"},
        {value: "stay", text: "Inap"},
        {value: "cashless", text: "Non Tunai"},
        {value: "lost_ticket", text: "Tiket Hilang"},
        {value: "administrative_charges", text: "Administratif"},
    ]
    return (isFinite(index)) ? list[index] : list
}

function quantity_column(index) {
    let list = [
        {value: "Casual", text: "Casual"},
        {value: "Membership", text: "Membership"},
        {value: "Inap", text: "Inap"},
        {value: "Non Tunai", text: "Non Tunai"},
    ]
    return (isFinite(index)) ? list[index] : list
}

function cashless_column(key) {
    let list = {
        OFF_LINKAJA: "Link Aja",
        LINKAJA: "Link Aja (ONLINE)",
        OFF_GOPAY: "Gopay",
        GOPAY: "Gopay (ONLINE)",
        OFF_SHOPEE: "Shopee Pay",
        SHOPEE: "Shopee Pay (ONLINE)",
        OFF_DANA: "DANA",
        OFF_OVO: "OVO",
        OFF_SPINPAY: "Spin Pay",
        EMONEY_BCA: "E-Money BCA",
        EMONEY_MANDIRI: "E-Money MANDIRI",
        EMONEY_BNI: "E-Money BNI",
        EMONEY_BRI: "E-Money BRI",
        EMONEY_LUMINOUS: "E-Money Luminous",
        QRIS: "QRIS",
    }
    return key ? list[key] : list
}

function membership_plate_report() {
    return {
        "Tanggal Aktivasi/Perpanjang": "date",
        "Nama": "employee_name",
        "No. HP": "user_phone_number",
        "No Polisi": "license_plate",
        "Periode": "period",
        "PJP Lama": "old_member",
        "PJP Baru": "new_member",
        "Produk": "product_name",
        "User": "mgmt_user_name",
        "Bukti Pembayaran": "payment_receipt",
        "Nominal": "amount"
    }
}

function membership_card_report() {
    return {
        "Tanggal Aktivasi/Perpanjang": "date",
        Nama: "employee_name",
        "No. HP": "user_phone_number",
        Identitas: "identification_number",
        "RF ID": "rf_id",
        "Plat Nomor 1": "license_plate",
        "Plat Nomor 2": "second_license_plate",
        "Nomor Kartu": "printed_id",
        Periode: "period",
        Lama: "old_member",
        Baru: "new_member",
        Produk: "product_name",
        User: "mgmt_user_name",
        Nominal: "amount",
        "Bukti Pembayaran": "payment_receipt",
    }
}

function administration_report_change_identity_header() {
    return {
        "Tanggal": "date",
        "Jenis Administrasi": "type",
        "Nama (Lama)": "previous_name",
        "Nomor Identitas (Lama)": "previous_identification_number",
        "Email (Lama)": "previous_email",
        "Nama (Baru)": "updated_name",
        "Nomor Identitas (Baru)": "updated_identification_number",
        "Email (Baru)": "updated_email",
        "Petugas": "user"
      }
}

function casual_income_column(key) {
    let list = {
        less_than_twelve: "Casual < 12 Jam",
        more_than_twelve: "Casual > 12 Jam",
        stay: "Inap"
    }
    return key ? list[key] : list
}

function casual_quantity_column(index) {
    let list = [
        {value: "Casual", text: "Casual"},
        {value: "Member", text: "Member"},
        {value: "Inap", text: "Inap"},
    ]
    return (isFinite(index)) ? list[index] : list
}

function problem_media(index) {
    let list = [
        { text: "Dashboard", value: "DASHBOARD" },
        { text: "Aplikasi Petugas", value: "OFFICER_APP" },
        { text: "Sistem", value: "SYSTEM" },
    ]
    return (isFinite(index)) ? list[index] : list
}

function problem_media_map(key) {
    let obj = {
        DASHBOARD: "Dashboard",
        OFFICER_APP: "Aplikasi Petugas",
        SYSTEM: "Sistem"
    }
    return (isFinite(key)) ? obj[key] : obj
}

function by_shift(index) {
    let list = [
        {value: "daily", text: "Report Harian"},
        {value: "shift", text: "Report Per Shift"},
    ]
    return (isFinite(index)) ? list[index] : list
}

function by_pos(index) {
    let list = [
        {value: "shift", text: "Report Per Shift"},
        // {value: "pos", text: "Report Per Pos"},
    ]
    return (isFinite(index)) ? list[index] : list
}

function lost_ticket_report_header() {
    return {
        "ID Transaksi": "transaction_id",
        "Plat": "license_plate",
        "Masuk": "time_in",
        "Keluar": "time_out",
        "Durasi": "total_hours",
        "Asal Transaksi": "submitter",
        "Nomor STNK": "stnk_number",
        "Foto STNK": "photo_url",
        "Jenis Kendaraan": "vehicle_code",
        "Tipe Denda": "fine_type",
        "Petugas": "officer_name",
        "Tarif Parkir": "parking_price",
        "Denda": "fine",
        "Tarif Inap": "overnight_price",
        "Total Bayar": "total_price",
    }
}

function problem_ticket_report_header() {
    return {
        "Waktu Tiket Dibuat": "time_in",
        "Waktu Ditandai Bermasalah (Sistem)": "time_out_system",
        "Waktu Ditandai Bermasalah (Manual)": "time_out_manual",
        "Shift": "shift",
        "ID Transaksi": "transaction_id",
        "Alasan": "reason",
        "Petugas": "officer_name",
        "Media": "media",
        "Nominal": "amount",
      }
}

function report_type(index) {
    let list = [
        {value: "daily", text: "Report Harian"},
        // {value: "pos", text: "Report Per Pos"},
        {value: "shift", text: "Report Per Shift"},
    ]
    return (isFinite(index)) ? list[index] : list
}

function administration_type(index) {
    let list = [
        {text: "Ganti Plat", value: "DATA_CHANGE"},
        {text: "Ganti Kartu", value: "LOST_CARD"},
        {text: "Ganti Profil", value: "IDENTITY_CHANGE"},
        {text: "Hapus Riwayat Member", value: "DELETE_MEMBERSHIP_HISTORY"},
        {text: "Hapus Member", value: "DELETE_MEMBERSHIP"},
        {text: "Ganti Periode", value: "CHANGE_PERIOD"},
    ]
    return (isFinite(index)) ? list[index] : list
}

function administration_report_header(member_type) {
    let member_header = member_type === "CARD" ? {
      "RF ID Lama": "previous_rf_id",
      "Nomor Kartu Lama": "previous_card_id",
      "Plat 1 Lama": "previous_license_plate",
      "Plat 2 Lama": "previous_second_license_plate",
      "RF ID Baru": "updated_rf_id",
      "Nomor Kartu Baru": "updated_card_id",
      "Plat 1 Baru": "updated_license_plate",
      "Plat 2 Baru": "updated_second_license_plate",
    } : member_type === "LICENSE_PLATE" ? {
      "Plat 1 Lama": "previous_license_plate",
      "Plat 2 Lama": "previous_second_license_plate",
      "Plat 3 Lama": "previous_third_license_plate",
      "Plat 1 Baru": "updated_license_plate",
      "Plat 2 Baru": "updated_second_license_plate",
      "Plat 3 Baru": "updated_third_license_plate",
    } : {}

    let header = {
      "Tanggal": "date",
      "Jenis Kendaraan": "vehicle_name",
      "Jenis Administrasi": "type",
      "Nama": "name",
      "Nomor Identitas": "identification_number",
      "Email": "email",
      ...member_header,
      "User Management": "user",
      "Catatan": "note",
      "Alasan Perubahan Harga": "reason",
      "Biaya": "amount"
    }
    return header
}

function leave_report_header() {
    return {
        "Nama": "officer_name",
        "ID Petugas": "officer_id",
        "Tipe Izin": "leave_type_text",
        "Tanggal Izin": "leave_range_date",
        "Durasi Izin (hari)": "leave_days",
        "Alasan": "leave_reason_text",
        "Foto Surat": "letter_image",
        "Status": "status_text",
        "Dicek oleh": "checker",
    }
}

function time_type(index) {
    let list = [
        {text: "Transaksi Masuk", value: "TIME_IN"},
        {text: "Transaksi Keluar", value: "TIME_OUT"},
    ]
    return (isFinite(index)) ? list[index] : list
}

function gate_type(index) {
    let list = [
        {text: "Masuk", value: "IN"},
        {text: "Keluar", value: "OUT"},
    ]
    return (isFinite(index)) ? list[index] : list
}

function period(index) {
    let list = [
        {text: "Harian", value: "daily"},
        {text: "Rentang tanggal", value: "date_range"},
    ]
    return (isFinite(index)) ? list[index] : list
}

function filter_transaction(index) {
    let list = [
        {text: "RFID", value: "rf_id"},
        {text: "Plat Nomor", value: "license_plate"},
        {text: "Membership", value: "product"},
        {text: "Tipe Kendaraan", value: "vehicle"},
    ]
    return (isFinite(index)) ? list[index] : list
}

function gate_open_fields() {
    return {
        "Tanggal": "date",
        "Hari": "day",
        "Waktu": "time",
        "Petugas": "officer_name",
        "Alasan": "reason",
        "Gambar": "image",
    }
}

function transaction_type(index) {
    let list = [
        {text: "Member", value: "MEMBER"},
        {text: "Non member", value: "NON_MEMBER"}
    ]
    return (isFinite(index)) ? list[index] : list
}

function settlement_type(index) {
    let list = [
        {value: "SETTLED", text: "Settled"},
        {value: "UNSETTLED", text: "Unsettled"},
        {value: "ALL", text: "Seluruh Transaksi"},
    ]
    return (isFinite(index)) ? list[index] : list
}

export default {
    type,
    attendance_status,
    attendance_report_header,
    vehicle_validation_report_header,
    lost_ticket_report_header,
    problem_ticket_report_header,
    time_type,
    gate_type,
    period,
    problem_media,
    problem_media_map,
    filter_transaction,
    income_column,
    quantity_column,
    cashless_column,
    membership_plate_report,
    membership_card_report,
    casual_income_column,
    casual_quantity_column,
    by_shift,
    by_pos,
    report_type,
    leave_report_header,
    administration_report_change_identity_header,
    administration_report_header,
    administration_type,
    gate_open_fields,
    transaction_type,
    settlement_type
}
