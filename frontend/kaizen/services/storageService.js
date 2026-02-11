<<<<<<< HEAD
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
=======
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
>>>>>>> 6d1a56fdff9fb21b535ce3daf202dc325d629f3b
