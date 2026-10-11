/* theme.js: loaded in <head> so a saved light/dark choice applies before the
   first paint. With no saved choice the CSS follows the system setting. */
(function () {
  try {
    var saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") document.documentElement.dataset.theme = saved;
  } catch (e) {
    /* storage blocked: fall back to the system setting */
  }
})();
