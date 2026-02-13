import {
  saveKaizenToFirebase,
  updateKaizenById,
  getKaizenById
} from "./services/firebaseService.js";

import { saveKaizen } 
from "./usecases/saveKaizen.js";

document.addEventListener("DOMContentLoaded", () => {

  const timeBefore = document.getElementById("timeBefore");
  const timeAfter = document.getElementById("timeAfter");
  const timeSaved = document.getElementById("timeSaved");
  const timePercent = document.getElementById("timePercent");

  const costBefore = document.getElementById("costBefore");
  const costAfter = document.getElementById("costAfter");
  const costSaved = document.getElementById("costSaved");
  const costYear = document.getElementById("costYear");

  const photoBefore = document.getElementById("photoBefore");
  const photoAfter = document.getElementById("photoAfter");
  const previewBefore = document.getElementById("previewBefore");
  const previewAfter = document.getElementById("previewAfter");
const urlParams = new URLSearchParams(window.location.search);
const editId = urlParams.get("id");

if (editId) {
  const data = await getKaizenById(editId);

  document.getElementById("kaizenDateInput").value = data.date;
  document.getElementById("section").value = data.section;
  document.getElementById("judulKaizen").value = data.title;
  document.getElementById("timeBefore").value = data.timeBefore;
  document.getElementById("timeAfter").value = data.timeAfter;
  document.getElementById("costBefore").value = data.costBefore;
  document.getElementById("costAfter").value = data.costAfter;

  if (data.photoBefore)
    document.getElementById("previewBefore").src = data.photoBefore;

  if (data.photoAfter)
    document.getElementById("previewAfter").src = data.photoAfter;
}

  function previewImage(input, preview) {
    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = e => {
        preview.src = e.target.result;
        preview.style.display = "block";
      };
      reader.readAsDataURL(file);
    });
  }

  previewImage(photoBefore, previewBefore);
  previewImage(photoAfter, previewAfter);

  const timeChart = new Chart(document.getElementById("timeChart"), {
    type: "bar",
    data: {
      labels: ["Before", "After"],
      datasets: [{
        label: "Time (minutes)",
        data: [0, 0],
        backgroundColor: ["#e74c3c", "#27ae60"]
      }]
    },
    options: { responsive: true }
  });

  const costChart = new Chart(document.getElementById("costChart"), {
    type: "bar",
    data: {
      labels: ["Before", "After"],
      datasets: [{
        label: "Cost (Rp)",
        data: [0, 0],
        backgroundColor: ["#e74c3c", "#27ae60"]
      }]
    },
    options: { responsive: true }
  });

  function updateChart(tb, ta, cb, ca) {
    timeChart.data.datasets[0].data = [tb, ta];
    costChart.data.datasets[0].data = [cb, ca];
    timeChart.update();
    costChart.update();
  }

  function calculate() {
    const tb = parseFloat(timeBefore.value) || 0;
    const ta = parseFloat(timeAfter.value) || 0;
    const cb = parseFloat(costBefore.value) || 0;
    const ca = parseFloat(costAfter.value) || 0;

    const tSaved = tb - ta;
    const tPercent = tb > 0 ? ((tSaved / tb) * 100).toFixed(1) : 0;
    const cSaved = cb - ca;
    const cYear = cSaved * 12;

    timeSaved.textContent = tSaved;
    timePercent.textContent = tPercent;
    costSaved.textContent = cSaved.toLocaleString("id-ID");
    costYear.textContent = cYear.toLocaleString("id-ID");

    updateChart(tb, ta, cb, ca);
  }

  timeBefore.addEventListener("input", calculate);
  timeAfter.addEventListener("input", calculate);
  costBefore.addEventListener("input", calculate);
  costAfter.addEventListener("input", calculate);
});

window.saveKaizen = async function() {
  const newData = {
    date: document.getElementById("kaizenDateInput").value,
    section: document.getElementById("section").value,
    title: document.getElementById("judulKaizen").value,
    timeBefore: Number(document.getElementById("timeBefore").value),
    timeAfter: Number(document.getElementById("timeAfter").value),
    costBefore: Number(document.getElementById("costBefore").value),
    costAfter: Number(document.getElementById("costAfter").value),
    preparedBy: document.getElementById("preparedBy").value,
    approvedBy: document.getElementById("approvedBy").value,
    photoBefore: document.getElementById("previewBefore").src || "",
    photoAfter: document.getElementById("previewAfter").src || ""
  };

  await saveKaizen(newData);
};

window.goDashboard = function () {
  window.location.href = "./dashboard.html";
};
