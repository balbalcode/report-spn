function asset_types(index) {
  const list = [
    { text: "Foto / Gambar", value: "IMAGE" },
    { text: "Video", value: "VIDEO" },
  ]
  return (isFinite(index)) ? list[index] : list
}

function asset_types_map(key) {
  const map = {
    IMAGE: "Foto / Gambar",
    VIDEO: "Video"
  }
  return key ? map[key] : map
}

function layouts(index) {
  const list = [
    { text: "Tata Letak 1", value: "LO1" },
    { text: "Tata Letak 2", value: "LO2" },
    { text: "Tata Letak 3", value: "LO3" }
  ]
  return (isFinite(index)) ? list[index] : list
}

function layouts_map(key) {
  const map = {
    "LO1": {
      areas: { "A1": "Area 1", "A2": "Area 2", "A3": "Area 3", "A4": "Area 4" },
      class: "gap-x-5 flex-1 flex",
      children: [
        {
          class: "flex flex-col w-1/3 gap-y-5", children: [
            { class: "h-1/3", id: "A1", text: "Area 1" },
            { class: "flex-1", id: "A2", text: "Area 2" }
          ]
        },
        {
          class: "flex flex-col flex-1 gap-y-5", children: [
            { class: "flex-1", id: "A3", text: "Area 3" },
            { class: "h-1/3", id: "A4", text: "Area 4" }
          ]
        }
      ]
    },
    "LO2": {
      areas: { "A1": "Area 1", "A2": "Area 2", "A3": "Area 3" },
      class: "gap-x-5 flex-1 flex",
      children: [
        { class: "flex-1", id: "A1", text: "Area 1" },
        {
          class: "flex flex-col flex-1 gap-y-5", children: [
            { class: "flex-1", id: "A2", text: "Area 2" },
            { class: "flex-1", id: "A3", text: "Area 3" }
          ]
        }
      ]
    },
    "LO3": {
      areas: { "A1": "Area 1", "A2": "Area 2" },
      class: "gap-x-5 flex-1 flex",
      children: [
        { class: "w-1/4", id: "A1", text: "Area 1" },
        { class: "flex-1", id: "A2", text: "Area 2" }
      ]
    }
  }
  return key ? map[key] : map
}

function media_status(key) {
  const map = {
    ACTIVE: "Aktif",
    INACTIVE: "Tidak Aktif"
  }
  return key ? map[key] : map
}

function schedule_status(index) {
  const list = [
    { text: "Sedang Tampil", value: "SHOWING" },
    { text: "Akan Datang", value: "COMING_SOON" },
  ]
  return (isFinite(index)) ? list[index] : list
}

function visibility_types(index) {
  const list = [
    { text: "Default", value: "DEFAULT" },
    { text: "Terjadwal", value: "SCHEDULED" },
  ]
  return (isFinite(index)) ? list[index] : list
}

export { asset_types, asset_types_map, layouts, layouts_map, media_status, schedule_status, visibility_types }