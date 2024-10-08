import shopee_image from "~/static/payments/shopee.png"
import gopay_image from "~/static/payments/gopay.png"
import ovo_image from "~/static/payments/ovo.png"
import spinpay_image from "~/static/payments/spinpay.png"
import dana_image from "~/static/payments/dana.png"
import linkaja_image from "~/static/payments/linkaja.png"
import emoney_image from "~/static/payments/emoney.png"
import flazz_image from "~/static/payments/flazz.png"
import brizzi_image from "~/static/payments/brizzi.png"
import tapcash_image from "~/static/payments/tapcash.png"
import va_bca_image from "~/static/payments/va_bca.png"
import va_bni_image from "~/static/payments/va_bni.png"
import va_mandiri_image from "~/static/payments/va_mandiri.png"
import va_permata_image from "~/static/payments/va_permata.png"

function shift(index) {
    let list = [
        { value: -12, text: "12:00 hari sebelumnya" },
        { value: -11, text: "13:00 hari sebelumnya" },
        { value: -10, text: "14:00 hari sebelumnya" },
        { value: -9, text: "15:00 hari sebelumnya" },
        { value: -8, text: "16:00 hari sebelumnya" },
        { value: -7, text: "17:00 hari sebelumnya" },
        { value: -6, text: "18:00 hari sebelumnya" },
        { value: -5, text: "19:00 hari sebelumnya" },
        { value: -4, text: "20:00 hari sebelumnya" },
        { value: -3, text: "21:00 hari sebelumnya" },
        { value: -2, text: "22:00 hari sebelumnya" },
        { value: -1, text: "23:00 hari sebelumnya" },
        { value: 0, text: "00:00 hari ini" },
        { value: 1, text: "01:00 hari ini" },
        { value: 2, text: "02:00 hari ini" },
        { value: 3, text: "03:00 hari ini" },
        { value: 4, text: "04:00 hari ini" },
        { value: 5, text: "05:00 hari ini" },
        { value: 6, text: "06:00 hari ini" },
        { value: 7, text: "07:00 hari ini" },
        { value: 8, text: "08:00 hari ini" },
        { value: 9, text: "09:00 hari ini" },
        { value: 10, text: "10:00 hari ini" },
        { value: 11, text: "11:00 hari ini" },
        { value: 12, text: "12:00 hari ini" },
        { value: 13, text: "13:00 hari ini" },
        { value: 14, text: "14:00 hari ini" },
        { value: 15, text: "15:00 hari ini" },
        { value: 16, text: "16:00 hari ini" },
        { value: 17, text: "17:00 hari ini" },
        { value: 18, text: "18:00 hari ini" },
        { value: 19, text: "19:00 hari ini" },
        { value: 20, text: "20:00 hari ini" },
        { value: 21, text: "21:00 hari ini" },
        { value: 22, text: "22:00 hari ini" },
        { value: 23, text: "23:00 hari ini" },
        { value: 24, text: "00:00 hari esok" },
        { value: 25, text: "01:00 hari esok" },
        { value: 26, text: "02:00 hari esok" },
        { value: 27, text: "03:00 hari esok" },
        { value: 28, text: "04:00 hari esok" },
        { value: 29, text: "05:00 hari esok" },
        { value: 30, text: "06:00 hari esok" },
        { value: 31, text: "07:00 hari esok" },
        { value: 32, text: "08:00 hari esok" },
        { value: 33, text: "09:00 hari esok" },
        { value: 34, text: "10:00 hari esok" },
        { value: 35, text: "11:00 hari esok" },
        { value: 36, text: "12:00 hari esok" }
    ]
    return (isFinite(index)) ? list[index] : list
}

function price_type(index) {
    let list = [
        { text: 'Tarif Flat', value: 'FLAT' },
        { text: 'Tarif Progresif', value: 'PROGRESSIVE' },
        { text: 'Tarif Progresif Terbatas', value: 'LIMITED_PROGRESSIVE' },
        { text: 'Tarif per Periode', value: 'PERIOD' },
    ]
    return (isFinite(index)) ? list[index] : list
}


function feature(index) {
    let list = [
        {
            id: "auto-finish", text: "Selesai Otomatis", value: "AUTO_FINISH",
            icon: "bx-check-double", desc: "Transaksi akan selesai secara otomatis tanpa perlu konfirmasi manual"
        },
        {
            id: "gate", text: "Palang Parkir", value: "GATE",
            icon: "bxs-parking", desc: "Perangkat keras yang terdapat di setiap pintu masuk/keluar parkir"
        },
        {
            id: "short-flow-price", text: "Lewati Cek Harga", value: "SHORT_FLOW_PRICE",
            icon: "bx-credit-card-front", desc: "Proses pembayaran tanpa pengecekkan harga"
        },
        {
            id: "cashback", text: "Cashback", value: "CASHBACK",
            icon: "bx-wallet", desc: "Pengembalian uang (tunai / uang elektronik) setelah transaksi"
        },
        {
            id: "membership-expired-bill", text: "Tagihan Member Kadaluarsa", value: "MEMBERSHIP_EXPIRED",
            icon: "bx-receipt", desc: "Tagihan biaya parkir untuk member yang kadaluarsa (ada transaksi masuk)"
        },
        {
            id: "hide-on-app", text: "Sembunyikan dari Aplikasi", value: "HIDE_ON_APP",
            icon: "bx-hide", desc: "Lokasi tidak dapat dilihat di Aplikasi User",
        },
        {
            id: "input-license-number", text: "Input Nomor Plat", value: "INPUT_LICENSE_NUMBER",
            icon: "bx-rename", desc: "Input nomor plat dari aplikasi"
        },
        {
            id: "change-vehicle-code", text: "Transaksi Offline Aplikasi", value: "CHANGE_VEHICLE_CODE",
            icon: "bx-mobile-vibration", desc: "Transaksi dapat dilakukan secara offline di dalam aplikasi"
        },
        {
            id: "user-app-payment", text: "Aplikasi User", value: "USER_APP_CASUAL",
            icon: "bx-mobile", desc: "Aplikasi User untuk Pengguna Jasa Parkir (PJP)"
        },
        {
            id: "face-recognition", text: "Face Recognition", value: "FACE_RECOGNITION",
            icon: "bxs-face", desc: "Pemindaian wajah untuk absen petugas"
        },
        {
            id: "claim-ticket", text: "Klaim Tiket", value: "CLAIM_TICKET",
            icon: "bx-purchase-tag-alt", desc: "Klaim tiket fisik via aplikasi user untuk Pengguna Jasa Parkir (PJP)"
        },
        {
            id: "valet", text: "Valet Parking", value: "VALET_PARKING",
            icon: "bx-car", desc: "Layanan pemarkiran dan pengambilan kendaraan oleh petugas"
        },
        {
            id: "logout-shift", text: "Notif Akhir Shift", value: "LOGOUT_SHIFT",
            icon: "bx-alarm-exclamation", desc: "Notifikasi untuk petugas ketika shift berakhir"
        },
        {
            id: "lpr", text: "LPR", value: "LPR",
            icon: "bx-cctv", desc: "Lokasi memiliki fitur LPR untuk memprediksi plat nomor otomatis"
        },
    ]
    return (isFinite(index)) ? list[index] : list
}

function parking_type(index) {
    let list = [
        { text: 'Parkir Compact', value: 'COMPACT' },
        { text: 'Parkir Conventional', value: 'CONVENTIONAL' },
        { text: 'Parkir Manless', value: 'MANLESS' },
        { text: 'Parkir On Street', value: 'ONSTREET' },
        // { text: 'Parkir Cluster', value: 'CLUSTER' },
    ]
    return (isFinite(index)) ? list[index] : list
}

function timezone(index) {
    let list = [
        { text: 'WIB', value: 'Asia/Jakarta', code: "wib" },
        { text: 'WITA', value: 'Asia/Ujung_Pandang', code: "wita" },
        { text: 'WIT', value: 'Asia/Jayapura', code: "wit" },
    ]
    return (isFinite(index)) ? list[index] : list
}

function vehicle_status(index) {
    let list = [
        { text: "Aktif", value: "Y" },
        { text: "Tidak Aktif", value: "N" }
    ]
    return (isFinite(index)) ? list[index] : list
}

function spot_parts(index) {
    let list = [
        { value: "detail", text: "Detail Lokasi" },
        { value: "shift", text: "Shift dan Metode Pembayaran" },
        { value: "vehicle", text: "Jenis Kendaraan" },
    ]
    return (isFinite(index)) ? list[index] : list
}

function additional_information(index) {
    let list = [
        { name: "mdr", type: "PERCENTAGE", unit: "%", label: "MDR" },
        { name: "service_fee", type: "DECIMAL", label: "Service Fee" },
        { name: "late_limit", type: "MINUTES", unit: "menit", label: "Absence Rule" },
        { name: "offline_ip_port", type: "STRING", label: "Alamat IP & Port", placeholder: "Contoh: 127.0.0.1:8000" }
    ]
    return (isFinite(index)) ? list[index] : list
}

function membership_type(index) {
    let list = [
        { value: "LICENSE_PLATE", text: "Membership Plat Nomor" },
        { value: "CARD", text: "Membership Kartu" },
    ]
    return (isFinite(index)) ? list[index] : list
}

function location_category(index) {
    let list = [
        { value: "CONVENTIONAL", text: "Conventional" },
        { value: "GROWTH", text: "Growth" },
        { value: "ACCESS", text: "Access" },
        { value: "OTHER", text: "Other" },
        { value: "B2B", text: "B2B" },
    ]
    return (isFinite(index)) ? list[index] : list
}

function company_category(index) {
    let list = [
        { value: "SPN", text: "SPN" },
        { value: "MAYAPADA", text: "Mayapada" },
        { value: "ANTASENA", text: "Antasena" },
    ]
    return (isFinite(index)) ? list[index] : list
}

function payment_online(index) {
    let list = [
        { value: "GOPAY", image: gopay_image },
        { value: "SHOPEE", image: shopee_image },
        { value: "LINKAJA", image: linkaja_image },
    ]
    return (isFinite(index)) ? list[index] : list
}

function payment_offline(index) {
    let list = [
        { value: 'OFF_GOPAY', image: gopay_image },
        { value: 'OFF_OVO', image: ovo_image },
        { value: 'OFF_SPINPAY', image: spinpay_image },
        { value: 'OFF_SHOPEE', image: shopee_image },
        { value: 'OFF_DANA', image: dana_image },
        { value: 'OFF_LINKAJA', image: linkaja_image },
        { value: 'PAYMENT_FLAZZ', image: flazz_image },
        { value: 'PAYMENT_EMONEY', image: emoney_image },
        { value: 'PAYMENT_BRIZZI', image: brizzi_image },
        { value: 'PAYMENT_TAPCASH', image: tapcash_image },
        { value: 'VA_MANDIRI', image: va_mandiri_image },
        { value: 'VA_BCA', image: va_bca_image },
        { value: 'VA_PERMATA', image: va_permata_image },
        { value: 'VA_BNI', image: va_bni_image },
    ]
    return (isFinite(index)) ? list[index] : list
}

function payment_other(index) {
    let list = [
        { value: "MEMBERSHIP", text: "Membership" },
        { value: "GRACE_PERIOD", text: "Grace Period" },
        { value: "CASH", text: "Cash" },
        { value: "BANK_TRANSFER", text: "Bank Transfer" },
    ]
    return (isFinite(index)) ? list[index] : list
}

function default_payments() {
    return ["CASH", "GOPAY", "SHOPEE", "LINKAJA", "OFF_GOPAY", "OFF_OVO", "OFF_SPINPAY", "OFF_SHOPEE", "OFF_DANA", "OFF_LINKAJA", "PAYMENT_FLAZZ", "PAYMENT_EMONEY", "PAYMENT_TAPCASH"]
}

function vehicle_group(index) {
    let list = [
        { value: "mt", code: "MT", text: "Motor" },
        { value: "mb", code: "MB", text: "Mobil" },
        { value: "kl", code: "KL", text: "Lainnya" }
    ]
    return (isFinite(index)) ? list[index] : list
}

export default {
    shift,
    price_type,
    parking_type,
    timezone,
    feature,
    vehicle_status,
    spot_parts,
    additional_information,
    membership_type,
    location_category,
    payment_online,
    payment_offline,
    payment_other,
    vehicle_group,
    default_payments,
    company_category
}
