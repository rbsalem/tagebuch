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

// Fülle Tag-Auswahl bei Start
const avTag = document.getElementById("av_tag");
function updateTage(monat) {
  avTag.innerHTML = '';
  if (monat === "namenlos") {
    for (let i = 1; i <= 5; i++) {
      avTag.innerHTML += `<option value="${i}">${i}</option>`;
    }
  } else {
    for (let i = 1; i <= 30; i++) {
      avTag.innerHTML += `<option value="${i}">${i}</option>`;
    }
  }
}

// Aktualisiere Hal-Anzeige
function updateHal() {
  const jahr = parseInt(document.getElementById("av_jahr").value);
  const hal = jahr - 993;
  document.getElementById("hal_anzeige").textContent = isNaN(hal) ? "(Hal: ...)" : `(Hal: ${hal})`;
}

// Events
document.getElementById("av_monat").addEventListener("change", (e) => {
  updateTage(e.target.value);
});

document.getElementById("av_jahr").addEventListener("input", updateHal);
updateTage(""); // initial leeren
updateHal();    // initial anzeigen

document.getElementById("av_monat").addEventListener("change", (e) => {
  const tagSelect = document.getElementById("av_tag");
  const monat = e.target.value;
  tagSelect.innerHTML = '';
  const tage = monat === "namenlos" ? 5 : 30;
  for (let i = 1; i <= tage; i++) {
    tagSelect.innerHTML += `<option value="${i}">${i}</option>`;
  }
});

document.getElementById("av_jahr").addEventListener("input", () => {
  const jahr = parseInt(document.getElementById("av_jahr").value);
  const hal = jahr - 993;
  document.getElementById("hal_anzeige").textContent = `(Hal: ${hal})`;
});

// Initial befüllen
document.getElementById("av_monat").dispatchEvent(new Event("change"));
document.getElementById("av_jahr").dispatchEvent(new Event("input"));

// Speicher letzten Titel lokal
const titelFeld = document.getElementById("titel");
const previewContent = document.getElementById("previewContent");
titelFeld.value = localStorage.getItem("letzterTitel") || "";

titelFeld.addEventListener("input", () => {
  localStorage.setItem("letzterTitel", titelFeld.value);
});

// Markdown-Vorschau für textarea
function updatePreview() {
  const text = document.getElementById("text").value;
  // einfache Markdown-Ersetzung (minimal)
  let html = text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>')
    .replace(/\*(.*?)\*/gim, '<i>$1</i>')
    .replace(/
$/gim, '<br>');
  previewContent.innerHTML = html;
}
document.getElementById("text").addEventListener("input", updatePreview);

// Pflichtfeldprüfung bei Submit
document.getElementById("eintragForm").addEventListener("submit", e => {
  e.preventDefault();
  if (!titelFeld.value || !document.getElementById("text").value.trim()) {
    alert("Bitte Titel und Eintrag ausfüllen.");
    return;
  }
  alert("Eintrag gespeichert! (funktionale Speicherung kann ergänzt werden)");
});
