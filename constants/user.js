function type(index) {
  let list = [
    { value: "O", text: "Operasional" },
    { value: "U", text: "User" },
    { value: "A", text: "Admin" },
    { value: "S", text: "Super Admin" },
    { value: "E", text: "Eksternal" },
    { value: "G", text: "Agen" },
    { value: "T", text: "Tamu" },
  ];
  return isFinite(index) ? list[index] : list;
}

function activity(index) {
  let list = [
    { value: "SPOT_CREATED", text: "Membuat Lokir" },
    { value: "SPOT_UPDATED", text: "Mengubah Lokir" },
    { value: "SPOT_DELETED", text: "Menghapus Lokir" },
    { value: "MEMBERSHIP_PRODUCT_CREATED", text: "Membuat Produk Membership" },
    { value: "MEMBERSHIP_PRODUCT_UPDATED", text: "Mengubah Produk Membership" },
    { value: "MEMBERSHIP_PRODUCT_DELETED", text: "Menghapus Produk Membership" },
    { value: "PRICE_CREATED", text: "Membuat Tarif" },
    { value: "PRICE_UPDATED", text: "Mengubah Tarif" },
    { value: "OFFICER_CREATED", text: "Membuat Petugas" },
    { value: "OFFICER_DELETED", text: "Menghapus Petugas" },
    { value: "MASTER_PRODUCT_CREATED", text: "Membuat Master Produk" },
    { value: "MASTER_PRODUCT_UPDATED", text: "Mengubah Master Produk" },
    { value: "MASTER_PRODUCT_DELETED", text: "Menghapus Master Produk" },
    { value: "OFFICER_REGISTRATION_APPROVED", text: "Menyetujui Pendaftaran Petugas" },
    { value: "OFFICER_REGISTRATION_REJECTED", text: "Menolak Pendaftaran Petugas" }
  ]
  return isFinite(index) ? list[index] : list;
}

export default {
  type,
  activity,
};
