# TrinketBox
Trinketbox is a web application for digital collecting. Trinketbox allows users to open surprise boxes, complete collections and trade items.
## Technologies: 
- **Angular**
- **Node.js**
- **SCSS**
- **HTML**

## Prototype: 
https://marvelapp.com/prototype/94h31h3

## Deployment: 
https://carolina-bernal-marchena-tfg-2.onrender.com

*This application is deployed using Render’s free web service. It is important to note that the backend runs on a non-persistent environment, meaning that the filesystem is ephemeral. As a result, any locally stored data (including files such as SQLite databases) will not persist across deployments, restarts, or periods of inactivity. The application is designed with this constraint in mind, and data persistence is handled accordingly through stateless or externally managed mechanisms where required.*

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
npm star
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
cd backend/trinketbox-node && npm install && npm start

# Terminal 2 — frontend
cd frontend/angularTFG && npm install && ng serve
```

Then open **http://localhost:4200** in your browser.

---
## Some screenshots from the project:

<img width="1896" height="920" alt="image" src="https://github.com/user-attachments/assets/7422729a-c7eb-44d6-99f6-586ff3a09f4a" />
*Main page of TrinketBox, featuring the chatbot avatar and navigation to the main sections of the app: shop, trades, collections and profile.*


<img width="1897" height="937" alt="image" src="https://github.com/user-attachments/assets/3f1c4848-a778-4e87-897c-17daed7249d8" />
*Shop view, showing the three daily available collections. The countdown on the left indicates the time remaining until the next shop refresh, which is the same for all users.*


<img width="1893" height="931" alt="image" src="https://github.com/user-attachments/assets/2d8fb152-9d97-4305-81d5-0da6fde9ad72" />
*Collection view, showing the user's collectibles. Obtained ones are displayed in colour, while missing ones appear in greyscale with a lock icon.*


<img width="1896" height="942" alt="image" src="https://github.com/user-attachments/assets/a58f3b85-91cb-47b7-9337-320f7ecdff3e" />
*Trade market, where users can propose and accept collectible exchanges with other users, as well as participate in special platform trades to obtain exclusive collectibles.*


<img width="1897" height="935" alt="image" src="https://github.com/user-attachments/assets/07c1c1ea-816b-4323-8a1a-d0ec6dababb5" />
*User profile statistics, including an activity chart for the last 7 days (coins earned and spent, trades and achievements) built with ApexCharts.*


<img width="1896" height="937" alt="image" src="https://github.com/user-attachments/assets/b1a1c759-b88a-4ba6-88b8-cd252828bf93" />
*User profile achievements, Obtained ones are displayed in colour, while missing ones appear in greyscale with a lock icons.*


<img width="1856" height="936" alt="Captura de pantalla 2026-06-16 140249" src="https://github.com/user-attachments/assets/c451b263-cab7-46a3-a725-7f9e93da2e6b" />
<img width="1901" height="759" alt="Captura de pantalla 2026-06-16 140259" src="https://github.com/user-attachments/assets/4c3cc1df-d3b4-43c6-a359-804f765272cc" />
<img width="1891" height="938" alt="Captura de pantalla 2026-06-16 140312" src="https://github.com/user-attachments/assets/119d38f0-3262-4a64-9895-d6c2c2b7a2ec" />
<img width="1898" height="938" alt="Captura de pantalla 2026-06-16 140324" src="https://github.com/user-attachments/assets/45c98450-cb86-45ac-9556-2e8bf9a2ce89" />
<img width="1901" height="939" alt="Captura de pantalla 2026-06-16 140334" src="https://github.com/user-attachments/assets/75224a0f-452a-48a9-a5e3-0bcedc45b3a6" />
*Admin panel, from which the administrator can manage collections, special trades, collectible probabilities and shop costs.*

## Notes

- SQLite is file-based, so no external database service is required for local development.
- Daily token rewards are calculated based on the `Europe/Madrid` timezone.
