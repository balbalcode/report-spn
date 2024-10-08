function provider(index) {
  const list = [
      // {text: "STI", value: "STI"},
      {text: "MKP", value: "MKP"}
  ]
  return (isFinite(index)) ? list[index] : list
}

function status(key) {
  const object = {
    "QUEUE": "Menunggu antrian",
    "FINISHED": "Selesai",
    "FAILED": "Gagal"
  }
  return key ? object[key] : object
}

export { provider, status }