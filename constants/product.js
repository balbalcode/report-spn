function deadline(index) {
    let list = [
        {value: 0, text: "Tidak diatur"},
        {value: 1, text: "1 hari setelah expired"},
        {value: 2, text: "2 hari setelah expired"},
        {value: 3, text: "3 hari setelah expired"},
        {value: 5, text: "5 hari setelah expired"},
        {value: 7, text: "Seminggu setelah expired"}
    ]
    return (isFinite(index)) ? list[index] : list
}

function period(index) {
    let list = [
        {value: "10-minute", text: "10 Menit"},
        {value: "20-minute", text: "20 Menit"},
        {value: "30-minute", text: "30 Menit"},
        {value: "1-hour", text: "1 Jam"},
        {value: "2-hour", text: "2 Jam"},
        {value: "3-hour", text: "3 Jam"},
        {value: "1-day", text: "1 Hari"},
        {value: "2-day", text: "2 Hari"},
        {value: "3-day", text: "3 Hari"},
        {value: "31-day", text: "1 Bulan (31 Hari)"},
        {value: "62-day", text: "2 Bulan (62 Hari)"},
        {value: "93-day", text: "3 Bulan (93 Hari)"},
        {value: "186-day", text: "6 Bulan (186 Hari)"},
        {value: "365-day", text: "12 Bulan (365 Hari)"},
        {value: "7-day", text: "1 Minggu"},
        {value: "1-month", text: "1 Bulan"},
        {value: "2-month", text: "2 Bulan"},
        {value: "3-month", text: "3 Bulan"},
        {value: "4-month", text: "4 Bulan"},
        {value: "5-month", text: "5 Bulan"},
        {value: "6-month", text: "6 Bulan"},
        {value: "7-month", text: "7 Bulan"},
        {value: "8-month", text: "8 Bulan"},
        {value: "9-month", text: "9 Bulan"},
        {value: "10-month", text: "10 Bulan"},
        {value: "11-month", text: "11 Bulan"},
        {value: "1-year", text: "1 Tahun"},
        {value: "1-daily_later", text: "Pembayaran Khusus"},
    ]
    return (isFinite(index)) ? list[index] : list
}

function start(index) {
    let list = [
        {value: "DIRECT_ACTIVATION", text: "Setiap hari/Langsung aktif"},
        {value: "FIRST_DAY_OF_MONTH", text: "Setiap tanggal 1 tiap bulan"},
        {value: "MIDDLE_DAY_OF_MONTH", text: "Setiap tanggal 15 tiap bulan"},
        {value: "LAST_DAY_OF_MONTH", text: "Setiap akhir bulan"},
    ]
    return (isFinite(index)) ? list[index] : list
}


function product_type(index) {
    let list = [
        {value: "PARKING", text: "Parkir", caption: "Tarif parkir dasar yang harus ditentukan pada lokasi parkir", icon: "bx bx-dollar-circle"},
        {value: "MEMBERSHIP", text: "Member", caption: "Biaya subscibe atau langganan parkir pada lokasi parkir", icon: "bx bx-id-card"},
        {value: "VALET", text: "Valet" , caption: "Tarif untuk layanan tambahan valet pada lokasi parkir", icon: "bx bxs-parking"},
        {value: "OVERSTAY", text: "Inap", caption: "Denda inap bagi kendaraan yang melebihi batas waktu parkir", icon: " bx bx-time"},
        {value: "CHANGE_CARD", text: "Kartu Member", caption: "Tarif perubahan kartu meliputi hilang kartu dan update data", icon: "bx bx-id-card"},
        {value: "CHANGE_PLATE", text: "Plat Member", caption: "Tarif perubahan plat member untuk merubah atau menambah plat", icon: "bx bx-info-square"},
        {value: "LOST_TICKET", text: "Tiket Hilang", caption: "Tarif berupa Denda atau penalti apabila PJP menghilangkan tiket", icon: "bx bx-bolt-circle"},
    ]
    return (isFinite(index)) ? list[index] : list
}

function vehicle_type(index) {
    let list = [
        {value: "MT", text: "Motor", icon: "bx bx-cycling"},
        {value: "MB", text: "Mobil", icon: "bx bx-car"},
        {value: "KL", text: "Lainnya", icon: "bx bx-anchor"}
    ]
    return (isFinite(index)) ? list[index] : list
}

function pane(index) {
    let list = [
        {value: "ip", text: "Informasi Produk", icon: "bx bx-error-circle", caption: "Masukkan berupa nama produk, jenis tarif dsb"},
        {value: "dp", text: "Detail Produk", icon: "bx bx-pencil", caption: "Masukkan berupa tarif atau biaya secara detail"},
    ]
    return (isFinite(index)) ? list[index] : list
}

function hour_start(index) {
    let list = [
        {value: "START_DAY", text: "Awal Hari (00:00 WIB/WITA/WIT)"},
        {value: "CURRENT_HOUR", text: "Sesuai Jam Terdaftar"},
    ]
    return (isFinite(index)) ? list[index] : list
}

export default {
    deadline,
    period,
    start,
    product_type,
    vehicle_type,
    pane,
    hour_start
}