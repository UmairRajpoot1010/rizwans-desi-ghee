# How to Start the Project

## Prerequisites

1. **MongoDB** must be running:
   - **Local MongoDB**: Make sure MongoDB is installed and running on `localhost:27017`
   - **OR MongoDB Atlas**: Update `backend/.env` with your MongoDB Atlas connection string

2. **Node.js** (v18 or higher) - Already installed ✓

## Starting the Services

### Option 1: Start Each Service Manually (Recommended for Development)

#### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:5000

#### Terminal 2 - Frontend (Customer-facing)
```bash
cd frontend
npm run dev
```
Frontend will run on: http://localhost:3000

#### Terminal 3 - Admin Panel
```bash
cd admin
npm run dev
```
Admin panel will run on: http://localhost:3001

### Option 2: Using PowerShell Scripts

You can create batch scripts to start all services at once.

## MongoDB Setup

### If MongoDB is NOT running:

1. **Install MongoDB** (if not installed):
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

2. **Start MongoDB**:
   - Windows Service: MongoDB should start automatically
   - Manual: Run `mongod` in a terminal

3. **Update connection string** in `backend/.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/rizwans-desi-ghee
   ```

### Using MongoDB Atlas (Cloud):
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rizwans-desi-ghee
   ```

## Verify Setup

1. **Backend Health Check**:
   ```bash
   curl http://localhost:5000/api/health
   ```
   Or visit: http://localhost:5000/api/health

2. **Check Backend API**:
   ```bash
   curl http://localhost:5000/
   ```

## Default Admin Credentials

After first run, you can login with:
- **Email**: admin@rizwansdesighee.com
- **Password**: admin123

**⚠️ Important**: Change these credentials in production!

## Troubleshooting

### Backend won't start:
- Check if MongoDB is running
- Check if port 5000 is available
- Check `backend/.env` file exists

### MongoDB connection error:
- Verify MongoDB is running: `mongosh` or check MongoDB service
- Check connection string in `backend/.env`
- For MongoDB Atlas: Check IP whitelist and credentials

### Port already in use:
- Change PORT in `backend/.env`
- Or stop the process using the port

## Project Structure

```
rizwans-desi-ghee/
├── backend/      # Express API (Port 5000)
├── frontend/     # Next.js Customer App (Port 3000)
├── admin/        # Next.js Admin Panel (Port 3001)
└── docs/         # Documentation
```

## API Endpoints

- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3001

## Next Steps

1. Ensure MongoDB is running
2. Start backend server: `cd backend && npm run dev`
3. Start frontend: `cd frontend && npm run dev`
4. Start admin: `cd admin && npm run dev`
5. Access the applications in your browser
