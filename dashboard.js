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

  const modal = document.getElementById("photoModal");
  const modalBefore = document.getElementById("modalBefore");
  const modalAfter = document.getElementById("modalAfter");

  let data = [];

  // ================= LOAD DATA =================
  async function loadData() {
    data = await getAllKaizens();
    initYearFilter();
    render();
  }

  // ================= INIT YEAR FILTER =================
  function initYearFilter() {
    const years = [...new Set(
      data.map(k => new Date(k.date).getFullYear())
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
  let timeChart, costChart;

  function drawChart(totalTime, totalCost) {

    if (timeChart) timeChart.destroy();
    if (costChart) costChart.destroy();

    timeChart = new Chart(
      document.getElementById("timeChart"),
      {
        type: "bar",
        data: {
          labels: ["Saving"],
          datasets: [{
            label: "Waktu (menit)",
            data: [totalTime],
            backgroundColor: "#27ae60"
          }]
        }
      }
    );

    costChart = new Chart(
      document.getElementById("costChart"),
      {
        type: "bar",
        data: {
          labels: ["Saving"],
          datasets: [{
            label: "Cost (Rp)",
            data: [totalCost],
            backgroundColor: "#0a3d62"
          }]
        }
      }
    );
  }

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
