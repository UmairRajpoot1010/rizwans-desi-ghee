# API Contract Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Public Endpoints

### Products

#### Get All Products
```
GET /products
```
**Response:**
```json
[
  {
    "_id": "string",
    "name": "string",
    "description": "string",
    "price": "number",
    "images": ["string"],
    "category": "string",
    "stock": "number",
    "isActive": "boolean",
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

#### Get Product by ID
```
GET /products/:id
```

#### Search Products
```
GET /products/search?q=query
```

---

### Authentication

#### Register User
```
POST /auth/register
```
**Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string (optional)"
}
```

#### Login
```
POST /auth/login
```
**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

#### Get Current User
```
GET /auth/me
```
**Requires:** Authentication

---

## Protected Endpoints (User)

### Orders

#### Create Order
```
POST /orders
```
**Requires:** Authentication
**Body:**
```json
{
  "items": [
    {
      "productId": "string",
      "quantity": "number"
    }
  ],
  "shippingAddress": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string"
  }
}
```

#### Get My Orders
```
GET /orders/my
```
**Requires:** Authentication

#### Get Order by ID
```
GET /orders/:id
```
**Requires:** Authentication

---

## Admin Endpoints

### Admin Authentication

#### Admin Login
```
POST /admin/auth/login
```
**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

### Dashboard

#### Get Stats
```
GET /admin/dashboard/stats
```
**Requires:** Admin Authentication

### Products (Admin)

#### Get All Products
```
GET /admin/products
```

#### Create Product
```
POST /admin/products
```
**Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "images": ["string"],
  "category": "string",
  "stock": "number",
  "isActive": "boolean"
}
```

#### Update Product
```
PUT /admin/products/:id
```

#### Delete Product
```
DELETE /admin/products/:id
```

### Orders (Admin)

#### Get All Orders
```
GET /admin/orders
```

#### Update Order Status
```
PUT /admin/orders/:id
```
**Body:**
```json
{
  "status": "pending|processing|shipped|delivered|cancelled"
}
```

### Users (Admin)

#### Get All Users
```
GET /admin/users
```

#### Update User
```
PUT /admin/users/:id
```

#### Delete User
```
DELETE /admin/users/:id
```

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error message"
}
```

**Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error
