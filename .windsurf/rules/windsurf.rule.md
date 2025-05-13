---
trigger: always_on
---

This project is a Groupon clone built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and styled using Bootstrap. The goal is to replicate Groupon’s core features for users, merchants, and administrators, focusing on role-based functionality, clean UI/UX, and scalable architecture.

👤 User Features
Registration & Login with secure password hashing

JWT-based authentication

Browse Deals: Home page with featured/local/filtered deals

Search & Category Filtering

Deal Details: Full page view of each deal with merchant info and terms

Save/Favorite Deals for later

Fake Checkout Flow (no payment for now) — button to “Claim” or “Reserve” deals

User Dashboard: View claimed deals and profile info

🏪 Merchant Features
Merchant Registration: Separate flow from user registration

Merchant Dashboard:

Add/edit/delete deals

View basic analytics (views, redemptions, etc.)

Manage merchant profile (business name, logo, contact info)

Status of Deals: Published / Draft / Expired

🛠️ Admin Features
Admin Dashboard

View/manage all users, merchants, and deals

Ban/unban users or merchants

Moderate reported deals

System Overview: Stats for total users, deals, active merchants, etc.

🔐 Auth & Roles
JWT stored in HttpOnly cookies (or localStorage if easier for now)

Roles: user, merchant, admin

Protected routes on both frontend and backend based on role

🔧 Tech Stack Summary
Frontend: React + Bootstrap + Context API (or Redux if needed)

Backend: Node.js + Express + Mongoose

Database: MongoDB

Deployment (eventually): Could be uploaded on VPS Ubuntu 24.04

📁 Folder and File Structure

groupon-clone/
│
├── client/                          # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/                  # Static assets (images, logos, etc.)
│   │   ├── components/              # Reusable components (Navbar, Footer, DealCard, etc.)
│   │   ├── pages/                   # Page components (Home, Deals, Checkout, etc.)
│   │   │   ├── user/                # User-specific pages
│   │   │   ├── merchant/            # Merchant dashboard, deal management
│   │   │   └── admin/               # Admin panel (user, deal, and merchant management)
│   │   ├── context/                 # Global context (auth, cart, role)
│   │   ├── services/                # API integrations (auth, deals, payments)
│   │   ├── utils/                   # Helper functions (formatting, validation)
│   │   ├── App.js                   # Main app with route config
│   │   └── index.js                 # React DOM render
│
├── server/                          # Node/Express backend
│   ├── config/                      # DB config, Stripe/PayPal setup, dotenv
│   ├── controllers/                 # Route logic (auth, deals, payments, etc.)
│   ├── middleware/                  # Auth middleware, error handlers, validators
│   ├── models/                      # Mongoose schemas (User, Deal, Order, etc.)
│   ├── routes/                      # Route definitions
│   │   ├── auth.js
│   │   ├── deals.js
│   │   ├── merchant.js
│   │   ├── admin.js
│   │   └── payments.js
│   └── server.js                   # Main server file
│
├── .env                             # Environment variables
├── .gitignore
├── package.json
├── README.md
└── windsurf.rule.md                # This file


