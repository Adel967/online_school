document.addEventListener("DOMContentLoaded", () => {
  const flash = document.getElementById("flash-message");
  if (flash) {
    setTimeout(() => {
      flash.style.opacity = "0";
      setTimeout(() => flash.remove(), 500);
    }, 5000);
  }
});