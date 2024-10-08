function type(index) {
  let list = [
    { text: "Petugas Parkir", value: "J", color: "#3538CD" },
    { text: "Petugas Kasir", value: "G", color: "#175CD3" },
    { text: "Petugas Cuci", value: "C", color: "#00cec9" },
    { text: "Petugas Hotel", value: "H", color: "#5925DC" },
    { text: "Petugas Monitoring", value: "M", color: "#363F72" },
    { text: "Supervisor", value: "V", color: "#FFBB34" },
    { text: "Petugas Valet", value: "A", color: "#C11574" },
  ];
  return isFinite(index) ? list[index] : list;
}

function type_map(key) {
  let list = {
    J: "Petugas Parkir",
    G: "Petugas Kasir",
    C: "Petugas Cuci",
    H: "Petugas Hotel",
    M: "Petugas Monitoring",
    V: "Supervisor",
    A: "Petugas Valet",
  };
  return key ? list[key] : list;
}

function leave_type(index) {
  let list = [
    { text: "Izin", value: "PERMISSION" },
    { text: "Cuti", value: "LEAVE" },
    { text: "Sakit", value: "SICK" },
  ];
  return isFinite(index) ? list[index] : list;
}

function leave_type_map(key) {
  let map = {
    PERMISSION: "Izin",
    LEAVE: "Cuti",
    SICK: "Sakit",
  };
  return key ? map[key] : map;
}

function leave_reason(index) {
    let list = [
        { text: "Keluarga", value: "FAMILY", type: "PERMISSION" },
        { text: "Keluarga Meninggal", value: "FUNERAL", type: "LEAVE" },
        { text: "Menikah", value: "WEDDING", type: "LEAVE" },
        { text: "Istri Melahirkan", value: "BIRTH", type: "LEAVE" },
        { text: "Tahunan", value: "ANNUAL", type: "LEAVE" },
    ]
    return isFinite(index) ? list[index] : list
}

function leave_reason_map(key) {
  let map = {
    FUNERAL: "Keluarga Meninggal",
    WEDDING: "Menikah",
    BIRTH: "Istri Melahirkan",
    ANNUAL: "Tahunan",
    FAMILY: "Keluarga",
  };
  return key ? map[key] : map;
}

function actions(index) {
  let list = [
    { text: "Undang Petugas", value: "invite" },
    { text: "Tambah Petugas", value: "create" },
  ];
  return isFinite(index) ? list[index] : list;
}

function status(index) {
  let list = [
    { text: "Aktif", value: true },
    { text: "Tidak Aktif", value: false },
  ];
  return isFinite(index) ? list[index] : list;
}

function status_registration(index) {
  let list = [
    { text: "Menunggu", value: "0_PENDING", variant: "primary" },
    { text: "Disetujui", value: "1_APPROVED", variant: "success" },
    { text: "Ditolak", value: "2_REJECTED", variant: "danger" },
  ];
  return isFinite(index) ? list[index] : list;
}

function search_by(index) {
  let list = [
    { text: "Nama Petugas", value: "name" },
    { text: "Username", value: "username" },
    { text: "Telepon", value: "phone" },
    { text: "Email", value: "email" },
  ];
  return isFinite(index) ? list[index] : list;
}

function officer_parts(index) {
  let list = [
    { value: "detail", text: "Detail Profil" },
    { value: "account", text: "Akun Aplikasi Petugas" },
  ];
  return isFinite(index) ? list[index] : list;
}

function marital_status(index) {
  let list = [
    { value: "TK", text: "TK" },
    { value: "K", text: "K" },
    { value: "K1", text: "K1" },
    { value: "K2", text: "K2" },
    { value: "K3", text: "K3" },
    { value: "TK1", text: "TK1" },
    { value: "TK2", text: "TK2" },
    { value: "TK3", text: "TK3" },
  ];
  return isFinite(index) ? list[index] : list;
}

function emergency_contact_relation(index) {
  let list = [
    { value: "Ayah", text: "Ayah" },
    { value: "Ibu", text: "Ibu" },
    { value: "Istri", text: "Istri" },
    { value: "Suami", text: "Suami" },
    { value: "Saudara", text: "Saudara" },
  ];
  return isFinite(index) ? list[index] : list;
}

export default {
  leave_type,
  leave_type_map,
  leave_reason,
  leave_reason_map,
  type,
  type_map,
  actions,
  status,
  status_registration,
  search_by,
  officer_parts,
  marital_status,
  emergency_contact_relation,
};
