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

  // ================= EDIT MODE =================
  const editIndex = localStorage.getItem("editIndex");
  const editIdx = editIndex !== null ? Number(editIndex) : null;

  if (editIdx !== null) {
    const data = JSON.parse(localStorage.getItem("kaizenList")) || [];
    const item = data[editIdx];

    if (item) {
      document.getElementById("kaizenDateInput").value = item.date || "";
      document.getElementById("section").value = item.section || "";
      document.getElementById("judulKaizen").value = item.title || "";
      timeBefore.value = item.timeBefore || 0;
      timeAfter.value = item.timeAfter || 0;
      costBefore.value = item.costBefore || 0;
      costAfter.value = item.costAfter || 0;

      if (item.photoBefore) {
        previewBefore.src = item.photoBefore;
        previewBefore.style.display = "block";
      }

      if (item.photoAfter) {
        previewAfter.src = item.photoAfter;
        previewAfter.style.display = "block";
      }

      calculate(); // update grafik saat edit
    }
  }

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
  const timeChartCtx = document.getElementById("timeChart");
  const costChartCtx = document.getElementById("costChart");

  const timeChart = new Chart(timeChartCtx, {
    type: "bar",
    data: {
      labels: ["Before", "After"],
      datasets: [{
        label: "Time (minutes)",
        data: [0, 0],
        backgroundColor: ["#e74c3c", "#27ae60"]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });

  const costChart = new Chart(costChartCtx, {
    type: "bar",
    data: {
      labels: ["Before", "After"],
      datasets: [{
        label: "Cost (Rp)",
        data: [0, 0],
        backgroundColor: ["#e74c3c", "#27ae60"]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
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
  alert("PDF feature ready (integrate jsPDF logic here)");
};

window.generatePPT = function() {
  alert("PPT feature ready (integrate PptxGenJS logic here)");
};

window.saveKaizen = function() {

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

  let kaizenList = JSON.parse(localStorage.getItem("kaizenList")) || [];

  const editIndex = localStorage.getItem("editIndex");
  const editIdx = editIndex !== null ? Number(editIndex) : null;

  if (editIdx !== null) {
    kaizenList[editIdx] = newData;
    localStorage.removeItem("editIndex");
    alert("Kaizen berhasil diupdate!");
  } else {
    kaizenList.push(newData);
    alert("Kaizen berhasil disimpan!");
  }

  localStorage.setItem("kaizenList", JSON.stringify(kaizenList));

  window.location.reload();
};

window.goDashboard = function () {
  window.location.href = "dashboard.html";
};
