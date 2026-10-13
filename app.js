// Setzt das aktuelle Jahr im Footer.

const jahr = document.querySelector("#jahr");
if (jahr) jahr.textContent = new Date().getFullYear();

console.log("app.js läuft");
