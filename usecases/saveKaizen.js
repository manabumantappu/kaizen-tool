import { saveKaizenToFirebase } 
from "../services/firebaseService.js";

export async function saveKaizen(data) {
  try {
    await saveKaizenToFirebase(data);
    alert("Kaizen berhasil disimpan!");
    window.location.href = "./dashboard.html";
  } catch (error) {
    console.error(error);
    alert("Gagal menyimpan data!");
  }
}
