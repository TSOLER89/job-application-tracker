JobTrack – Frontend

This repository contains the frontend web application for JobTrack, a project for the course Web Applications and Mobile Development.

The web application is built with React and Vite and communicates with a separate ASP.NET Core Web API to read and save job applications.

Features

View all job applications

Create a new job application

Edit an existing job application

Delete a job application

Upload and display an image

Search by company, position, or location

Filter applications by status

View application statistics

Show error messages if an API request fails

Responsive layout for desktop and mobile

Technologies

React

JavaScript

Vite

CSS

Fetch API

Backend

This frontend uses the following backend repository:

https://github.com/TSOLER89/job-application-tracker-api

The backend must be running before the web application can fetch or save data.

Requirements

To run the frontend locally, you need:

Node.js

npm

Git

Installation and Running the Project

Clone the repository:

git clone https://github.com/TSOLER89/job-application-tracker.git
cd job-application-tracker

Install dependencies:

npm install

Make sure the backend is running on:

http://localhost:5250

The project .env file contains:

VITE_API_BASE_URL=http://localhost:5250

Start the frontend:

npm run dev

Then open:

http://localhost:5173

Vite is configured to use port 5173.

Project Structure

src/
├── components/
│ ├── ApplicationCard.jsx
│ ├── ApplicationFilters.jsx
│ ├── ApplicationForm.jsx
│ ├── ApplicationList.jsx
│ ├── ApplicationStats.jsx
│ └── Header.jsx
│
├── services/
│ └── applicationService.js
│
├── utils/
│ └── imageUrl.js
│
├── App.jsx
├── App.css
├── index.css
└── main.jsx

Technical Choices

Component-Based React Structure

The interface is divided into smaller components for the form, application list, application cards, filters, and statistics.

This makes the code easier to read, maintain, and develop step by step.

Separate API Service

All HTTP requests are handled in applicationService.js instead of directly inside the React components.

This separates API communication from the UI and state management.

Environment Variable for the API Address

The backend address is loaded from .env using:

VITE_API_BASE_URL

This avoids repeating the backend URL in several files.

Responsive Design

CSS media queries are used to adapt the layout to different screen sizes.

On larger screens, job applications are displayed in multiple columns. On smaller mobile screens, the layout changes to one column with mobile-friendly controls.

Error Handling and User Feedback

API requests are handled with try/catch.

If an API request fails, an error message is shown in the interface instead of the application crashing.

The user is also asked to confirm before deleting a job application.

Reflection

I chose to divide the frontend into clear React components and keep the API requests in a separate service file.

This made it easier to work on each part of the application separately and made the code easier to understand.

Related Repository

Backend:

https://github.com/TSOLER89/job-application-tracker-api

## Interface and feedback

Visitors first see a welcome page with **Skapa konto** and **Logga in**. After registering or signing in, they see only their own applications and images. **Logga ut** revokes the current session.

Web login uses an HttpOnly cookie and CSRF protection; session tokens and passwords are not saved in localStorage. A valid persistent session is restored on reload. The backend must have the account migration applied (`dotnet ef database update`). Existing applications are preserved separately until a local operator assigns their owner; see the backend README's **Preserving Existing Applications** section.

The account password is a new JobTrack password. Gmail and Outlook inbox connections, email verification, password recovery, and the public demo are upcoming stages.

The interface uses midnight blue and copper accents, neutral surfaces, consistent icons, and a compact account header. Desktop screens use a persistent side navigation; narrow screens use a horizontal navigation. Status colors and text labels remain distinct. The mobile app shares the same visual language.

The workspace styles live in `src/styles/workspace.css`, separate from base component styles. Buttons keep visible keyboard focus and touch targets; reduced-motion settings are respected. Creating/editing applications, account access and existing statistics use the same API.

* Loading indicators and unknown statistics (`—`) distinguish loading from an empty list.
* Connection errors offer a retry action. Previously loaded data remains visible and is labelled as such.
* Creating, editing, and deleting an application displays a dismissible confirmation.
* Saving errors retain the form and selected image. API validation messages appear in the interface.
* Search and status controls have visible labels. Empty search results offer a reset action.
* Keyboard focus indicators, a skip link, and live feedback support keyboard and screen-reader navigation.
* The layout adapts from three columns to one and respects reduced-motion settings.

Before a demo, check creating, editing, searching, status filtering, failed saves, and retrying a failed load at desktop and narrow mobile widths.

## Dashboard statistics

The overview shows four compact counters (total jobs, submitted, interviews, offers), **Behöver din uppmärksamhet** (today and past dates, oldest first), and **Kommande händelser** (future dates, nearest first). Each event list initially shows three items and can expand. Only interested-job deadlines and submitted/interview follow-ups are included; offers and rejections are excluded. Missing or invalid dates produce no event. Initial loading/error states do not pretend that the account has no events.

Selecting an event opens `/applications?application={id}`, resets list filters and highlights/focuses the matching card. The link supports reload, browser history and opening in a new tab. The application list remains on its own page. Labels and groups refresh at local midnight. All information comes from the signed-in account's existing API response; no database migration is needed.

Run grouping checks with `node --test tests/upcoming-events.test.mjs`.

When an application date is entered, a follow-up date before it is rejected with a Swedish error message. The same day or a later day is allowed, including after the application deadline. Interested jobs do not yet have an application date.

Application cards show planning labels calculated from the user's local calendar day. Deadlines apply to **Intresserad** jobs; follow-ups apply to **Ansökt** and **Intervju**. Dates within three days are highlighted, due/overdue items use a stronger color, and every label includes text. **Erbjudande** and **Avslag** keep their saved dates without active prompts. Clear or move a follow-up date after completing it. Labels refresh at midnight and when returning to the app.

Check the notice rules with `node --test tests/planning-notices.test.mjs`. These are in-app labels; background notifications are a later stage.

Create and edit forms also provide optional **Sista ansökningsdag** and **Uppföljningsdatum** fields. Saved dates appear on application cards; clear a field and save to remove it. Both fields work for interested jobs as well. The API needs the `AddApplicationPlanningDates` migration. This stage stores dates; scheduled notifications come later.

After signing in, `/` shows the compact overview. The separate `/applications` page contains application cards, search, filters, and the create/edit form. `/statistics` contains full statistics and the monthly chart. Use **Översikt · Jobbansökningar · Statistik** to switch pages; browser back/forward and reload preserve the selected page. Unsaved form fields and filters remain in place when switching within the app. A production host must route these frontend URLs to `index.html`.

The statistics page shows the total number of jobs and all five current statuses. Its monthly chart covers the current calendar month and the preceding five months, using each application's application date. Changing its status does not move it to another month.

Interested jobs are excluded from the chart. Missing or invalid dates and future dates are reported separately. All-time status totals still include these records. Search and status filters only affect the application list; statistics always cover the signed-in account's complete list. Changes appear after a successful save or deletion; focus refresh also picks up changes from the mobile app.

Run the calendar and aggregation checks with Node.js 22 or later:

```bash
node --test tests/application-statistics.test.mjs
```

## Developer

Tsoler Hayitian
.NET System Developer student
