# Rizwan's Desi Ghee - E-commerce Platform

A production-ready MERN stack e-commerce platform for selling desi ghee products.

## Project Structure

```
rizwans-desi-ghee/
├── frontend/      # Customer-facing Next.js application
├── admin/         # Admin panel (Next.js)
├── backend/       # Node.js + Express REST API
└── docs/          # Documentation
```

## Tech Stack

- **Frontend**: Next.js (App Router), React
- **Admin**: Next.js (App Router), React
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for each service:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Admin
cd ../admin
npm install
```

### Environment Setup

1. **Backend**: Copy `.env.example` to `.env` and configure:
   - MongoDB connection string
   - JWT secret
   - Port number

2. **Frontend**: Copy `.env.local.example` to `.env.local` and configure:
   - API base URL

3. **Admin**: Copy `.env.local.example` to `.env.local` and configure:
   - API base URL

### Running the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Admin
cd admin
npm run dev
```

## Development

- Backend API: http://localhost:5000
- Frontend: http://localhost:3000
- Admin Panel: http://localhost:3001

## Documentation

See the `docs/` folder for:
- API contracts
- Database schema
- Deployment guide

## License

Proprietary
