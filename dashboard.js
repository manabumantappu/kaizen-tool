import {
  getAllKaizens,
  deleteKaizenById
} from "./services/firebaseService.js";

document.addEventListener("DOMContentLoaded", async () => {

  const tbody = document.querySelector("#kaizenTable tbody");
  const filterMonth = document.getElementById("filterMonth");
  const filterYear = document.getElementById("filterYear");

  const totalKaizenEl = document.getElementById("totalKaizen");
  const totalTimeEl = document.getElementById("totalTime");
  const totalCostEl = document.getElementById("totalCost");

const targetTimeInput = document.getElementById("targetTimeInput");
const targetCostInput = document.getElementById("targetCostInput");

let targetTime = Number(localStorage.getItem("targetTime")) || 0;
let targetCost = Number(localStorage.getItem("targetCost")) || 0;

if (targetTimeInput) targetTimeInput.value = targetTime;
if (targetCostInput) targetCostInput.value = targetCost;

  const modal = document.getElementById("photoModal");
  const modalBefore = document.getElementById("modalBefore");
  const modalAfter = document.getElementById("modalAfter");

  let data = [];
  let timeChart, costChart;

  // ================= LOAD DATA =================
 window.loadData = async function() {
    data = await getAllKaizens();
    initYearFilter();
    render();
  }

  // ================= INIT YEAR FILTER =================
  function initYearFilter() {

    const years = [...new Set(
      data.map(k => new Date(k.date).getFullYear())
    )];

    filterYear.innerHTML =
      `<option value="all">Semua Tahun</option>`;

    years.forEach(y => {
      const opt = document.createElement("option");
      opt.value = y;
      opt.textContent = y;
      filterYear.appendChild(opt);
    });
  }

  // ================= RENDER =================
  function render() {

    const m = filterMonth.value;
    const y = filterYear.value;

    const filtered = data.filter(k => {
      const d = new Date(k.date);
      return (m === "all" || d.getMonth() + 1 == m) &&
             (y === "all" || d.getFullYear() == y);
    });

    tbody.innerHTML = "";

    let totalTime = 0;
    let totalCost = 0;

    if (filtered.length === 0) {
      tbody.innerHTML =
        `<tr><td colspan="9">Tidak ada data</td></tr>`;
    }

    filtered.forEach((k, i) => {

      const timeSaved =
        (k.timeBefore || 0) - (k.timeAfter || 0);

      const costSaved =
        (k.costBefore || 0) - (k.costAfter || 0);

      totalTime += timeSaved;
      totalCost += costSaved;

      tbody.insertAdjacentHTML("beforeend", `
        <tr>
          <td>${i + 1}</td>
          <td>${formatDate(k.date)}</td>
          <td>${k.section || "-"}</td>
          <td>${k.title || "-"}</td>
          <td>${k.timeBefore} → ${k.timeAfter}</td>
          <td>${timeSaved}</td>
          <td>Rp ${fmt(k.costBefore)} → Rp ${fmt(k.costAfter)}</td>
          <td>Rp ${fmt(costSaved)}</td>
          <td>
            <button onclick="showPhoto('${k.id}')">📷</button>
            <button onclick="hapus('${k.id}')">🗑️</button>
          </td>
        </tr>
      `);
    });

    totalKaizenEl.innerText = filtered.length;
    totalTimeEl.innerText = totalTime;
    totalCostEl.innerText = fmt(totalCost);

    drawChart(totalTime, totalCost);
  }

  // ================= DELETE =================
  window.hapus = async function(id) {
    if (!confirm("Hapus Kaizen?")) return;
    await deleteKaizenById(id);
    loadData();
  };

  // ================= SHOW PHOTO =================
  window.showPhoto = function(id) {
    const item = data.find(d => d.id === id);
    modalBefore.src = item.photoBefore || "";
    modalAfter.src = item.photoAfter || "";
    modal.style.display = "flex";
  };

  window.closeModal = function() {
    modal.style.display = "none";
  };

  // ================= CHART =================
function drawChart(totalTime, totalCost) {

  const targetTime = Number(localStorage.getItem("targetTime")) || 0;
  const targetCost = Number(localStorage.getItem("targetCost")) || 0;

  const percentCost = targetCost > 0
    ? ((totalCost / targetCost) * 100).toFixed(1)
    : 0;

  if (timeChart) timeChart.destroy();
  if (costChart) costChart.destroy();

  // ================= TIME CHART =================
  timeChart = new Chart(
    document.getElementById("timeChart"),
    {
      type: "bar",
      data: {
        labels: ["Waktu (Menit)"],
        datasets: [
          {
            label: "Target",
            data: [targetTime],
            backgroundColor: "#bdc3c7"
          },
          {
            label: "Realisasi",
            data: [totalTime],
            backgroundColor:
              totalTime >= targetTime ? "#27ae60" : "#e74c3c"
          }
        ]
      },
      options: {
  responsive: true,
  maintainAspectRatio: false,   // 🔥 penting

  layout: {
    padding: {
      top: 20,
      bottom: 10
    }
  },

  plugins: {
    title: {
      display: true,
      text: "Perbandingan Target vs Realisasi Waktu",
      font: { size: 18, weight: "bold" },
      padding: { bottom: 50 }
    },

    legend: {
      position: "bottom",
      labels: {
        boxWidth: 20,
        padding: 15
      }
    },

    datalabels: {
      anchor: "end",
      align: "top",
      offset: 8,
      font: { weight: "bold", size: 13 },
      color: "#000",
      formatter: value => value + " menit"
    }
  },

  scales: {
    y: {
      beginAtZero: true,
      grace: "25%",
      ticks: {
        stepSize: 20,
        padding: 8
      },
      title: {
        display: true,
        text: "Menit",
        padding: { bottom: 10 }
      }
    }
  }
},
      plugins: [ChartDataLabels]
    }
  );

  // ================= COST CHART (PRIMARY: RUPIAH) =================
costChart = new Chart(
  document.getElementById("costChart"),
  {
    type: "bar",
    data: {
      labels: ["Cost (Rp)"],
      datasets: [
        {
          label: "Target",
          data: [targetCost],
          backgroundColor: "#bdc3c7"
        },
        {
          label: "Realisasi",
          data: [totalCost],
          backgroundColor:
            totalCost >= targetCost ? "#0a3d62" : "#e74c3c"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      layout: {
        padding: {
          top: 40,
          bottom: 10
        }
      },

      plugins: {
        title: {
          display: true,
          text: "Perbandingan Target vs Realisasi Cost",
          font: { size: 18, weight: "bold" },
          padding: { bottom: 30 }
        },

        legend: {
          position: "bottom"
        },

        datalabels: {
          anchor: "end",
          align: "top",
          offset: 8,
          font: { weight: "bold", size: 13 },
          color: "#000",
          formatter: value =>
            "Rp " + value.toLocaleString("id-ID")
        },

        tooltip: {
          callbacks: {
            label: function(context) {

              if (context.dataset.label === "Realisasi") {
                const percent = targetCost > 0
                  ? ((totalCost / targetCost) * 100).toFixed(1)
                  : 0;

                return "Realisasi: Rp " +
                  totalCost.toLocaleString("id-ID") +
                  " (" + percent + "%)";
              }

              return "Target: Rp " +
                targetCost.toLocaleString("id-ID");
            }
          }
        }
      },

      scales: {
        y: {
          beginAtZero: true,
          grace: "25%",
          ticks: {
            callback: function(value) {
              return "Rp " + value.toLocaleString("id-ID");
            }
          },
          title: {
            display: true,
            text: "Rupiah (Rp)"
          }
        }
      }
    },
    plugins: [ChartDataLabels]
  }
);

  // ================= UPDATE TARGET =================
  window.updateTarget = function() {

  const newTargetTime = Number(targetTimeInput.value);
  const newTargetCost = Number(targetCostInput.value);

  if (newTargetTime < 0 || newTargetCost < 0) {
    alert("Target tidak valid!");
    return;
  }

  localStorage.setItem("targetTime", newTargetTime);
  localStorage.setItem("targetCost", newTargetCost);

  render();
};


  // ================= UTIL =================
  function fmt(n) {
    return (Number(n) || 0).toLocaleString("id-ID");
  }

  function formatDate(d) {
    const date = new Date(d);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  filterMonth.onchange = render;
  filterYear.onchange = render;

  loadData();
});
// ===== BACKUP FIREBASE =====
window.exportKaizenJSON = async function () {

  const allData = await getAllKaizens();

  if (!allData.length) {
    alert("Tidak ada data untuk dibackup!");
    return;
  }

  const blob = new Blob(
    [JSON.stringify(allData, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "kaizen-backup.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
};
import { saveKaizenToFirebase } 
from "./services/firebaseService.js";
window.importKaizenJSON = function(event) {

  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async function(e) {

    try {

      const importedData = JSON.parse(e.target.result);

      // Jika bukan array, ubah jadi array
      const dataArray = Array.isArray(importedData)
        ? importedData
        : [importedData];

      for (const item of dataArray) {

        // Ambil hanya field yang kita butuhkan
        const cleanData = {
          date: item.date || "",
          section: item.section || "",
          title: item.title || "",
          timeBefore: Number(item.timeBefore) || 0,
          timeAfter: Number(item.timeAfter) || 0,
          costBefore: Number(item.costBefore) || 0,
          costAfter: Number(item.costAfter) || 0,
          preparedBy: item.preparedBy || "",
          approvedBy: item.approvedBy || "",
          photoBefore: item.photoBefore || "",
          photoAfter: item.photoAfter || ""
        };

        await saveKaizenToFirebase(cleanData);
      }

      alert("Restore berhasil!");
      loadData();

    } catch (err) {
      console.error("RESTORE ERROR:", err);
      alert("File JSON tidak bisa diproses. Cek console.");
    }
  };

  reader.readAsText(file);
  event.target.value = "";
};



