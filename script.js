document.addEventListener("DOMContentLoaded", () => {
  // 🌗 Theme-Handling
  const isDark = localStorage.getItem("darkmode") !== "false";
  document.body.classList.toggle("dark", isDark);
  const toggleBtn = document.getElementById("toggleDarkMode");
  toggleBtn.textContent = isDark ? "☀️" : "🌙";
  toggleBtn.addEventListener("click", () => {
    const newDark = !document.body.classList.contains("dark");
    document.body.classList.toggle("dark", newDark);
    localStorage.setItem("darkmode", newDark);
    toggleBtn.textContent = newDark ? "☀️" : "🌙";
  });

  // 📜 Einträge laden
  ladeEintraege();

  // ✍️ Speichern
  document.getElementById("eintragForm").addEventListener("submit", e => {
    e.preventDefault();
    const titel = document.getElementById("titel").value.trim();
    const datum = document.getElementById("datum").value;
    const text = document.getElementById("text").value.trim();
    if (!titel || !datum || !text) return;

    const eintrag = { titel, datum, text };
    const eintraege = JSON.parse(localStorage.getItem("eintraege") || "[]");
    eintraege.push(eintrag);
    localStorage.setItem("eintraege", JSON.stringify(eintraege));

    document.getElementById("eintragForm").reset();
    ladeEintraege();
  });
});

function ladeEintraege() {
  const container = document.getElementById("eintraegeContainer");
  container.innerHTML = "";
  const eintraege = JSON.parse(localStorage.getItem("eintraege") || "[]");
  eintraege.forEach(e => {
    const div = document.createElement("div");
    div.className = "eintrag";
    div.innerHTML = `<h3>${e.titel}</h3><p><em>${e.datum}</em></p><p>${e.text}</p>`;
    container.appendChild(div);
  });
}
