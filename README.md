# Cocktail-Finder

Der Cocktail-Finder zeigt dir, welche Cocktails du mit den Zutaten mixen kannst, die du gerade zu Hause hast, auch mit mehreren Zutaten gleichzeitig. Dazu gibt es jeden Tag einen Cocktail des Tages, der für alle Besucher derselbe ist.

**Live:** folgt mit Termin 5 (GitHub Pages)
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

- **Suche im Browser statt per API:** `filter.php?i=` liefert mit dem Test-Key nur einen Treffer, also laden wir alle Cocktails und filtern selbst (siehe Datenquelle).

## KI-Log

| Werkzeug | Wofür ich es benutzt habe |
| --- | --- |
| Claude | Ideenfindung: mir fünf Projektideen mit passender öffentlicher API vorschlagen lassen (Blatt 1, Teil B) |
| Claude | Die vorgeschlagenen APIs antesten lassen, ob sie ohne Key und direkt aus dem Browser funktionieren |


**Ein Fall, in dem KI geholfen hat:** Bevor ich mich auf den Cocktail-Finder festgelegt habe, habe ich die API gründlich testen lassen. Dabei kam heraus, dass `filter.php?i=Gin` mit dem Test-Key immer nur einen einzigen Cocktail liefert. Daraufhin habe ich das Konzept umgestellt: Alle Cocktails werden über `search.php?f=` geladen und im Browser gefiltert. Dadurch geht jetzt sogar die Suche nach mehreren Zutaten.

**Ein Fall, in dem KI falsch lag:** In der ersten Ideenliste stand beim Cocktail-Finder, der Zutaten-Filter liefere Name, Bild und ID und könne nur eine Zutat auf einmal. Das klang plausibel, stimmte aber nicht: Beim genaueren Nachtesten kam pro Zutat immer nur ein Treffer zurück. Seitdem verlasse ich mich bei API-Aussagen nicht auf die Beschreibung, sondern rufe die URL selbst auf und schaue mir die Antwort an.

## Übungsblätter

Was die Blätter ausdrücklich in der README sehen wollen, steht hier, nach Blatt sortiert.

### Blatt 1 · Setup und erster Start

Projektname und Team stehen oben, die Begründung der verworfenen Ideen unter „Warum diese Idee“.
