## Project layout

```
transport-accidents-angular/
├─ api/                      # Node/Express backend serving JSON data
│  ├─ index.js               # Express app, routes: /accidents, /accidents/:id
│  ├─ data/
│  │  └─ accidents.json      # Static dataset used by the API
│  ├─ package.json           # Backend scripts and deps
│  └─ yarn.lock
└─ front/                    # Angular frontend
   ├─ angular.json           # Angular workspace config
   ├─ package.json           # Frontend scripts and deps
   ├─ public/                # Static assets copied to output
   └─ src/
      ├─ index.html
      ├─ main.ts
      ├─ styles.scss
      └─ app/
         ├─ app.config.ts    # Angular providers configuration
         ├─ app.html         # Root component template
         ├─ app.routes.ts    # App routes
         ├─ app.ts           # Root component that loads data on init
         ├─ components/
         │  └─ filter/       # Filter UI: categories, severity, date range
         │     ├─ filter.component.ts/.html/.scss
         │     ├─ filter.constants.ts
         │     └─ filter.types.ts
         ├─ models/
         │  └─ accident.ts   # Accident interface
         ├─ pages/
         │  ├─ accident/     # Accident details page
         │  ├─ accidents-map/# Map with Leaflet markers and popups
         │  │  └─ components/accident-popup/
         │  └─ accidents-table/ # Table view of accidents
         ├─ services/
         │  └─ accidents.service.ts # HTTP client for the API
         └─ stores/          # Signals stores for state management
            ├─ accidents/    # Accidents store (filters + data)
            └─ filter/       # Filter store (form state)
```

## How to run

Open two terminals, one for the API and one for the frontend.

1. Backend (API)

- Directory: `api/`
- Scripts: defined in `api/package.json`
- Start server:

```bash
# from api/
yarn install  # or npm install
yarn start    # starts Express on http://localhost:4000
```

Endpoints

- GET http://localhost:4000/accidents – list of accidents
- GET http://localhost:4000/accidents/:id – single accident by id

2. Frontend (Angular)

- Directory: `front/`
- Start dev server:

```bash
# from front/
yarn install  # or npm install
ng serve      # or: yarn start
```

- Open http://localhost:4200/
- The app fetches data from http://localhost:4000/accidents (see `src/app/services/accidents.service.ts`).
