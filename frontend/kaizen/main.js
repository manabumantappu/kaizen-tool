<<<<<<< HEAD
import { migrateKaizenDataIfNeeded } from "./services/migrationService.js";
import { bindPreview } from "./ui/previewUI.js";
import { saveKaizenUseCase } from "./usecases/saveKaizen.js";

/* ================= DOM READY ================= */
window.addEventListener("DOMContentLoaded", () => {

  /* ================= ELEMENT ================= */
  const sectionEl = document.getElementById("section");
  const judulKaizen = document.getElementById("judulKaizen");
  const kaizenDateInput = document.getElementById("kaizenDateInput");

  const timeBefore = document.getElementById("timeBefore");
  const timeAfter = document.getElementById("timeAfter");
  const costBefore = document.getElementById("costBefore");
  const costAfter = document.getElementById("costAfter");

  const timeSaved = document.getElementById("timeSaved");
  const timePercent = document.getElementById("timePercent");
  const costSaved = document.getElementById("costSaved");
  const costYear = document.getElementById("costYear");

  const captionBefore = document.getElementById("captionBefore");
  const captionAfter = document.getElementById("captionAfter");

  const previewBefore = document.getElementById("previewBefore");
  const previewAfter = document.getElementById("previewAfter");

  /* ================= MIGRATION ================= */
  migrateKaizenDataIfNeeded();

  /* ================= PREVIEW FOTO ================= */
  bindPreview("photoBefore", previewBefore);
  bindPreview("photoAfter", previewAfter);

  /* ================= HITUNG WAKTU ================= */
  function calculateTime() {
    const b = Number(timeBefore.value);
    const a = Number(timeAfter.value);

    if (b > 0 && a >= 0 && b >= a) {
      const saved = b - a;
      timeSaved.innerText = saved;
      timePercent.innerText = ((saved / b) * 100).toFixed(1);
    } else {
      timeSaved.innerText = "0";
      timePercent.innerText = "0";
    }
  }

  timeBefore.addEventListener("input", calculateTime);
  timeAfter.addEventListener("input", calculateTime);

  /* ================= HITUNG COST ================= */
  function calculateCost() {
    const b = Number(costBefore.value);
    const a = Number(costAfter.value);

    if (b > 0 && a >= 0 && b >= a) {
      const saved = b - a;
      costSaved.innerText = saved.toLocaleString("id-ID");
      costYear.innerText = (saved * 12).toLocaleString("id-ID");
    } else {
      costSaved.innerText = "0";
      costYear.innerText = "0";
    }
  }

  costBefore.addEventListener("input", calculateCost);
  costAfter.addEventListener("input", calculateCost);

  /* ================= SAVE ================= */
  window.saveKaizen = async () => {
    const ok = await saveKaizenUseCase({
      date: kaizenDateInput.value || new Date().toISOString(),
      section: sectionEl.value || "-",
      title: judulKaizen.value.trim(),

      timeBefore: Number(timeBefore.value) || 0,
      timeAfter: Number(timeAfter.value) || 0,
      timeSaved: Math.max(0, Number(timeBefore.value) - Number(timeAfter.value)),

      costBefore: Number(costBefore.value) || 0,
      costAfter: Number(costAfter.value) || 0,
      costSaved: Math.max(0, Number(costBefore.value) - Number(costAfter.value)),

      captionBefore: captionBefore.value || "-",
      captionAfter: captionAfter.value || "-",

      beforeImg: previewBefore.src || "",
      afterImg: previewAfter.src || ""
    });

    if (!ok) return;

    alert("Kaizen berhasil disimpan");
    window.location.href = "dashboard.html";
  };

});
=======
import { migrateKaizenDataIfNeeded } from "./services/migrationService.js";
import { bindPreview } from "./ui/previewUI.js";
import { saveKaizenUseCase } from "./usecases/saveKaizen.js";

/* ================= DOM READY ================= */
window.addEventListener("DOMContentLoaded", () => {

  /* ================= ELEMENT ================= */
  const sectionEl = document.getElementById("section");
  const judulKaizen = document.getElementById("judulKaizen");
  const kaizenDateInput = document.getElementById("kaizenDateInput");

  const timeBefore = document.getElementById("timeBefore");
  const timeAfter = document.getElementById("timeAfter");
  const costBefore = document.getElementById("costBefore");
  const costAfter = document.getElementById("costAfter");

  const timeSaved = document.getElementById("timeSaved");
  const timePercent = document.getElementById("timePercent");
  const costSaved = document.getElementById("costSaved");
  const costYear = document.getElementById("costYear");

  const captionBefore = document.getElementById("captionBefore");
  const captionAfter = document.getElementById("captionAfter");

  const previewBefore = document.getElementById("previewBefore");
  const previewAfter = document.getElementById("previewAfter");

  /* ================= MIGRATION ================= */
  migrateKaizenDataIfNeeded();

  /* ================= PREVIEW FOTO ================= */
  bindPreview("photoBefore", previewBefore);
  bindPreview("photoAfter", previewAfter);

  /* ================= HITUNG WAKTU ================= */
  function calculateTime() {
    const b = Number(timeBefore.value);
    const a = Number(timeAfter.value);

    if (b > 0 && a >= 0 && b >= a) {
      const saved = b - a;
      timeSaved.innerText = saved;
      timePercent.innerText = ((saved / b) * 100).toFixed(1);
    } else {
      timeSaved.innerText = "0";
      timePercent.innerText = "0";
    }
  }

  timeBefore.addEventListener("input", calculateTime);
  timeAfter.addEventListener("input", calculateTime);

  /* ================= HITUNG COST ================= */
  function calculateCost() {
    const b = Number(costBefore.value);
    const a = Number(costAfter.value);

    if (b > 0 && a >= 0 && b >= a) {
      const saved = b - a;
      costSaved.innerText = saved.toLocaleString("id-ID");
      costYear.innerText = (saved * 12).toLocaleString("id-ID");
    } else {
      costSaved.innerText = "0";
      costYear.innerText = "0";
    }
  }

  costBefore.addEventListener("input", calculateCost);
  costAfter.addEventListener("input", calculateCost);

  /* ================= SAVE ================= */
  window.saveKaizen = async () => {
    const ok = await saveKaizenUseCase({
      date: kaizenDateInput.value || new Date().toISOString(),
      section: sectionEl.value || "-",
      title: judulKaizen.value.trim(),

      timeBefore: Number(timeBefore.value) || 0,
      timeAfter: Number(timeAfter.value) || 0,
      timeSaved: Math.max(0, Number(timeBefore.value) - Number(timeAfter.value)),

      costBefore: Number(costBefore.value) || 0,
      costAfter: Number(costAfter.value) || 0,
      costSaved: Math.max(0, Number(costBefore.value) - Number(costAfter.value)),

      captionBefore: captionBefore.value || "-",
      captionAfter: captionAfter.value || "-",

      beforeImg: previewBefore.src || "",
      afterImg: previewAfter.src || ""
    });

    if (!ok) return;

    alert("Kaizen berhasil disimpan");
    window.location.href = "dashboard.html";
  };

});
>>>>>>> 6d1a56fdff9fb21b535ce3daf202dc325d629f3b
