
# Groupon Website (MERN Stack)

A Groupon clone built with React (frontend) and Node.js/Express/MongoDB (backend).

## Project Structure

- `client/` — React frontend
- `server/` — Node.js/Express backend

## Installation & Running

### 1. Frontend (React)
```bash
cd client
npm install
npm start
```

### 2. Backend (Node.js/Express)
```bash
cd server
npm install
npm run dev   # For development (nodemon)
# or
npm start     # For production
```

- Make sure MongoDB is running locally or update your `.env` with your connection string.
- The backend will start on `http://localhost:5000` by default.
- The frontend will typically start on `http://localhost:3000`.

## Features
- User registration/login (JWT)
- Merchant registration/login (JWT)
- Role-based route protection
- Merchants can manage their own deals
- Ready for admin and user dashboard features

---

Feel free to open issues or contribute!
