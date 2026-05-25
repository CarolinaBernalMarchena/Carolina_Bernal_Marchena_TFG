# TrinketBox
Trinketbox is a web application for digital collecting. Trinketbox allows users to open surprise boxes, complete collections and trade items.
## Technologies: 
- **Angular**
- **Node.js**
- **SCSS**
- **HTML**

## Prototype: 
https://marvelapp.com/prototype/94h31h3

# Running the App Locally

## Prerequisites

Make sure you have the following installed before getting started:

- **Node.js** v18 or higher — [nodejs.org](https://nodejs.org)
- **npm** v9 or higher (comes with Node.js)
- **Angular CLI** v17 or higher:
  ```bash
  npm install -g @angular/cli
  ```

---

## Project Structure

The project has two separate parts:

```
/
├── backend/       # Node.js + Express + SQLite API
└── frontend/      # Angular app
```

---

## 1. Setting Up the Backend

Navigate to the backend folder and install dependencies:

```bash
cd backend
cd trinketbox-node
npm install
```

Start the server:

```bash
node index.js
```

The API will run on **http://localhost:3001** by default.

> The database is SQLite and will be created automatically at `trinketbox-database/database.sqlite` on first run. No additional database setup is needed.

---

## 2. Setting Up the Frontend

Open a new terminal, navigate to the frontend folder and install dependencies:

```bash
cd frontend
cd angularTFG
npm install
```

Start the Angular development server:

```bash
ng serve
```

The app will be available at **http://localhost:4200**.

---

## 4. Environment Configuration

By default the frontend points to `http://localhost:3001` as the API base URL. If you change the backend port, update the `apiUrl` value in:

```
src/app/services/api.ts
```

---

## Quick Start Summary

```bash
# Terminal 1 — backend
cd backend/trinketbox-node && npm install && node index.js

# Terminal 2 — frontend
cd frontend/angularTFG && npm install && ng serve
```

Then open **http://localhost:4200** in your browser.

---

## Notes

- SQLite is file-based, so no external database service is required for local development.
- Daily token rewards are calculated based on the `Europe/Madrid` timezone.
