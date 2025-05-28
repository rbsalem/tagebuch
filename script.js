const eintraegeKey = "tagebuchEintraege";
let eintraege = JSON.parse(localStorage.getItem(eintraegeKey)) || [];

const form = document.getElementById("eintragForm");
const suchfeld = document.getElementById("suchfeld");
const container = document.getElementById("eintraegeContainer");
const toggleButton = document.getElementById("toggleDarkMode");
const body = document.body;

function renderEintraege(filter = "") {
  container.innerHTML = "";

  const gruppiert = {};
  eintraege.forEach(e => {
    const jahr = e.jahr;
    const monat = e.monat;
    if (!gruppiert[jahr]) gruppiert[jahr] = {};
    if (!gruppiert[jahr][monat]) gruppiert[jahr][monat] = [];
    gruppiert[jahr][monat].push(e);
  });

  Object.keys(gruppiert).sort().reverse().forEach(jahr => {
    const jahrBox = document.createElement("details");
    jahrBox.innerHTML = `<summary><h3>📅 ${jahr}</h3></summary>`;

    Object.keys(gruppiert[jahr]).forEach(monat => {
      const monatBox = document.createElement("details");
      monatBox.innerHTML = `<summary>📆 ${monat}</summary>`;

      gruppiert[jahr][monat].forEach(eintrag => {
        if (
          filter &&
          !eintrag.text.toLowerCase().includes(filter.toLowerCase())
        )
          return;

        const div = document.createElement("div");
        div.className = "eintrag";
        div.innerHTML = formatEintrag(eintrag);
        monatBox.appendChild(div);
      });

      jahrBox.appendChild(monatBox);
    });

    container.appendChild(jahrBox);
  });
}

function formatEintrag(e) {
  let text = e.text;
  text = text.replace(/\[img:(.*?)\]/g, '<img src="$1">');
  text = text.replace(/\[link:(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
  return `<strong>${e.datum}</strong><br>${text}`;
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const datum = document.getElementById("datum").value;
  const jahr = document.getElementById("jahr").value;
  const monat = document.getElementById("monat").value;
  const text = document.getElementById("text").value.trim();

  if (!datum || !jahr || !monat || !text) return;

  eintraege.push({ datum, jahr, monat, text });
  localStorage.setItem(eintraegeKey, JSON.stringify(eintraege));
  form.reset();
  renderEintraege();
});

suchfeld.addEventListener("input", e => {
  renderEintraege(e.target.value);
});

function applyTheme() {
  const isDark = localStorage.getItem("darkmode") === "true";
  body.classList.toggle("dark", isDark);
  toggleButton.textContent = isDark ? "☀️" : "🌙";
}

toggleButton.addEventListener("click", () => {
  const isDark = body.classList.toggle("dark");
  localStorage.setItem("darkmode", isDark);
  toggleButton.textContent = isDark ? "☀️" : "🌙";
});

applyTheme();
renderEintraege();

for (let i = 1; i <= 31; i++) {
  const opt = document.createElement("option");
  opt.value = i;
  opt.textContent = i;
  document.getElementById("av_tag").appendChild(opt);
}

document.getElementById("av_jahr_bf").addEventListener("input", e => {
  const jahr = parseInt(e.target.value);
  if (!isNaN(jahr)) {
    const hal = jahr - 993;
    document.getElementById("hal_anzeige").textContent = `(Hal: ${hal})`;
  } else {
    document.getElementById("hal_anzeige").textContent = `(Hal: ...)`;
  }
});

document.getElementById("kalenderToggle").addEventListener("click", () => {
  const inhalt = document.getElementById("kalenderInhalt");
  const btn = document.getElementById("kalenderToggle");
  if (inhalt.style.display === "none") {
    inhalt.style.display = "block";
    btn.textContent = "📅 Kalender schließen";
  } else {
    inhalt.style.display = "none";
    btn.textContent = "📅 Kalender öffnen";
  }
});
