import { 
  getAllKaizens, 
  deleteKaizenById 
} from "./services/firebaseService.js";

document.addEventListener("DOMContentLoaded", async () => {

  const tbody = document.querySelector("#kaizenTable tbody");
  let data = [];

  async function loadData() {
    data = await getAllKaizens();
    render();
  }

  function render() {
    tbody.innerHTML = "";

    if (data.length === 0) {
      tbody.innerHTML =
        `<tr><td colspan="7">Tidak ada data</td></tr>`;
      return;
    }

    data.forEach((k, i) => {
      const timeSaved =
        (k.timeBefore || 0) - (k.timeAfter || 0);

      const costSaved =
        (k.costBefore || 0) - (k.costAfter || 0);

      tbody.innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${k.date}</td>
          <td>${k.section}</td>
          <td>${k.title}</td>
          <td>${timeSaved}</td>
          <td>Rp ${costSaved}</td>
          <td>
            <button onclick="hapus('${k.id}')">
              🗑️
            </button>
          </td>
        </tr>
      `;
    });
  }

  window.hapus = async function(id) {
    if (!confirm("Hapus Kaizen?")) return;
    await deleteKaizenById(id);
    loadData();
  };

  loadData();
});
