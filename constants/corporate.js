function discount_type(index) {
  let list = [
    { text: "Persentase", value: "percentage" },
    { text: "Nominal", value: "amount" },
  ];
  return isFinite(index) ? list[index] : list;
}

function cut_off_transaction_date(index) {
  let list = [
    { value: "1", text: "Setiap tanggal 1" },
    { value: "3", text: "Setiap tanggal 3" },
    { value: "5", text: "Setiap tanggal 5" },
    { value: "10", text: "Setiap tanggal 10" },
    { value: "10", text: "Setiap tanggal 15" },
  ];
  return isFinite(index) ? list[index] : list;
}

function cut_off_period(index) {
  let list = [
    { value: "1", text: "Setiap bulan" },
    { value: "3", text: "Setiap 3 bulan" },
    { value: "5", text: "Setiap 5 bulan" },
    { value: "10", text: "Setiap 10 bulan" },
    { value: "12", text: "Setiap 1 tahun" },
    { value: "24", text: "Setiap 2 tahun" },
    { value: "36", text: "Setiap 3 tahun" },
  ];
  return isFinite(index) ? list[index] : list;
}

export default {
  discount_type,
  cut_off_transaction_date,
  cut_off_period,
};
