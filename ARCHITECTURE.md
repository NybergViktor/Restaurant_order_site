# Architecture Documentation

## System Overview

The Restaurant Order System is a full-stack web application built using the MERN-like stack with TypeScript.

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
├─────────────────────────────────────────────────────────────┤
│  Customer Interface      │      Admin Interface             │
│  (/menu/:tableCode)     │      (/admin)                    │
│                         │                                   │
│  - Browse menu          │  - Manage menu items             │
│  - Shopping cart        │  - Manage tables                 │
│  - Place orders         │  - Manage orders                 │
│                         │  - View QR codes                 │
└─────────────────────────┴───────────────────────────────────┘
                           │
                           │ HTTP/REST API
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
├─────────────────────────────────────────────────────────────┤
│                   Express Server (TypeScript)               │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Routes     │  │ Controllers  │  │  Middleware  │    │
│  │              │  │              │  │              │    │
│  │ - Menu       │  │ - Business   │  │ - Validation │    │
│  │ - Tables     │  │   Logic      │  │ - Error      │    │
│  │ - Orders     │  │              │  │   Handling   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Utility Functions                       │  │
│  │  - QR Code Generation                               │  │
│  │  - Table Code Generation                            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Mongoose ODM
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                     Database Layer                          │
├─────────────────────────────────────────────────────────────┤
│                     MongoDB Database                        │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  MenuItems   │  │   Tables     │  │   Orders     │    │
│  │  Collection  │  │  Collection  │  │  Collection  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Data Models

### MenuItem
```typescript
{
  name: string
  description: string
  price: number
  category: 'appetizer' | 'main' | 'dessert' | 'beverage' | 'other'
  image?: string
  available: boolean
  timestamps: { createdAt, updatedAt }
}
```

### Table
```typescript
{
  tableNumber: string (unique)
  tableCode: string (unique, 8 chars)
  qrCode: string (base64 data URL)
  capacity: number
  active: boolean
  timestamps: { createdAt, updatedAt }
}
```

### Order
```typescript
{
  tableCode: string
  items: [
    {
      menuItem: ObjectId (ref: MenuItem)
      name: string
      price: number
      quantity: number
    }
  ]
  totalAmount: number
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled'
  notes?: string
  timestamps: { createdAt, updatedAt }
}
```

## API Routes

### Menu Routes (`/api/menu`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all available menu items | No |
| GET | `/:id` | Get single menu item | No |
| POST | `/` | Create menu item | No* |
| PUT | `/:id` | Update menu item | No* |
| DELETE | `/:id` | Delete menu item | No* |

### Table Routes (`/api/tables`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all tables | No* |
| GET | `/code/:code` | Get table by code | No |
| POST | `/` | Create table with QR code | No* |
| PUT | `/:id` | Update table | No* |
| DELETE | `/:id` | Delete table | No* |
| POST | `/:id/regenerate-qr` | Regenerate QR code | No* |

### Order Routes (`/api/orders`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all orders | No* |
| GET | `/:id` | Get single order | No* |
| GET | `/table/:tableCode` | Get orders by table | No |
| POST | `/` | Create order | No |
| PATCH | `/:id/status` | Update order status | No* |
| DELETE | `/:id` | Delete order | No* |

*Note: These endpoints should be protected with authentication in production

## Request/Response Flow

### Customer Order Flow

1. **Scan QR Code**
   ```
   QR Code → /menu/:tableCode
   ```

2. **Load Menu**
   ```
   GET /api/tables/code/:code → Verify table
   GET /api/menu → Load available items
   ```

3. **Place Order**
   ```
   POST /api/orders
   Body: {
     tableCode: string,
     items: [...],
     notes: string
   }
   Response: {
     success: boolean,
     data: Order
   }
   ```

### Admin Order Management Flow

1. **View Orders**
   ```
   GET /api/orders
   Response: {
     success: boolean,
     data: Order[]
   }
   ```

2. **Update Order Status**
   ```
   PATCH /api/orders/:id/status
   Body: {
     status: 'preparing' | 'ready' | 'served' | 'cancelled'
   }
   ```

### Admin Table Management Flow

1. **Create Table**
   ```
   POST /api/tables
   Body: {
     tableNumber: string,
     capacity: number
   }
   Process:
   - Generate unique tableCode
   - Generate QR code with menu URL
   - Save to database
   Response: {
     success: boolean,
     data: Table (with qrCode)
   }
   ```

## Security Considerations

### Current Implementation
- Input validation middleware
- Mongoose schema validation
- CORS configuration
- Environment variables for sensitive data
- TypeScript type safety

### Recommended for Production
- [ ] JWT authentication for admin routes
- [ ] Rate limiting
- [ ] HTTPS enforcement
- [ ] MongoDB authentication
- [ ] Input sanitization
- [ ] CSRF protection
- [ ] Helmet.js security headers
- [ ] Request logging

## Performance Considerations

### Database
- Indexes on frequently queried fields:
  - `Table.tableCode` (unique index)
  - `Table.tableNumber` (unique index)
  - `Order.tableCode` (regular index)
  - `Order.status` (regular index)
  - `Order.createdAt` (regular index for sorting)

### Caching Strategy
- Menu items can be cached (rarely change)
- Table data can be cached (rarely change)
- Orders should not be cached (real-time updates)

### Frontend Optimization
- Cart stored in localStorage (reduces server requests)
- Category filtering client-side
- Lazy loading for images (future enhancement)

## Scalability

### Horizontal Scaling
- Stateless application design allows multiple server instances
- MongoDB replica sets for database redundancy
- Load balancer for distributing requests

### Vertical Scaling
- Database connection pooling (Mongoose default)
- Async/await patterns throughout
- Efficient queries with selective field projection

## Monitoring & Logging

### Recommended Tools
- **Application**: PM2 for process management
- **Logging**: Winston or Pino
- **Monitoring**: New Relic or DataDog
- **Database**: MongoDB Atlas monitoring
- **Errors**: Sentry for error tracking

## Deployment Architecture

```
                    ┌─────────────┐
                    │   Clients   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Load        │
                    │ Balancer    │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐        ┌────▼────┐       ┌────▼────┐
   │ App     │        │ App     │       │ App     │
   │ Server  │        │ Server  │       │ Server  │
   │ Instance│        │ Instance│       │ Instance│
   └────┬────┘        └────┬────┘       └────┬────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    ┌──────▼──────┐
                    │  MongoDB    │
                    │  Cluster    │
                    └─────────────┘
```

## Technology Choices

### Why TypeScript?
- Type safety reduces runtime errors
- Better IDE support and autocomplete
- Easier refactoring
- Self-documenting code

### Why Express?
- Lightweight and flexible
- Large ecosystem of middleware
- Well-documented and mature
- Easy to learn and use

### Why MongoDB?
- Schema flexibility for evolving requirements
- JSON-like documents match JavaScript objects
- Horizontal scalability
- Rich query language
- Good performance for read-heavy workloads

### Why Vanilla JavaScript (Frontend)?
- No build step required for frontend
- Faster development for simple UIs
- Smaller bundle size
- Easy to understand and modify

## Future Architecture Enhancements

1. **Microservices**: Split into menu, order, and table services
2. **Event-Driven**: Use message queues for order notifications
3. **Real-time**: WebSocket for live order updates
4. **CDN**: Serve static assets from CDN
5. **Serverless**: Convert API to serverless functions
6. **GraphQL**: Implement GraphQL for more flexible queries
7. **Service Mesh**: Implement for better service-to-service communication
