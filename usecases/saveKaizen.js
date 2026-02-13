import {
  saveKaizenToFirebase,
  updateKaizenById
} from "../services/firebaseService.js";

export async function saveKaizen(data) {

  try {

    // cek apakah mode edit
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get("id");

    if (editId) {
      await updateKaizenById(editId, data);
      alert("Kaizen berhasil diupdate!");
    } else {
      await saveKaizenToFirebase(data);
      alert("Kaizen berhasil disimpan!");
    }

    window.location.href = "./dashboard.html";

  } catch (error) {
    console.error("SAVE ERROR:", error);
    alert("Gagal menyimpan data!");
  }
}
