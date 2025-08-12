# Library Management System

This is a monolithic system for managing a library, allowing administration of users, books, and loans.  
The backend is built with **Node.js** and **Express**, the database is managed with **Postgres**, and the frontend is located inside the `app` folder.

---

## Technologies Used

- Node.js  
- Express.js  
- Postgres  
- HTML, CSS, JavaScript (Frontend)  
- csv-parser (for loading data from CSV files)  
- vite  

---

## Project Structure

```bash
biblioteca/
│
├── docs/           # Documentation and resources
│       ...
├── app/            # Frontend (HTML, CSS, JS)
│       ...
├── server/         # Backend (Express API)
│       ...
├── index.html      # Main HTML file
├── .env            # Environment variables (do not commit)
├── .gitignore      # Git ignore rules
└── README.md       # Project documentation

Installation and Setup
Prerequisites

    Node.js installed (recommended version 16+)

    PostgreSQL installed and running

Steps

    Install dependencies:

npm install

    Create and configure the .env file in the project root:

DB_HOST=localhost
DB_USER=santiago
DB_PASSWORD=password
DB_NAME=db_name
DB_PORT=5432

    Start the backend:

node server/index.js

    Start the frontend in development mode:

npm run dev

Usage

    Access the application in your browser at the URL configured by Vite (usually http://localhost:3000).

    The backend exposes REST APIs to manage clients, invoices, transactions, and more.

    The frontend consumes these APIs to display and modify data.

Basic API Routes Overview (examples)

    GET /clients - List all clients

    GET /clients/:id_client - Get client by ID

    POST /clients - Create a new client

    PUT /clients/:id_client - Update client

    DELETE /clients/:id_client - Delete client

    GET /pending_invoices - List pending invoices

    GET /transactions_by_platform/:platform - List transactions filtered by platform