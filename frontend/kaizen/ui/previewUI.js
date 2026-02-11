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
