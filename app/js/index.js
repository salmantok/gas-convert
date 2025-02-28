document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.querySelector(".dark-mode-toggle");
  const body = document.body;
  const currentTheme = localStorage.getItem("theme") || "light";
  body.setAttribute("data-bs-theme", currentTheme);
  toggleButton.textContent =
    currentTheme === "dark" ? "Light Mode" : "Dark Mode";
  toggleButton.addEventListener("click", () => {
    const newTheme =
      body.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    body.setAttribute("data-bs-theme", newTheme);
    toggleButton.textContent = newTheme === "dark" ? "Light Mode" : "Dark Mode";
    localStorage.setItem("theme", newTheme);
  });
});
