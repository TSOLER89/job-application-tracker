# JobTrack – Job Application Tracker

JobTrack är en responsiv webbapplikation för att hålla koll på jobbansökningar.

Applikationen är byggd som ett individuellt projekt i kursen **Webbapplikationer och mobil utveckling**.

Frontend är byggd med React och kommunicerar med ett eget ASP.NET Core Web API. Data sparas i SQL Server med Entity Framework Core.

## Funktioner

- Visa alla jobbansökningar
- Skapa en ny jobbansökan
- Redigera en befintlig jobbansökan
- Ta bort en jobbansökan
- Ladda upp och visa bilder
- Söka efter företag, tjänst eller plats
- Filtrera ansökningar efter status
- Visa statistik över ansökningar
- Felmeddelanden om API-anrop misslyckas
- Responsiv design för desktop och mobil

## Statusar

En jobbansökan kan ha någon av följande statusar:

- Ansökt
- Intresserad
- Intervju
- Erbjudande
- Avslag

## Teknik

### Frontend

- React
- JavaScript
- Vite
- CSS
- Fetch API

### Backend

- ASP.NET Core Web API
- C#
- Entity Framework Core
- SQL Server LocalDB
- Swagger

## Repository

Frontend:

https://github.com/TSOLER89/job-application-tracker

Backend:

https://github.com/TSOLER89/job-application-tracker-api

## Förutsättningar

För att köra hela applikationen lokalt behövs:

- Node.js och npm
- .NET 10 SDK
- SQL Server LocalDB
- Git

Frontend körs på:

```text
http://localhost:5173
```

Backend körs på:

```text
http://localhost:5250
```

## 1. Klona backend

```bash
git clone https://github.com/TSOLER89/job-application-tracker-api.git
cd job-application-tracker-api
```

Installera beroenden:

```bash
dotnet restore
```

Skapa/uppdatera databasen med Entity Framework-migrationen:

```bash
dotnet ef database update
```

Om kommandot `dotnet ef` inte finns kan Entity Framework CLI installeras med:

```bash
dotnet tool install --global dotnet-ef
```

Starta API:t:

```bash
dotnet run
```

Backend ska nu vara tillgänglig på:

```text
http://localhost:5250
```

Swagger finns på:

```text
http://localhost:5250/swagger
```

## 2. Klona frontend

Öppna en ny terminal.

```bash
git clone https://github.com/TSOLER89/job-application-tracker.git
cd job-application-tracker
```

Installera npm-paketen:

```bash
npm install
```

Starta frontend:

```bash
npm run dev
```

Öppna sedan:

```text
http://localhost:5173
```

## API-konfiguration

Frontend använder miljövariabeln:

```env
VITE_API_BASE_URL=http://localhost:5250
```

Den finns i projektets `.env`-fil och används för kommunikationen med backend.

## API-endpoints

| Method | Endpoint                           | Funktion                    |
| ------ | ---------------------------------- | --------------------------- |
| GET    | `/api/JobApplications`             | Hämtar alla jobbansökningar |
| POST   | `/api/JobApplications`             | Skapar en jobbansökan       |
| PUT    | `/api/JobApplications/{id}`        | Uppdaterar en jobbansökan   |
| DELETE | `/api/JobApplications/{id}`        | Tar bort en jobbansökan     |
| POST   | `/api/JobApplications/uploadimage` | Laddar upp en bild          |

## Tekniska val

### React och komponenter

Frontend är uppdelad i flera komponenter, till exempel formulär, lista, kort, statistik och filter. Det gör koden mer strukturerad och komponenterna enklare att underhålla.

### Separat API-service

Alla HTTP-anrop är samlade i `applicationService.js` istället för att ligga direkt i `App.jsx`.

Det gör att komponenterna kan fokusera på UI och state medan kommunikationen med backend hålls separat.

### ASP.NET Core Web API

Backend är byggd med ASP.NET Core eftersom projektet behöver ett eget API för att hantera jobbansökningarna.

API:t använder separata endpoints för GET, POST, PUT och DELETE.

### Entity Framework Core och SQL Server

Entity Framework Core används tillsammans med SQL Server LocalDB för att spara jobbansökningarna.

Det innebär att informationen finns kvar även när backend startas om.

### Bilduppladdning

Bilder laddas upp till backend och sparas i `wwwroot/uploads`.

Databasen lagrar sökvägen till bilden istället för själva bildfilen.

### CORS

Backend tillåter anrop från React-applikationen på:

```text
http://localhost:5173
```

Det gör att frontend och backend kan kommunicera trots att de körs på olika portar.

### Responsiv design

CSS använder media queries för att anpassa layouten till olika skärmstorlekar.

På större skärmar visas jobbansökningarna i flera kolumner medan mobilversionen använder en kolumn och anpassade kontroller.

## Projektstruktur

```text
src/
├── components/
│   ├── ApplicationCard.jsx
│   ├── ApplicationFilters.jsx
│   ├── ApplicationForm.jsx
│   ├── ApplicationList.jsx
│   ├── ApplicationStats.jsx
│   └── Header.jsx
│
├── services/
│   └── applicationService.js
│
├── utils/
│   └── imageUrl.js
│
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## Felhantering

API-anrop ligger i `try/catch`.

Om ett API-anrop misslyckas visas ett felmeddelande i gränssnittet istället för att applikationen kraschar.

## Databas

Databasen skapas lokalt som:

```text
JobTrackDb
```

Connection string finns i backendprojektets `appsettings.json`.

## Utvecklare

Tsoler Hayitian
20-09-2026
Systemutvecklare .NET  
TUC Yrkeshögskola
