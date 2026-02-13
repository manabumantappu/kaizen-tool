import {
  getAllKaizens,
  deleteKaizenById,
  saveKaizenToFirebase
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

  const modal = document.getElementById("photoModal");
  const modalBefore = document.getElementById("modalBefore");
  const modalAfter = document.getElementById("modalAfter");

  let data = [];
  let timeChart = null;
  let costChart = null;

  // ================= LOAD DATA =================
  async function loadData() {
    data = await getAllKaizens();
    initYearFilter();
    render();
  }

  window.loadData = loadData;

  // ================= INIT YEAR =================
  function initYearFilter() {

    const years = [...new Set(
      data
        .filter(k => k.date)
        .map(k => new Date(k.date).getFullYear())
    )];

    filterYear.innerHTML = `<option value="all">Semua Tahun</option>`;

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

      if (!k.date) return false;

      const d = new Date(k.date);
      if (isNaN(d)) return false;

      return (m === "all" || d.getMonth() + 1 == m) &&
             (y === "all" || d.getFullYear() == y);
    });

    tbody.innerHTML = "";

    let totalTime = 0;
    let totalCost = 0;

    if (!filtered.length) {
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
            <button onclick="editKaizen('${k.id}')">✏️</button>
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

  window.editKaizen = function(id) {
    window.location.href = `index.html?id=${id}`;
  };

  // ================= SHOW PHOTO =================
  window.showPhoto = function(id) {

    const item = data.find(d => d.id === id);
    if (!item) return;

    modalBefore.src = item.photoBefore || "";
    modalAfter.src = item.photoAfter || "";
    modal.style.display = "flex";
  };

  window.closeModal = function() {
    modal.style.display = "none";
  };

  // ================= UPDATE TARGET =================
  window.updateTarget = function () {

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

  // ================= CHART =================
  function drawChart(totalTime, totalCost) {

    const targetTime =
      Number(localStorage.getItem("targetTime")) || 0;

    const targetCost =
      Number(localStorage.getItem("targetCost")) || 0;

    if (timeChart) timeChart.destroy();
    if (costChart) costChart.destroy();

    // ===== TIME =====
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
                totalTime >= targetTime
                  ? "#27ae60"
                  : "#e74c3c"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Perbandingan Target vs Realisasi Waktu",
              font: { size: 18, weight: "bold" }
            },
            legend: { position: "bottom" },
            datalabels: {
              anchor: "end",
              align: "top",
              font: { weight: "bold" },
              formatter: value => value + " menit"
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grace: "25%",
              ticks: { stepSize: 20 },
              title: {
                display: true,
                text: "Menit"
              }
            }
          }
        },
        plugins: [ChartDataLabels]
      }
    );

    // ===== COST =====
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
                totalCost >= targetCost
                  ? "#0a3d62"
                  : "#e74c3c"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Perbandingan Target vs Realisasi Cost",
              font: { size: 18, weight: "bold" }
            },
            legend: { position: "bottom" },
            datalabels: {
              anchor: "end",
              align: "top",
              font: { weight: "bold" },
              formatter: value =>
                "Rp " + value.toLocaleString("id-ID")
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grace: "25%",
              ticks: {
                callback: value =>
                  "Rp " + value.toLocaleString("id-ID")
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
  }

  // ================= UTIL =================
  function fmt(n) {
    return (Number(n) || 0).toLocaleString("id-ID");
  }

  function formatDate(d) {
    if (!d) return "-";
    const date = new Date(d);
    if (isNaN(date)) return "-";
    return date.toLocaleDateString("id-ID");
  }

  filterMonth.onchange = render;
  filterYear.onchange = render;

  loadData();
});
// ================= BACKUP =================
window.exportKaizenJSON = async function () {

  try {

    const allData = await getAllKaizens();

    if (!allData.length) {
      alert("Tidak ada data untuk dibackup!");
      return;
    }

    // Hapus id & createdAt supaya clean
    const cleanData = allData.map(item => {
      const { id, createdAt, ...rest } = item;
      return rest;
    });

    const blob = new Blob(
      [JSON.stringify(cleanData, null, 2)],
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

  } catch (err) {
    console.error("BACKUP ERROR:", err);
    alert("Gagal melakukan backup.");
  }
};
