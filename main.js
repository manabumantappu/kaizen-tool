import { saveKaizenToFirebase } 
from "./services/firebaseService.js";

document.addEventListener("DOMContentLoaded", () => {

  // ================= ELEMENT =================
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

  // ================= FOTO PREVIEW =================
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

  // ================= KALKULASI =================
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

  // ================= CHART =================
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

});

// ================= GLOBAL BUTTONS =================

window.generatePDF = function() {
  alert("PDF feature ready");
};

window.generatePPT = function() {
  alert("PPT feature ready");
};

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

  try {
    await saveKaizenToFirebase(newData);
    alert("Kaizen berhasil disimpan ke Firebase!");
    window.location.href = "./dashboard.html";
  } catch (error) {
    console.error(error);
    alert("Gagal menyimpan data!");
  }
};

window.goDashboard = function () {
  window.location.href = "./dashboard.html";
};
