# Cocktail-Finder

Der Cocktail-Finder zeigt dir, welche Cocktails du mit den Zutaten mixen kannst, die du gerade zu Hause hast, auch mit mehreren Zutaten gleichzeitig. Dazu gibt es jeden Tag einen Cocktail des Tages, der für alle Besucher derselbe ist.

**Live:** folgt (GitHub Pages)
**Team:** Max Günther, Simon Schneider

## Was die App kann

- Cocktails nach Zutaten finden, die man zu Hause hat (auch mehrere gleichzeitig)
- Filtern nach alkoholisch/alkoholfrei und Kategorie, sortieren nach Name oder Anzahl der Zutaten
- Cocktail des Tages auf der Startseite, für alle Besucher am selben Tag derselbe

## Warum diese Idee

Fünf Ideen standen zur Auswahl, genommen haben wir den Cocktail-Finder: Die Zutatensuche ist von Natur aus ein Formular, und weil die API sie mit dem Test-Key nicht kann, müssen wir das Filtern selbst lösen.

- **Erdbeben-Radar:** Außer Mindeststärke und Zeitraum gibt es nichts einzugeben, ein Formular mit Validierung wäre also nur aufgesetzt.
- **Mini-Pokédex:** Die Listen-Anfrage liefert nur Name und Link, für Bild und Typ bräuchte jedes der 151 Pokémon eine eigene Anfrage, also 152 Requests beim Start.
- **Serien-Watchlist:** Der Kern der App ist die eigene Liste im `localStorage`, und die `summary`-Texte von TVmaze enthalten HTML, das wir erst gegen XSS absichern müssten.
- **Raketenstart-Countdown:** Ohne Key erlaubt Launch Library 2 nur 15 Anfragen pro Stunde, die sind beim Entwickeln mit Live Server nach ein paar Reloads weg.

## Datenquelle

[TheCocktailDB](https://www.thecocktaildb.com/api.php) mit dem öffentlichen Test-Key `1`.

Der Zutaten-Filter (`filter.php?i=`) liefert mit dem Test-Key nur einen Treffer. Deshalb lädt die App alle Cocktails über `search.php?f=a` bis `z` und `0` bis `9` (rund 440 Stück mit allen Zutaten) und filtert sie im Browser. Genutzt werden vor allem `strDrink`, `strDrinkThumb`, `strAlcoholic`, `strCategory`, `strIngredient1–15`, `strMeasure1–15` und `strInstructionsDE`.

## Lokal starten

In VS Code mit Live Server öffnen – oder:

```bash
npx serve .
```

## Technik

- **Mehrere HTML-Seiten statt Single-Page:** Start, Finder und Über haben unterschiedliche Aufgaben, und jede Seite bekommt so einen eigenen Titel und eine eigene URL.
- **Formular ohne JavaScript:** `required`, `minlength` und `pattern` prüft der Browser selbst. `method="get"` legt die Eingaben in die URL, dort kann sie später das JavaScript auslesen.
- **Suche im Browser statt per API:** `filter.php?i=` liefert mit dem Test-Key nur einen Treffer, also laden wir alle Cocktails und filtern selbst (siehe Datenquelle).
- **`robots.txt`, `sitemap.xml`, `llms.txt` und JSON-LD:** Damit Suchmaschinen und KI-Crawler wissen, welche Seiten es gibt und worum es geht.

## KI-Log

| Werkzeug | Wofür ich es benutzt habe |
| --- | --- |
| Claude | Ideenfindung: mir fünf Projektideen mit passender öffentlicher API vorschlagen lassen (Blatt 1, Teil B) |
| Claude | Die vorgeschlagenen APIs antesten lassen, ob sie ohne Key und direkt aus dem Browser funktionieren |
| Claude | Blatt 2: HTML auf Semantik prüfen lassen und Lighthouse-Meldungen erklären lassen |
| Claude | Blatt 2: Gramatik und Rechtschreibungsprüfung |


**Ein Fall, in dem KI geholfen hat:** Bevor ich mich auf den Cocktail-Finder festgelegt habe, habe ich die API gründlich testen lassen. Dabei kam heraus, dass `filter.php?i=Gin` mit dem Test-Key immer nur einen einzigen Cocktail liefert. Daraufhin habe ich das Konzept umgestellt: Alle Cocktails werden über `search.php?f=` geladen und im Browser gefiltert. Dadurch geht jetzt sogar die Suche nach mehreren Zutaten.

**Ein Fall, in dem KI falsch lag:** In der ersten Ideenliste stand beim Cocktail-Finder, der Zutaten-Filter liefere Name, Bild und ID und könne nur eine Zutat auf einmal. Das klang plausibel, stimmte aber nicht: Beim genaueren Nachtesten kam pro Zutat immer nur ein Treffer zurück. Seitdem verlasse ich mich bei API-Aussagen nicht auf die Beschreibung, sondern rufe die URL selbst auf und schaue mir die Antwort an.

## Übungsblätter

Was die Blätter ausdrücklich in der README sehen wollen, steht hier, nach Blatt sortiert.

### Blatt 1 · Setup und erster Start

Projektname und Team stehen oben, die Begründung der verworfenen Ideen unter „Warum diese Idee“.

### Blatt 2 · Das Gerüst

- Drei Seiten (`index.html`, `finder.html`, `ueber.html`), jede mit `header`/`nav`, `main`, `footer` und genau einem `h1`
- Suchformular in `finder.html`: Pflichtfeld mit `minlength` und `pattern`, dazu Radio-Buttons, Zahlenfeld und Auswahlliste, ohne JavaScript
- Lighthouse Accessibility: 100 auf allen drei Seiten
- `robots.txt` und `sitemap.xml` im Wurzelverzeichnis

**Bonus, maschinenlesbar:** Im `head` der Startseite stehen zwei JSON-LD-Blöcke: `WebSite` mit `SearchAction` für die Seite selbst und `Recipe` für den Cocktail des Tages. Dazu liegt ein `llms.txt` im Wurzelverzeichnis.

Den ersten Test mit nur dem `WebSite`-Block hat der Rich Results Test mit „Keine Elemente erkannt“ beantwortet. Das JSON-LD war gültig, aber Google zeigt für `WebSite` kein Rich Result mehr an. Mit dem `Recipe`-Block erkennt der Test ein gültiges Element. Die 14 nicht kritischen Hinweise betreffen optionale Felder wie Bewertung, Zubereitungszeit und Video.

![Rich Results Test: 1 gültiges Element erkannt (Rezepte)](docs/rich-results.png)

**Verständnisfragen**

1. *Warum `<button>` statt `<div onclick="…">`?* Ein `button` ist von selbst per Tab erreichbar und löst mit Enter und Leertaste aus, ein `div` bekommt weder Fokus noch Tastenereignisse. Außerdem sagt der Screenreader „Schaltfläche“ an, bei einem `div` hört man nur den Text und weiß nicht, dass man darauf klicken kann.
2. *Wofür ist `name` da?* `name` ist der Schlüssel, unter dem der Wert beim Absenden übertragen wird, bei uns `?zutaten=Gin`. Fehlt es, wird das Feld ohne jede Fehlermeldung einfach nicht mitgeschickt. Bei Radio-Buttons sorgt der gleiche `name` außerdem dafür, dass nur einer ausgewählt sein kann.
3. *Zwei `h1` auf einer Seite: wen stört das?* Screenreader-Nutzer, die sich über die Überschriften einen Überblick verschaffen: Zwei `h1` sind zwei Hauptthemen, und man weiß nicht, worum es auf der Seite geht. Suchmaschinen stört es auch, weil das `h1` ein starkes Signal für das Thema ist. Der Browser zeigt beides problemlos an, sichtbar geht also nichts kaputt.
