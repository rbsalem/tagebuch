
const CLIENT_ID = "430148415475-ie691161c18i8g2vqpb06g50fdg4uu1c.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/drive.file";
const FOLDER_ID = "1PnAzqviveTXXaLuJ-srfcwhS9NN30xEb";
let token = "";

function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

function initClient() {
  gapi.client.init({
    clientId: CLIENT_ID,
    scope: SCOPES
  }).then(() => {
    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
      token = gapi.auth.getToken().access_token;
      listFiles();
    }
  });
}

function handleAuthClick() {
  gapi.auth2.getAuthInstance().signIn().then(() => {
    token = gapi.auth.getToken().access_token;
    listFiles();
  });
}

function uploadFiles() {
  const files = document.getElementById("fileInput").files;
  if (!files.length) return;
  for (let file of files) {
    const metadata = {
      name: file.name,
      mimeType: "text/markdown",
      parents: [FOLDER_ID]
    };
    const form = new FormData();
    form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    form.append("file", file);

    fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id", {
      method: "POST",
      headers: new Headers({ Authorization: "Bearer " + token }),
      body: form
    }).then(res => res.json()).then(() => {
      document.getElementById("status").textContent += "✅ " + file.name + " hochgeladen\n";
      listFiles();
    });
  }
}

function listFiles() {
  fetch(`https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+mimeType='text/markdown'&fields=files(id,name)&orderBy=name`, {
    headers: { Authorization: "Bearer " + token }
  })
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("fileList");
    list.innerHTML = "";
    data.files.forEach(file => {
      const link = document.createElement("a");
      link.textContent = file.name;
      link.href = "#";
      link.onclick = () => loadPreview(file.id);
      list.appendChild(link);
      list.appendChild(document.createElement("br"));
    });
  });
}

function loadPreview(fileId) {
  fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: "Bearer " + token }
  }).then(res => res.text()).then(text => {
    const html = text
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/gim, "<b>$1</b>")
      .replace(/\*(.*?)\*/gim, "<i>$1</i>")
      .replace(/\n/g, "<br>");
    document.getElementById("previewContent").innerHTML = html;
  });
}

document.getElementById("toggleDarkMode").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
});

handleClientLoad();
