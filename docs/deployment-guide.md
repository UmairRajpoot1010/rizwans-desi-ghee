# Deployment Guide

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Git
- PM2 (for production process management) - optional

## Environment Setup

### Backend

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://your-mongodb-connection-string
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@rizwansdesighee.com
ADMIN_PASSWORD=your-secure-admin-password
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

### Frontend

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Build and start:
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### Admin Panel

1. Navigate to admin directory:
```bash
cd admin
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Build and start:
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Production Deployment

### Using PM2 (Recommended for Backend)

1. Install PM2 globally:
```bash
npm install -g pm2
```

2. Start backend with PM2:
```bash
cd backend
pm2 start server.js --name "rizwans-backend"
pm2 save
pm2 startup
```

### Using Vercel/Netlify (Frontend & Admin)

1. Connect your repository to Vercel/Netlify
2. Set environment variables in the platform dashboard
3. Deploy

### Using Docker (Optional)

Create `docker-compose.yml` in root:

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/rizwans-desi-ghee
    depends_on:
      - mongo
  
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Use strong admin password
- [ ] Enable HTTPS in production
- [ ] Set up CORS properly for production domains
- [ ] Use environment variables for all sensitive data
- [ ] Enable MongoDB authentication
- [ ] Set up rate limiting
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging
- [ ] Regular backups of database

## MongoDB Atlas Setup

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Create database user
4. Whitelist your IP address
5. Get connection string
6. Update `MONGODB_URI` in backend `.env`

## Monitoring

Consider setting up:
- Application monitoring (e.g., PM2 Plus, New Relic)
- Error tracking (e.g., Sentry)
- Uptime monitoring (e.g., UptimeRobot)
- Log aggregation (e.g., Loggly, Papertrail)

## Backup Strategy

1. **Database Backups:**
   - MongoDB Atlas provides automatic backups
   - For self-hosted: Use `mongodump` regularly

2. **Code Backups:**
   - Use Git repository
   - Tag releases

## Scaling Considerations

- Use load balancer for multiple backend instances
- Implement Redis for session management (if needed)
- Use CDN for static assets
- Consider database read replicas for high traffic
- Implement caching strategies
