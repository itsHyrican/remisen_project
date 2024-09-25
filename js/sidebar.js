document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.getElementById("menuButton");
  const menu = document.getElementById("menu");
  const closeMenuButton = document.getElementById("closeMenuButton");

  // Funktion zur Steuerung der Sichtbarkeit des Menüs basierend auf der Fensterbreite.
  function toggleMenuVisibility() {
    if (window.innerWidth < 768) {
      menu.classList.add("hidden");
    } else {
      menu.classList.remove("hidden");
    }
  }

  menuButton.addEventListener("click", function () {
    menu.classList.toggle("hidden");
  });

  closeMenuButton.addEventListener("click", function () {
    menu.classList.add("hidden");
  });

  //Stellt sicher dass das Menü auf dem Desktop sichtbar, ist aber auf Mobile nicht
  toggleMenuVisibility();

  window.addEventListener("resize", toggleMenuVisibility);
});
