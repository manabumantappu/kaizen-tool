import { resizeImage } from "../services/imageService.js";
import { getKaizenData, saveKaizenData, clearEditMode } from "../services/storageService.js";

export async function saveKaizenUseCase(form) {
  if (!form.title.trim()) {
    alert("Judul Kaizen wajib diisi");
    return;
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
  id: form.id || crypto.randomUUID(),

  date: form.date,
  section: form.section,
  title: form.title,

  time: {
    before: form.timeBefore,
    after: form.timeAfter,
    saved: form.timeSaved
  },

  cost: {
    before: form.costBefore,
    after: form.costAfter,
    saved: form.costSaved,
    yearly: form.costSaved * 12
  },

  caption: {
    before: form.captionBefore,
    after: form.captionAfter
  },

  images: {
    before: beforeImg,
    after: afterImg
  },

  meta: {
    version: 2,
    updatedAt: new Date().toISOString()
  }
};
