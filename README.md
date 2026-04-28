<H1 align ="center" > MERN EMPLOYEE SALARY MANAGEMENT </h1>
<h5  align ="center">Fullstack open source employee salary management application made with MySql, Express, React & Nodejs (MERN)</h5>

---

## Quick Project README

This repository contains a fullstack MERN-style (MySQL + Node/Express + React + Vite) employee salary management application with separate Backend and Frontend folders.

This README was generated/updated to provide clear setup instructions, highlight the features that existed before modifications, document AI tools used during the update, and note any tickets handled differently.

Table of contents
- [Setup](#setup)
- [Why I chose this HRMS](#features-pre-modification)
- [AI tools used](#ai-tools-used)
- [Tickets handled differently](#tickets-handled-differently)
- [Tech stack & notes](#tech-stack--notes)
- [Author & License](#author--license)

## Setup

Prerequisites
- Node.js (>=16)
- npm or yarn
- MySQL server

Backend
1. Copy the example or create a `.env` file in the Backend folder and set the variables below.

Required environment variables (Backend):

```
DB_NAME=your_database_name
DB_USER=your_db_user
DB_PASS=your_db_password
DB_HOST=localhost
DB_PORT=3306
SESS_SECRET=some_secure_session_secret
APP_PORT=5000
```

2. Import the database schema if you want the sample tables and data (file: [Backend/db/db_penggajian3.sql](Backend/db/db_penggajian3.sql)).

3. Install and run the Backend:

```bash
cd Backend
npm install
npm start
```

Notes:
- The backend reads DB and session configuration from environment variables in [Backend/config/Database.js](Backend/config/Database.js) and [Backend/index.js](Backend/index.js).
- CORS origin is currently set to `http://localhost:3000` in the backend; if your frontend runs on another port (Vite default: 5173), update the CORS origin in [Backend/index.js](Backend/index.js) or set up a proxy.

Frontend
1. Install and run the frontend (Vite):

```bash
cd Frontend
npm install
npm run dev
```

2. The frontend runs with Vite (default port 5173). Open the URL printed by Vite (usually http://localhost:5173).

If the backend and frontend are on different ports, ensure CORS and session origin configurations match.

## Why I chose this  HRMS
The following features were already present in the codebase before the README update:

- Admin authentication (login) and session management
- Employee (pegawai) CRUD: add, edit, remove employees
- Position (jabatan) CRUD: add, edit, remove positions
- Attendance (kehadiran) input, edit, and delete
- Overtime (lembur) management and forms
- Salary data input, edit, delete, and payroll generation
- Salary deduction/setting (potongan gaji)
- Transaction routes and controllers for payroll
- Reports: payroll reports, attendance reports, payslips
- Separate Admin and Pegawai (employee) dashboards and login flows
- Change-password pages for Admin and Pegawai
- 404 / Not Found page
- Responsive UI built with React + Tailwind

Files of interest (core entry points)
- Backend entry: [Backend/index.js](Backend/index.js)
- DB config: [Backend/config/Database.js](Backend/config/Database.js)
- Frontend routes: [Frontend/src/config/Routes/index.jsx](Frontend/src/config/Routes/index.jsx)

## AI tools used
- **GitHub Copilot (assistant)**: helped draft this README and suggested concise setup steps and environment variable names.
- **GPT-5 mini**: used to help structure the README content and produce clear, user-friendly instructions.

Both tools were used only to assist with documentation and small, non-invasive content edits (no functional code changes were made to application logic as part of this README update).

## Tickets handled differently
- No issue/ticket was provided with this request. I created/updated the README per your instructions and did not modify any existing tickets or functionality.

If you have an existing ticket list and want me to handle or reassign any items, point me to the ticket(s) or describe the task and I will create a suggested plan.

## Tech stack & additional notes
- Frontend: React (Vite), Tailwind CSS, react-router-dom, localforage, Redux patterns in the UI.
- Backend: Node.js, Express, Sequelize (used as session store), MySQL.
- Database: MySQL; sample SQL file at [Backend/db/db_penggajian3.sql](Backend/db/db_penggajian3.sql).

Useful commands

```bash
# Start backend
cd Backend && npm install && npm start

# Start frontend (dev)
cd Frontend && npm install && npm run dev
```


