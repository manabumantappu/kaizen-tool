<<<<<<< HEAD
export function resizeImage(base64, maxWidth = 800, quality = 0.6) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);

      const canvas = document.createElement("canvas");
      canvas.width  = img.width * scale;
      canvas.height = img.height * scale;

      canvas.getContext("2d").drawImage(
        img, 0, 0, canvas.width, canvas.height
      );

      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.src = base64;
  });
}
=======
export function resizeImage(base64, maxWidth = 800, quality = 0.6) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);

      const canvas = document.createElement("canvas");
      canvas.width  = img.width * scale;
      canvas.height = img.height * scale;

      canvas.getContext("2d").drawImage(
        img, 0, 0, canvas.width, canvas.height
      );

      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.src = base64;
  });
}
>>>>>>> 6d1a56fdff9fb21b535ce3daf202dc325d629f3b
