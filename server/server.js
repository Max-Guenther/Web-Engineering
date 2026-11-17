// Mini-Server nach dem Kurs-Baustein t5-mini-server, ohne Abhängigkeiten.
// Läuft nur lokal (npm run server), GitHub Pages kann kein JavaScript auf dem Server ausführen.
import { createServer } from "node:http";

const PORT = 3000;

// Ein paar Beispieldaten, die echten Cocktails kommen später aus TheCocktailDB
const cocktails = [
  { name: "Margarita", alkoholisch: true, zutaten: ["Tequila", "Triple Sec", "Lime Juice", "Salt"] },
  { name: "Mojito", alkoholisch: true, zutaten: ["Light Rum", "Lime", "Sugar", "Mint", "Soda Water"] },
  { name: "Gin Tonic", alkoholisch: true, zutaten: ["Gin", "Tonic Water", "Lime"] },
  { name: "Virgin Mojito", alkoholisch: false, zutaten: ["Lime", "Sugar", "Mint", "Soda Water"] },
  { name: "Shirley Temple", alkoholisch: false, zutaten: ["Ginger Ale", "Grenadine", "Maraschino Cherry"] },
];

createServer((req, res) => {
  console.log(req.method, req.url);

  // req.url ist nur der Pfad mit Query, für URL braucht es eine Basis
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // /api/cocktails?zutat=lime&alkohol=alkoholfrei
  if (url.pathname === "/api/cocktails") {
    const zutat = url.searchParams.get("zutat")?.toLowerCase();
    const alkohol = url.searchParams.get("alkohol");

    const treffer = cocktails.filter((c) => {
      if (alkohol === "alkoholisch" && !c.alkoholisch) return false;
      if (alkohol === "alkoholfrei" && c.alkoholisch) return false;
      // Teilwort genügt, damit "lime" auch "Lime Juice" findet
      if (zutat && !c.zutaten.some((z) => z.toLowerCase().includes(zutat))) return false;
      return true;
    });

    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    });
    return res.end(JSON.stringify(treffer));
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("404 – gibt es hier nicht");
}).listen(PORT, () => {
  console.log(`Läuft auf http://localhost:${PORT}/api/cocktails`);
});
