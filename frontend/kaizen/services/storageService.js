export function getKaizenData() {
  return JSON.parse(localStorage.getItem("kaizenData")) || [];
}

export function saveKaizenData(data) {
  localStorage.setItem("kaizenData", JSON.stringify(data));
}

export function clearEditMode() {
  localStorage.removeItem("editIndex");
  localStorage.removeItem("editData");
}
