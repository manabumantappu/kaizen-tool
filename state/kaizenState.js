<<<<<<< HEAD
import { resizeImage } from "../services/imageService.js";
import {
  getKaizenData,
  saveKaizenData,
  clearEditMode
} from "../services/storageService.js";

export async function saveKaizenUseCase(form) {
  if (!form.title.trim()) {
    alert("Judul Kaizen wajib diisi");
    return false;
  }

  let beforeImg = form.beforeImg || "";
  let afterImg  = form.afterImg  || "";

  if (beforeImg.startsWith("data:image")) {
    beforeImg = await resizeImage(beforeImg);
  } else beforeImg = "";

  if (afterImg.startsWith("data:image")) {
    afterImg = await resizeImage(afterImg);
  } else afterImg = "";

  const kaizen = {
    ...form,
    beforeImg,
    afterImg
  };

  const data = getKaizenData();
  const editIndex = localStorage.getItem("editIndex");

  if (editIndex !== null) {
    data[editIndex] = kaizen;
    clearEditMode();
  } else {
    data.push(kaizen);
  }

  saveKaizenData(data);
  return true;
}
=======
import { resizeImage } from "../services/imageService.js";
import {
  getKaizenData,
  saveKaizenData,
  clearEditMode
} from "../services/storageService.js";

export async function saveKaizenUseCase(form) {
  if (!form.title.trim()) {
    alert("Judul Kaizen wajib diisi");
    return false;
  }

  let beforeImg = form.beforeImg || "";
  let afterImg  = form.afterImg  || "";

  if (beforeImg.startsWith("data:image")) {
    beforeImg = await resizeImage(beforeImg);
  } else beforeImg = "";

  if (afterImg.startsWith("data:image")) {
    afterImg = await resizeImage(afterImg);
  } else afterImg = "";

  const kaizen = {
    ...form,
    beforeImg,
    afterImg
  };

  const data = getKaizenData();
  const editIndex = localStorage.getItem("editIndex");

  if (editIndex !== null) {
    data[editIndex] = kaizen;
    clearEditMode();
  } else {
    data.push(kaizen);
  }

  saveKaizenData(data);
  return true;
}
>>>>>>> 6d1a56fdff9fb21b535ce3daf202dc325d629f3b
