const data = JSON.parse(localStorage.getItem("kaizenData")) || [];

const tbody = document.querySelector("#kaizenTable tbody");
const filterMonth = document.getElementById("filterMonth");
const filterYear  = document.getElementById("filterYear");

const totalKaizenEl = document.getElementById("totalKaizen");
const totalTimeEl   = document.getElementById("totalTime");
const totalCostEl   = document.getElementById("totalCost");

let timeChart = null;
let costChart = null;

/* ===== INIT FILTER YEAR ===== */
[...new Set(data.map(k => new Date(k.date).getFullYear()))]
  .forEach(y => {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    filterYear.appendChild(opt);
  });

/* ===== RENDER ===== */
function render() {
  const m = filterMonth.value;
  const y = filterYear.value;

  const filtered = data
    .map((k, idx) => ({ ...k, _idx: idx }))
    .filter(k => {
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
    totalTime += k.time?.saved || 0;
    totalCost += k.cost?.saved || 0;

    tbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${formatDate(k.date)}</td>
        <td>${k.section}</td>
        <td>${k.title}</td>
        <td>${k.time.before} → ${k.time.after}</td>
        <td>${k.time.saved}</td>
        <td>Rp ${fmt(k.cost.before)} → Rp ${fmt(k.cost.after)}</td>
        <td>Rp ${fmt(k.cost.saved)}</td>
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
  totalCostEl.innerText  = fmt(totalCost);

  drawChart(totalTime, totalCost);
}

/* ===== CHART ===== */
function drawChart(totalTime, totalCost) {
  if (timeChart) timeChart.destroy();
  if (costChart) costChart.destroy();

  timeChart = new Chart(document.getElementById("timeChart"), {
    type: "bar",
    data: {
      labels: ["Total Hemat Waktu"],
      datasets: [{ data: [totalTime] }]
    },
    options: { plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}} }
  });

  costChart = new Chart(document.getElementById("costChart"), {
    type: "bar",
    data: {
      labels: ["Total Hemat Cost"],
      datasets: [{ data: [totalCost] }]
    },
    options: { plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}} }
  });
}

/* ===== ACTION ===== */
window.showPhoto = i => {
  modalBefore.src = data[i].images.before || "";
  modalAfter.src  = data[i].images.after  || "";
  photoModal.style.display = "flex";
};

window.editKaizen = i => {
  localStorage.setItem("editIndex", i);
  window.location.href = "index.html";
};

window.hapus = i => {
  if (confirm("Hapus Kaizen?")) {
    data.splice(i, 1);
    localStorage.setItem("kaizenData", JSON.stringify(data));
    render();
  }
};

/* ===== UTIL ===== */
function fmt(n) {
  return (Number(n) || 0).toLocaleString("id-ID");
}
function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID");
}

/* ===== INIT ===== */
filterMonth.onchange = render;
filterYear.onchange  = render;

preparedByDash.innerText = localStorage.getItem("preparedBy") || "-";
approvedByDash.innerText = localStorage.getItem("approvedBy") || "-";
dateDash.innerText       = localStorage.getItem("kaizenDate") || "-";

render();
