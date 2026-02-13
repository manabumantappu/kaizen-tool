document.addEventListener("DOMContentLoaded", () => {

  // ================= STORAGE =================
  let data = JSON.parse(localStorage.getItem("kaizenList")) || [];

  let targetTime = Number(localStorage.getItem("targetTime")) || 20;
  let targetCost = Number(localStorage.getItem("targetCost")) || 300000;

  // ================= ELEMENT =================
  const tbody = document.querySelector("#kaizenTable tbody");
  const filterMonth = document.getElementById("filterMonth");
  const filterYear  = document.getElementById("filterYear");

  const totalKaizenEl = document.getElementById("totalKaizen");
  const totalTimeEl   = document.getElementById("totalTime");
  const totalCostEl   = document.getElementById("totalCost");

  const targetTimeInput = document.getElementById("targetTimeInput");
  const targetCostInput = document.getElementById("targetCostInput");

  let timeChart = null;
  let costChart = null;

  // ================= INIT TARGET INPUT =================
  if (targetTimeInput) targetTimeInput.value = targetTime;
  if (targetCostInput) targetCostInput.value = targetCost;

  window.updateTarget = function() {
    const tTime = Number(targetTimeInput.value);
    const tCost = Number(targetCostInput.value);

    if (tTime <= 0 || tCost <= 0) {
      alert("Target tidak valid!");
      return;
    }

    targetTime = tTime;
    targetCost = tCost;

    localStorage.setItem("targetTime", targetTime);
    localStorage.setItem("targetCost", targetCost);

    alert("Target berhasil diupdate!");
    render();
  };

  // ================= INIT YEAR FILTER =================
  const years = [...new Set(
    data
      .filter(k => k.date)
      .map(k => new Date(k.date).getFullYear())
  )];

  years.forEach(y => {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    filterYear.appendChild(opt);
  });

  // ================= RENDER =================
  function render() {

    data = JSON.parse(localStorage.getItem("kaizenList")) || [];

    const m = filterMonth.value;
    const y = filterYear.value;

    const filtered = data
      .map((k, idx) => ({ ...k, _idx: idx }))
      .filter(k => {
        if (!k.date) return false;
        const d = new Date(k.date);
        return (m === "all" || d.getMonth() + 1 == m) &&
               (y === "all" || d.getFullYear() == y);
      });

    tbody.innerHTML = "";

    let totalTime = 0;
    let totalCost = 0;

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9">Tidak ada data</td></tr>`;
    }

    filtered.forEach((k, i) => {

      const timeSaved = (k.timeBefore || 0) - (k.timeAfter || 0);
      const costSaved = (k.costBefore || 0) - (k.costAfter || 0);

      totalTime += timeSaved;
      totalCost += costSaved;

      tbody.innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${formatDate(k.date)}</td>
          <td>${k.section || "-"}</td>
          <td>${k.title || "-"}</td>
          <td>${k.timeBefore || 0} → ${k.timeAfter || 0}</td>
          <td>${timeSaved}</td>
          <td>Rp ${fmt(k.costBefore)} → Rp ${fmt(k.costAfter)}</td>
          <td>Rp ${fmt(costSaved)}</td>
          <td>
            <button onclick="showPhoto(${k._idx})">📷</button>
            <button onclick="editKaizen(${k._idx})">✏️</button>
            <button onclick="hapus(${k._idx})">🗑️</button>
          </td>
        </tr>
      `;
    });

    totalKaizenEl.innerText = filtered.length;
    totalTimeEl.innerText   = totalTime;
    totalCostEl.innerText   = fmt(totalCost);

    drawChart(totalTime, totalCost);
  }

  // ================= CHART =================
  function drawChart(totalTime, totalCost) {

    if (timeChart) timeChart.destroy();
    if (costChart) costChart.destroy();

    const corporateBlue = "#0a3d62";
    const targetGray = "#bdc3c7";

    // ===== TIME =====
    timeChart = new Chart(document.getElementById("timeChart"), {
      type: "bar",
      data: {
        labels: [""],
        datasets: [
          { label: "Target", data: [targetTime], backgroundColor: targetGray },
          { label: "Realisasi", data: [totalTime], backgroundColor: corporateBlue }
        ]
      },
      options: {
        responsive: true,
        layout: { padding: { top: 60 } },
        plugins: {
          title: {
            display: true,
            text: "Total Saving Waktu (Menit)",
            padding: { bottom: 40 }
          },
          legend: {
            position: "bottom"
          },
          datalabels: {
            anchor: "end",
            align: "end",
            font: { weight: "bold", size: 12 },
            color: "#000"
          }
        },
        scales: {
          y: { beginAtZero: true },
          x: { display: false }
        }
      },
      plugins: [ChartDataLabels]
    });

    // ===== COST =====
    costChart = new Chart(document.getElementById("costChart"), {
      type: "bar",
      data: {
        labels: [""],
        datasets: [
          { label: "Target", data: [targetCost], backgroundColor: targetGray },
          { label: "Realisasi", data: [totalCost], backgroundColor: corporateBlue }
        ]
      },
      options: {
        responsive: true,
        layout: { padding: { top: 60 } },
        plugins: {
          title: {
            display: true,
            text: "Total Saving Cost (Rp)",
            padding: { bottom: 40 }
          },
          legend: {
            position: "bottom"
          },
          datalabels: {
            anchor: "end",
            align: "end",
            font: { weight: "bold", size: 12 },
            formatter: value => "Rp " + value.toLocaleString("id-ID"),
            color: "#000"
          }
        },
        scales: {
          y: { beginAtZero: true },
          x: { display: false }
        }
      },
      plugins: [ChartDataLabels]
    });
  }

  // ================= ACTION =================
  window.editKaizen = function(i) {
    localStorage.setItem("editIndex", i);
    window.location.href = "index.html";
  };

  window.hapus = function(i) {
    if (!confirm("Hapus Kaizen?")) return;
    data.splice(i, 1);
    localStorage.setItem("kaizenList", JSON.stringify(data));
    render();
  };

  window.showPhoto = function(i) {
    const item = data[i];
    document.getElementById("modalBefore").src = item.photoBefore || "";
    document.getElementById("modalAfter").src  = item.photoAfter || "";
    document.getElementById("photoModal").style.display = "flex";
  };

  window.closeModal = function() {
    document.getElementById("photoModal").style.display = "none";
  };

  // ================= UTIL =================
  function fmt(n) {
    return (Number(n) || 0).toLocaleString("id-ID");
  }

  function formatDate(d) {
    return new Date(d).toLocaleDateString("id-ID");
  }

  filterMonth.onchange = render;
  filterYear.onchange  = render;

// set default filter ke all supaya semua data tampil
if (filterMonth) filterMonth.value = "all";
if (filterYear) filterYear.value = "all";

  render();
});
// ===== BACKUP =====
window.exportKaizenJSON = function () {

  const data = localStorage.getItem("kaizenList") || "[]";

  if (data === "[]") {
    alert("Belum ada data untuk dibackup!");
    return;
  }

  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "kaizen-backup.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
};


// ===== RESTORE =====
window.importKaizenJSON = function(event) {

  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    try {

      const importedData = JSON.parse(e.target.result);

      if (!Array.isArray(importedData)) {
        alert("Format JSON tidak valid!");
        return;
      }

      localStorage.setItem("kaizenList", JSON.stringify(importedData));

      alert("Data berhasil di-restore!");
      location.reload();

    } catch (err) {
      console.error(err);
      alert("Gagal membaca file JSON.");
    }
  };

  reader.readAsText(file);

  // reset input supaya bisa pilih file sama lagi
  event.target.value = "";
};
