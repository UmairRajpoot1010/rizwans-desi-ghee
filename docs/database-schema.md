# Database Schema Documentation

## MongoDB Collections

### User Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  phone: String (optional),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### Admin Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  role: String (enum: ['admin', 'superadmin'], default: 'admin'),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Product Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String (required),
  price: Number (required, min: 0),
  images: [String] (required),
  category: String (required),
  stock: Number (required, min: 0, default: 0),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Order Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  items: [
    {
      product: ObjectId (ref: 'Product', required),
      quantity: Number (required, min: 1),
      price: Number (required)
    }
  ],
  totalAmount: Number (required),
  shippingAddress: {
    name: String (required),
    email: String (required),
    phone: String (required),
    address: String (required),
    city: String (required),
    state: String (required),
    zipCode: String (required)
  },
  status: String (enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending'),
  paymentStatus: String (enum: ['pending', 'paid', 'failed'], default: 'pending'),
  createdAt: Date,
  updatedAt: Date
}
```

## Relationships

- **Order → User**: One-to-Many (One user can have many orders)
- **Order → Product**: Many-to-Many (Order contains multiple products, Product can be in multiple orders)
- **OrderItem → Product**: Many-to-One (Embedded in Order)

## Indexes

Recommended indexes for performance:

```javascript
// User
db.users.createIndex({ email: 1 }, { unique: true })

// Admin
db.admins.createIndex({ email: 1 }, { unique: true })

// Product
db.products.createIndex({ name: 'text', description: 'text' })
db.products.createIndex({ category: 1 })
db.products.createIndex({ isActive: 1 })

// Order
db.orders.createIndex({ user: 1 })
db.orders.createIndex({ status: 1 })
db.orders.createIndex({ createdAt: -1 })
```
