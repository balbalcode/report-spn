function month(index) {
    let list = [
        {value: "01", text: "Januari"},
        {value: "02", text: "Februari"},
        {value: "03", text: "Maret"},
        {value: "04", text: "April"},
        {value: "05", text: "Mei"},
        {value: "06", text: "Juni"},
        {value: "07", text: "Juli"},
        {value: "08", text: "Agustus"},
        {value: "09", text: "September"},
        {value: "10", text: "Oktober"},
        {value: "11", text: "November"},
        {value: "12", text: "Desember"}
    ]
    return (isFinite(index)) ? list[index] : list
}

function vehicle(index) {
    let list = [
        {value: "mt", text: "Motor"},
        {value: "mb", text: "Mobil"},
        {value: "kl", text: "Lainnya"}
    ]
    return (isFinite(index)) ? list[index] : list
}

function global_timezone(index) {
    let list = [
        {
            utc: 'UTC+7 - Asia/Jakarta',
            gmt: 'GMT+7 - Jakarta, Bangkok',
            local: 'Waktu Indonesia Bagian Barat',
            short_local : 'WIB',
            value: 'Asia/Jakarta'
        },
        {
            utc: 'UTC+8 - Asia/Ujung Pandang',
            gmt: 'GMT+8 - Hongkong, Singapore',
            local: 'Waktu Indonesia Bagian Tengah',
            short_local : 'WITA',
            value: 'Asia/Ujung_Pandang'
        },
        {
            utc: 'UTC+9 - Asia/Jayapura',
            gmt: 'GMT+9 - Tokyo, Osaka',
            local: 'Waktu Indonesia Bagian Timur',
            short_local : 'WIT',
            value: 'Asia/Jayapura'
        },
    ]
    return (isFinite(index)) ? list[index] : list
}


export default {
    month, vehicle, global_timezone
}
