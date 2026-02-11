<<<<<<< HEAD
export function bindPreview(inputId, imgEl) {
  const input = document.getElementById(inputId);
  if (!input || !imgEl) return;

  input.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      imgEl.src = reader.result;
      imgEl.style.display = "block";
    };
    reader.readAsDataURL(file);
  });
}
=======
export function bindPreview(inputId, imgEl) {
  const input = document.getElementById(inputId);
  if (!input || !imgEl) return;

  input.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      imgEl.src = reader.result;
      imgEl.style.display = "block";
    };
    reader.readAsDataURL(file);
  });
}
>>>>>>> 6d1a56fdff9fb21b535ce3daf202dc325d629f3b
