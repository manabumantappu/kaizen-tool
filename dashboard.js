import { 
  getAllKaizens, 
  deleteKaizenById 
} from "./services/firebaseService.js";

document.addEventListener("DOMContentLoaded", async () => {

  // ================= STATE =================
  let data = [];

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

  // ================= LOAD DATA FROM FIREBASE =================
  async function loadData() {
    data = await getAllKaizens();
    initYearFilter();
    render();
  }

  // ================= INIT YEAR FILTER =================
  function initYearFilter() {
    filterYear.innerHTML = `<option value="all">Semua Tahun</option>`;

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
  }

  // ================= RENDER =================
  function render() {

    const m = filterMonth.value;
    const y = filterYear.value;

    const filtered = data.filter(k => {
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
            <button onclick="showPhoto('${k.id}')">📷</button>
            <button onclick="hapus('${k.id}')">🗑️</button>
          </td>
        </tr>
      `;
    });

    totalKaizenEl.innerText = filtered.length;
    totalTimeEl.innerText   = totalTime;
    totalCostEl.innerText   = fmt(totalCost);

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
    document.getElementById("modalBefore").src = item.photoBefore || "";
    document.getElementById("modalAfter").src  = item.photoAfter || "";
    document.getElementById("photoModal").style.display = "flex";
  };

  window.closeModal = function() {
    document.getElementById("photoModal").style.display = "none";
  };

  // ================= CHART =================
  function drawChart(totalTime, totalCost) {

    if (timeChart) timeChart.destroy();
    if (costChart) costChart.destroy();

    const corporateBlue = "#0a3d62";
    const targetGray = "#bdc3c7";

    timeChart = new Chart(document.getElementById("timeChart"), {
      type: "bar",
      data: {
        labels: [""],
        datasets: [
          { label: "Target", data: [targetTime], backgroundColor: targetGray },
          { label: "Realisasi", data: [totalTime], backgroundColor: corporateBlue }
        ]
      },
      options: { responsive: true }
    });

    costChart = new Chart(document.getElementById("costChart"), {
      type: "bar",
      data: {
        labels: [""],
        datasets: [
          { label: "Target", data: [targetCost], backgroundColor: targetGray },
          { label: "Realisasi", data: [totalCost], backgroundColor: corporateBlue }
        ]
      },
      options: { responsive: true }
    });
  }

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
  filterYear.onchange  = render;

  loadData();
});
