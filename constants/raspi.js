function config_parts(index) {
  const list = [
    { text: "Camera CCTV", value: "cctv" },
    { text: "Raspberry GPIO ", value: "gpio" },
    { text: "Printer", value: "printer" },
    { text: "Barcode & RFID", value: "scanner" },
    { text: "Selection", value: "selection" },
    { text: "Monitoring Room", value: "monitoring_room" },
    { text: "Others", value: "others" },
  ];
  return isFinite(index) ? list[index] : list;
}

function gate_type(index) {
  const list = [
    { text: "Gate Keluar", value: "checkout" },
    { text: "Gate Masuk", value: "checkin" },
  ];
  return isFinite(index) ? list[index] : list;
}

function button_type(index) {
  const list = [
    { text: "Dispenser", value: "DISPENSER" },
    { text: "Manual", value: "MANUAL" },
  ];
  return isFinite(index) ? list[index] : list;
}

function rfid_type(index) {
  const list = [
    { text: "Mifare", value: "MIFARE" },
    { text: "Proximity", value: "PROXIMITY" },
  ];
  return isFinite(index) ? list[index] : list;
}

function card_mode(index) {
  const list = [
    { text: "Production", value: "PROD" },
    { text: "Development", value: "DEV" },
  ];
  return isFinite(index) ? list[index] : list;
}

function redis_host(index) {
  const list = [
    { text: "Local Host", value: "LOCAL" },
    { text: "IP Host", value: "IP" },
  ];
  return isFinite(index) ? list[index] : list;
}

function qprox_provider(index) {
  const list = [
    { text: "STI", value: "STI" },
    { text: "MKP", value: "MKP" },
  ];
  return isFinite(index) ? list[index] : list;
}

function general_status(key) {
  const object = {
    CONNECTED: true,
    DISCONNECTED: false,
  };
  return key ? object[key] : object;
}

function paper_printer_status(key) {
  const object = {
    ADEQUATE: "Kertas Tersedia",
    NO_PAPER: "Kertas Habis",
  };
  return key ? object[key] : object;
}

function status_raspi_durations() {
  let options = []
  for (let hours = 1; hours <= 10; hours++) {
    options.push({
      text: `${hours} jam terakhir`,
      value: `${hours}h`
    })
  }
  return options
}

function chart_status_options() {
  return {
    chart: {
      type: "bar",
    },
    noData: {
      text: "Data Kosong",
    },
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      show: false,
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeUTC: false
      }
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy HH:mm:ss",
      },
      y: {
        formatter: (v) => (v === 100 ? "Terhubung" : "Terputus"),
      }
    },
    grid: {
      show: false
    },
  };
}

function chart_stacked_group_options() {
  return {
    chart: {
      type: "bar",
      stacked: true,
    },
    noData: {
      text: "Data Kosong",
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeUTC: false
      }
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy HH:mm:ss",
      },
    },
    legend: {
      position: "top",
      verticalAlign: "left",
      horizontalAlign: "left"
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "100%"
      }
    }
  };
}

function chart_line_options() {
  return {
    chart: {
      type: "line",
    },
    noData: {
      text: "Data Kosong",
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeUTC: false
      }
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy HH:mm:ss",
      },
    },
    stroke: {
      width: 1.5,
      curve: "smooth"
    },
    legend: {
      position: "top",
      verticalAlign: "left",
      horizontalAlign: "left"
    },
  };
}

function empty_series(titles) {
  return titles.map(title => ({ name: title, data: [] }))
}

function status_series() {
  return [
    { key: "card_reader", title: "RFID Reader" },
    { key: "emoney", title: "QPROX" },
    { key: "scanner", title: "Scanner" },
    { key: "printer", title: "Printer" },
    { key: "host", title: "Raspi Host" },
    { key: "spnserver", title: "Koneksi API" }
  ]
}

function default_latest_data_raspi() {
  return {
    disk_total: "-",
    disk_usage: "-",
    disk_free: "-",
    ram_total: "-",
    ram_used: "-",
    ram_free: "-",
    ram_cache: "-",
    ram_available: "-",
    download_speed: "-",
    upload_speed: "-",
    ping: "-",
    temperature: "-",
    timestamp: ""
  }
}

function default_latest_active_raspi() {
  return {
    cameras: {},
    card_reader: "-",
    emoney: "-",
    host: "-",
    printer: "-",
    scanner: "-",
    spnserver: "-"
  }
}

function default_raspi_status() {
  return {
    camera: "",
    card_reader: "",
    date: "",
    disk: {},
    emoney: "",
    host: "",
    internet: {},
    machine_id: "",
    printer: "",
    ram: {},
    scanner: "",
    spot_id: "",
    temperature: "",
    timestamp: "",
  };
}

function voice_process(index) {
  const list = [
    { value: "POUT1", text: "Kendaraan Terdeteksi di Pintu Keluar" },
    { value: "POUT2", text: "Kendaraan Berhasil Melakukan Transaksi" },
    { value: "PIN1", text: "Kendaraan Terdeteksi di Pintu Masuk" },
    { value: "PIN2", text: "Kendaraan Berhasil Masuk" },
  ];
  return isFinite(index) ? list[index] : list;
}

export {
  config_parts,
  gate_type,
  button_type,
  rfid_type,
  card_mode,
  redis_host,
  qprox_provider,
  status_raspi_durations,
  chart_status_options,
  chart_stacked_group_options,
  chart_line_options,
  empty_series,
  status_series,
  default_latest_data_raspi,
  default_latest_active_raspi,
  general_status,
  paper_printer_status,
  default_raspi_status,
  voice_process,
};
