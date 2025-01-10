# Einfacher Sendeplan für laut.fm Stationen

Dieses Repository bietet einen Sendeplan für laut.fm-Stationen, der leicht konfiguriert und angepasst werden kann.
Optional können auch Bilder für jeden Eintrag hinzugefügt werden.

## Funktionen
- **Sendeplan für laut.fm Stationen**
- **Umfangreiche CSS**, um den Sendeplan optisch an die eigenen Bedürfnisse anpassen zu können.
- **Optional können für jede Sendung Bilder im Format 160x80 angezeigt werden.**
- **Der Sendeplan ist responsiv** und passt sich an verschiedene Bildschirmgrößen an.
- **Automatische Aktualisierung** des Sendeplans immer zum Stundenwechsel.

## Konfigurationen
Im Code können folgende Konfigurationen vorgenommen werden:

```javascript
// Name der laut.fm Station
const station_name = "";

// Option zum Anzeigen der Bilder (true / false)
const images = true;

// URL inkl. Unterordner, wo die Bilder zu suchen sind
const images_url = "";

// Wenn true und images auch true ist, wird der
// benötigte Dateiname der Bilder angezeigt (true / false)
const show_img_name = false;

// Das Standardbild, wenn das eigentliche Bild nicht gefunden wird.
const img_default = ""; // Die gesamte URL ist "images_url + img_default"

// Die angezeigten Wochentage
const daysOfWeek = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
```

### Beschreibung der Optionen
- **`station_name`**: Name der laut.fm Station, deren Sendeplan angezeigt werden soll.
- **`images`**: Legt fest, ob Bilder angezeigt werden (true) oder nicht (false).
- **`images_url`**: URL zu dem Ordner, in dem die Bilder liegen.
- **`show_img_name`**: Wenn `true`, wird der benötigte Dateiname der Bilder angezeigt (nur wenn `images = true`).
- **`img_default`**: Standardbild, das verwendet wird, falls ein Bild nicht gefunden wird.
- **`daysOfWeek`**: Liste der Wochentage, die angezeigt werden.

## Bilder
- Bilder werden in einer Größe von **160px Breite** und **80px Höhe** angezeigt.
- Der Dateiname der Bilder muss dem Format `{playlist.id}.png` entsprechen.

## Voraussetzungen
Um den Sendeplan korrekt darzustellen, müssen folgende Dateien eingebunden werden:
- **jQuery** (Version 3.6.0 oder höher)
- **lfm-schedule.css** (enthält das Styling für den Sendeplan)
- **lfm-schedule.js** (beinhaltet die Logik für den Sendeplan)

## HTML-Grundgerüst
Die Datei `schedule.html` beinhaltet das Grundgerüst für den Sendeplan. In dieser Datei müssen die oben genannten Ressourcen (`lfm-schedule.css`, `jQuery` und `lfm-schedule.js`) eingebunden werden.

## Verwendung
1. **Hochladen**: Lade die benötigten Dateien auf deinem Server oder Webspace hoch
1. **Station anpassen**: Ändere den Namen der Station in der Variable `station_name`.
2. **Bilder aktivieren** (optional): Setze `images` auf `true` und gib die URL für die Bilder in `images_url` an.
3. **Standardbild festlegen**: Wähle ein Standardbild, das angezeigt wird, wenn ein Bild nicht gefunden wird, und trage es in `img_default` ein.
4. **Wochentage einstellen**: Passe die Wochentage in `daysOfWeek` an, falls nötig.

## Beispiel
Hier ist ein Beispiel für eine Konfiguration:

```javascript
const station_name = "80er-90er";
const images = true;
const images_url = "https://tools.paeddy.de/img/sendeplan-demo/";
const show_img_name = true;
const img_default = "default.png";
const daysOfWeek = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
```

## Demo
Eine Live-Demo des Sendeplans ist verfügbar unter:
[https://tools.paeddy.de/sendeplan-demo](https://tools.paeddy.de/sendeplan-demo)

## Lizenz
Dieses Projekt steht unter der MIT-Lizenz. Siehe die Datei [LICENSE](LICENSE) für weitere Informationen.
