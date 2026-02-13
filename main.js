import {
  saveKaizenToFirebase,
  updateKaizenById,
  getKaizenById
} from "./services/firebaseService.js";

document.addEventListener("DOMContentLoaded", async () => {

  // ================= DATE DASH =================
  const dateDashEl = document.getElementById("dateDash");
  if (dateDashEl) {
    dateDashEl.innerText =
      new Date().toLocaleDateString("id-ID");
  }

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

  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get("id");

  // ================= EDIT MODE =================
  if (editId) {
    try {
      const data = await getKaizenById(editId);

      if (data) {
        document.getElementById("kaizenDateInput").value = data.date || "";
        document.getElementById("section").value = data.section || "";
        document.getElementById("judulKaizen").value = data.title || "";
        timeBefore.value = data.timeBefore || 0;
        timeAfter.value = data.timeAfter || 0;
        costBefore.value = data.costBefore || 0;
        costAfter.value = data.costAfter || 0;

        if (data.photoBefore) {
          previewBefore.src = data.photoBefore;
          previewBefore.style.display = "block";
        }

        if (data.photoAfter) {
          previewAfter.src = data.photoAfter;
          previewAfter.style.display = "block";
        }
      }
    } catch (err) {
      console.error("Gagal load edit:", err);
    }
  }

  // ================= PREVIEW FOTO =================
  function previewImage(input, preview) {
    if (!input) return;

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

  // ================= CHART =================
  let timeChart = null;
  let costChart = null;

  const timeChartCanvas = document.getElementById("timeChart");
  const costChartCanvas = document.getElementById("costChart");

  if (timeChartCanvas) {
    timeChart = new Chart(timeChartCanvas, {
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
  }

  if (costChartCanvas) {
    costChart = new Chart(costChartCanvas, {
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
  }

  function updateChart(tb, ta, cb, ca) {
    if (timeChart) {
      timeChart.data.datasets[0].data = [tb, ta];
      timeChart.update();
    }
    if (costChart) {
      costChart.data.datasets[0].data = [cb, ca];
      costChart.update();
    }
  }

  function calculate() {
    const tb = parseFloat(timeBefore?.value) || 0;
    const ta = parseFloat(timeAfter?.value) || 0;
    const cb = parseFloat(costBefore?.value) || 0;
    const ca = parseFloat(costAfter?.value) || 0;

    const tSaved = tb - ta;
    const tPercent = tb > 0 ? ((tSaved / tb) * 100).toFixed(1) : 0;
    const cSaved = cb - ca;
    const cYear = cSaved * 12;

    if (timeSaved) timeSaved.textContent = tSaved;
    if (timePercent) timePercent.textContent = tPercent;
    if (costSaved)
      costSaved.textContent = cSaved.toLocaleString("id-ID");
    if (costYear)
      costYear.textContent = cYear.toLocaleString("id-ID");

    updateChart(tb, ta, cb, ca);
  }

  timeBefore?.addEventListener("input", calculate);
  timeAfter?.addEventListener("input", calculate);
  costBefore?.addEventListener("input", calculate);
  costAfter?.addEventListener("input", calculate);

  calculate();
});


// ================= COMPRESS IMAGE =================
async function compressImage(base64) {

  if (!base64) return "";
  if (base64.length < 900000) return base64;

  return new Promise(resolve => {

    const img = new Image();
    img.src = base64;

    img.onload = () => {

      const canvas = document.createElement("canvas");

      const maxWidth = 1000;
      const scale = maxWidth / img.width;

      canvas.width = maxWidth;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      resolve(canvas.toDataURL("image/jpeg", 0.6));
    };
  });
}


// ================= SAVE =================
window.saveKaizen = async function() {

  const dateValue =
    document.getElementById("kaizenDateInput").value;

  if (!dateValue) {
    alert("Tanggal wajib diisi!");
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get("id");

  const photoBeforeCompressed =
    await compressImage(document.getElementById("previewBefore").src);

  const photoAfterCompressed =
    await compressImage(document.getElementById("previewAfter").src);

  const newData = {
    date: dateValue,
    section: document.getElementById("section").value,
    title: document.getElementById("judulKaizen").value,
    timeBefore: Number(document.getElementById("timeBefore").value) || 0,
    timeAfter: Number(document.getElementById("timeAfter").value) || 0,
    costBefore: Number(document.getElementById("costBefore").value) || 0,
    costAfter: Number(document.getElementById("costAfter").value) || 0,
    preparedBy: document.getElementById("preparedBy").value || "",
    approvedBy: document.getElementById("approvedBy").value || "",
    photoBefore: photoBeforeCompressed,
    photoAfter: photoAfterCompressed
  };

  try {

    if (editId) {

  const existing = await getKaizenById(editId);

  if (!existing || !existing.id) {
    alert("Data tidak ditemukan. Akan disimpan sebagai data baru.");
    await saveKaizenToFirebase(newData);
  } else {
    await updateKaizenById(editId, newData);
    alert("Kaizen berhasil diupdate!");
  }

} else {

  await saveKaizenToFirebase(newData);
  alert("Kaizen berhasil disimpan!");

}


    window.location.href = "./dashboard.html";

  } catch (error) {
    console.error(error);
    alert("Gagal menyimpan data!");
  }
};


// ================= GENERATE PDF =================
window.generatePDF = function () {

  if (!window.jspdf) {
    alert("Library PDF belum dimuat!");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("KAIZEN REPORT", 20, 20);

  doc.save("Kaizen-Report.pdf");
};


// ================= GENERATE PPT =================
window.generatePPT = function () {

  if (!window.PptxGenJS) {
    alert("Library PPT belum dimuat!");
    return;
  }

  let ppt = new PptxGenJS();
  let slide = ppt.addSlide();

  slide.addText("KAIZEN REPORT", {
    x: 1,
    y: 1,
    fontSize: 28,
    bold: true
  });

  ppt.writeFile("Kaizen-Report.pptx");
};


// ================= GO DASHBOARD =================
window.goDashboard = function () {
  window.location.href = "./dashboard.html";
};
