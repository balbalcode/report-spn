function type(index) {
    let list = [
        {text: 'Tarif Flat', value: 'FLAT'},
        {text: 'Tarif Progresif', value: 'PROGRESSIVE'},
        {text: 'Tarif Progresif Terbatas', value: 'LIMITED_PROGRESSIVE'},
        {text: 'Tarif per Periode', value: 'PERIOD'},
    ]
    return (isFinite(index)) ? list[index] : list
}

function fine_type(index) {
    const list = [
        { text: "Hanya bayar denda", value: "FINE_ONLY" },
        { text: "Denda + tarif casual", value: "PRICE_FINE" }
    ]
    return (isFinite(index)) ? list[index] : list
}

function fine_type_map(key) {
    const object = {
        FINE_ONLY: "Hanya bayar denda",
        PRICE_FINE: "Denda + tarif casual",
    }
    return key ? object[key] : object
}

function overstay_parameter(index) {
    let list = [
        { text: "Durasi", value: "DURATION" },
        { text: "Rentang Waktu", value: "TIME" },
    ]
    return (isFinite(index)) ? list[index] : list
}

function overstay_duration(index) {
    let list = [
        {value: 6, text: "6 Jam"},
        {value: 8, text: "8 Jam"},
        {value: 10, text: "10 Jam"},
        {value: 12, text: "12 Jam"},
        {value: 16, text: "16 Jam"},
        {value: 18, text: "18 Jam"},
        {value: 20, text: "20 Jam"},
        {value: 24, text: "24 Jam"},
    ]
    return (isFinite(index)) ? list[index] : list
}

function overstay_affected_user(index) {
    let list = [
        { text: "Semua kendaraan", value: "ALL", desc: "Tarif inap berlaku untuk semua pengguna jasa parkir" },
        { text: "Kendaraan member", value: "MEMBER", desc: "Tarif inap berlaku untuk semua member terdaftar" },
        { text: "Kendaraan non member", value: "NON_MEMBER", desc: "Tarif inap berlaku untuk pengguna jasa parkir non member" },
    ]
    return (isFinite(index)) ? list[index] : list
}

function count(index) {
    let list = [
        {text: "Pertambahan waktu", value: "INCREMENT"},
        {text: "Rentang waktu", value: "RANGE"},
    ]
    return (isFinite(index)) ? list[index] : list
}

function max_time(index) {
    let list = [
        {text: "0 Jam", value: 0},
        {text: "12 Jam", value: 12},
        {text: "24 Jam", value: 24},
    ]
    return (isFinite(index)) ? list[index] : list
}

function time_dynamic_price(index) {
    let list = [
        {value: 0, text: "00:00 hari ini"},
        {value: 1, text: "01:00 hari ini"},
        {value: 2, text: "02:00 hari ini"},
        {value: 3, text: "03:00 hari ini"},
        {value: 4, text: "04:00 hari ini"},
        {value: 5, text: "05:00 hari ini"},
        {value: 6, text: "06:00 hari ini"},
        {value: 7, text: "07:00 hari ini"},
        {value: 8, text: "08:00 hari ini"},
        {value: 9, text: "09:00 hari ini"},
        {value: 10, text: "10:00 hari ini"},
        {value: 11, text: "11:00 hari ini"},
        {value: 12, text: "12:00 hari ini"},
        {value: 13, text: "13:00 hari ini"},
        {value: 14, text: "14:00 hari ini"},
        {value: 15, text: "15:00 hari ini"},
        {value: 16, text: "16:00 hari ini"},
        {value: 17, text: "17:00 hari ini"},
        {value: 18, text: "18:00 hari ini"},
        {value: 19, text: "19:00 hari ini"},
        {value: 20, text: "20:00 hari ini"},
        {value: 21, text: "21:00 hari ini"},
        {value: 22, text: "22:00 hari ini"},
        {value: 23, text: "23:00 hari ini"},
        {value: 24, text: "00:00 hari esok"},
        {value: 25, text: "01:00 hari esok"},
        {value: 26, text: "02:00 hari esok"},
        {value: 27, text: "03:00 hari esok"},
        {value: 28, text: "04:00 hari esok"},
        {value: 29, text: "05:00 hari esok"},
        {value: 30, text: "06:00 hari esok"},
        {value: 31, text: "07:00 hari esok"},
        {value: 32, text: "08:00 hari esok"},
        {value: 33, text: "09:00 hari esok"},
        {value: 34, text: "10:00 hari esok"},
        {value: 35, text: "11:00 hari esok"},
        {value: 36, text: "12:00 hari esok"},
        {value: 37, text: "13:00 hari esok"},
        {value: 38, text: "14:00 hari esok"},
        {value: 39, text: "15:00 hari esok"},
        {value: 40, text: "16:00 hari esok"},
        {value: 41, text: "17:00 hari esok"},
        {value: 42, text: "18:00 hari esok"},
        {value: 43, text: "19:00 hari esok"},
        {value: 44, text: "20:00 hari esok"},
        {value: 45, text: "21:00 hari esok"},
        {value: 46, text: "22:00 hari esok"},
        {value: 47, text: "23:00 hari esok"}
    ]
    return (isFinite(index)) ? list[index] : list
}

export default {
    type,
    fine_type,
    fine_type_map,
    overstay_parameter,
    overstay_duration,
    overstay_affected_user,
    count,
    max_time,
    time_dynamic_price
}