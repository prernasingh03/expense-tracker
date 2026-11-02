# Expense Tracker

A full-stack expense tracker with persistent transaction history, built using Node.js, Express, MongoDB, and a JavaScript frontend.

![Expense Tracker screenshot](screenshots/home.png)

## Features
- Create, view, update, and delete income and expense transactions
- Live balance, income, and expense totals
- Filter by type and date range
- MongoDB schema validation with clear error messages
- Backend organized into routes, controllers, and models
- Responsive interface for desktop and mobile

## Tech Stack
- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Frontend:** HTML, CSS, JavaScript

## Setup
You need [Node.js](https://nodejs.org) and [MongoDB Community Server](https://www.mongodb.com/try/download/community) installed.

1. Clone this repository and open its folder.
2. Install the packages:
   ```bash
   npm install
   ```
3. Copy `.env.example` to a new file named `.env`.
4. Start the app:
   ```bash
   npm start
   ```
5. Open http://localhost:3000.

## API Endpoints
Base URL: `/api/transactions`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List transactions. Optional filters: `type`, `category`, `from`, `to` |
| GET | `/summary` | Get income, expense, and balance totals. Accepts the same filters |
| GET | `/:id` | Get one transaction |
| POST | `/` | Create a transaction |
| PUT | `/:id` | Update a transaction |
| DELETE | `/:id` | Delete a transaction |

## Project Structure
```text
expense-tracker/
├── server.js                 # Loads settings, connects to MongoDB, starts the server
├── public/                   # Frontend
└── src/
    ├── app.js                # Express setup
    ├── config/db.js          # MongoDB connection
    ├── controllers/          # Request logic
    ├── middleware/           # Error handling
    ├── models/               # Mongoose schema
    └── routes/               # API routes
```

See [docs/theory.md](docs/theory.md) for how the project works.

## Author
Prerna Singh
