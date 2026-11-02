# Project Theory

## Problem
People lose track of small daily spending. This app stores every income and expense permanently and shows the current balance.

## How It Works
Example: adding an expense.

1. The user submits the form in `public/app.js`.
2. The browser sends `POST /api/transactions` with JSON data.
3. `express.json()` converts the JSON into `req.body`.
4. The route sends the request to `createTransaction`.
5. Mongoose validates the data against the schema and saves it in MongoDB.
6. The server responds with `201 Created`.
7. The frontend reloads the list and totals.

## Architecture
The backend separates each responsibility:

| Layer | File | Job |
|---|---|---|
| Route | `transactionRoutes.js` | Matches a URL and HTTP method to a controller |
| Controller | `transactionController.js` | Handles the request and sends the response |
| Model | `Transaction.js` | Defines the data shape and validation rules |
| Middleware | `errorHandler.js` | Turns errors into consistent JSON responses |

This makes the code easier to test, read, and change.

## Database Design
There is one collection, `transactions`.

| Field | Type | Rules |
|---|---|---|
| `title` | String | Required, up to 100 characters |
| `amount` | Number | Required, at least 0.01 |
| `type` | String | Required, `income` or `expense` |
| `category` | String | Required, up to 50 characters |
| `date` | Date | Required |
| `note` | String | Optional, up to 300 characters |

`timestamps: true` adds `createdAt` and `updatedAt` automatically.

## Key Concepts
- **REST API:** URLs identify resources, and HTTP methods describe the action: GET reads, POST creates, PUT updates, and DELETE removes.
- **Status codes:** `200` OK, `201` created, `204` deleted with no body, `400` bad input, `404` not found, `500` server error.
- **Schema validation:** Mongoose rejects bad data before it reaches the database. `runValidators: true` applies these rules to updates too.
- **Middleware:** Functions that run in order between the request and the response.
- **Aggregation:** `/summary` uses `$match` and `$group` so MongoDB can calculate totals without sending every record to Node.js.
- **Environment variables:** `.env` keeps settings out of the code and out of GitHub.

## Challenges
- **Route order:** `/summary` must come before `/:id`, or Express treats "summary" as an ID.
- **Async errors:** Express 4 does not catch rejected promises automatically, so `asyncHandler` passes them to the error middleware.
- **Date ranges:** the `to` filter is extended to the end of that day, so transactions on the final day are included.

## Future Improvements
- User accounts, so each person sees only their own data
- Pagination for long transaction lists
- Monthly charts and budgets
- CSV export
- Automated tests
