export function app_types(index) {
  const list = [
    { value: "mgmt", text: "Management Dashboard" },
    { value: "finder", text: "Officer" },
    { value: "user", text: "PJP SoulParking" }
  ]
  return isFinite(index) ? list[index] : list
}

export function update_priority(index) {
  const list = [
    { value: 1, text: "Langsung Update" },
    { value: 2, text: "Normal" }
  ]
  return isFinite(index) ? list[index] : list
}

export function update_priority_map(key) {
  const object = {
    1: "Langsung Update",
    2: "Normal"
  }
  return isFinite(key) ? object[key] : object
}

export function app_types_map(key) {
  const object = {
    "mgmt": "Management Dashboard",
    "finder": "Officer",
    "user": "PJP SoulParking"
  }
  return isFinite(key) ? object[key] : object
}