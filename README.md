# Restaurant Order System

A full-stack restaurant ordering web application that allows customers to scan QR codes at their tables to view menus, add items to a cart, and place orders. Includes an admin panel for managing menu items, tables, and order statuses.

## Features

- **Customer Features:**
  - Scan table QR codes to access digital menu
  - Browse menu items by category
  - Add items to shopping cart
  - Place orders with special instructions
  - Real-time cart management

- **Admin Features:**
  - Manage menu items (create, edit, delete)
  - Manage tables with automatic QR code generation
  - Track and update order statuses
  - View all orders in real-time
  - Filter orders by status

## Technology Stack

- **Backend:**
  - Node.js & Express
  - TypeScript
  - MongoDB with Mongoose
  - QRCode generation

- **Frontend:**
  - HTML5
  - CSS3 (Responsive design)
  - Vanilla JavaScript

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/NybergViktor/Restaurant_order_site.git
cd Restaurant_order_site
```

2. Install dependencies:
```bash
npm install
```

3. Set up MongoDB (choose one option):

   **Option A: Using Docker (Recommended)**
   ```bash
   docker-compose up -d
   ```

   **Option B: Install MongoDB locally**
   - Follow the [MongoDB installation guide](https://docs.mongodb.com/manual/installation/)
   - Ensure MongoDB is running on `localhost:27017`

4. Create environment configuration:
```bash
cp .env.example .env
```

5. Edit `.env` file with your configuration:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/restaurant_orders
NODE_ENV=development
BASE_URL=http://localhost:3000
```

**Note:** The `BASE_URL` is important for QR code generation. If you're deploying to a server, update it to your production URL (e.g., `https://yourdomain.com`).

6. Seed the database with sample data (optional but recommended):
```bash
npm run seed
```

This will create:
- Sample menu items (appetizers, main courses, desserts, beverages)
- 5 tables with QR codes

## Usage

### Development Mode

Run the application in development mode with auto-reload:
```bash
npm run dev
```

### Production Mode

1. Build the TypeScript code:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

### Seeding the Database

To populate the database with sample data:
```bash
npm run seed
```

The application will be available at:
- Main page: `http://localhost:3000`
- Admin panel: `http://localhost:3000/admin`
- Menu (example): `http://localhost:3000/menu/{tableCode}`

### Quick Start Guide

1. Start MongoDB (if using Docker): `docker-compose up -d`
2. Seed the database: `npm run seed`
3. Start the application: `npm run dev`
4. Open admin panel: `http://localhost:3000/admin`
5. Go to "Tables" tab to view QR codes
6. Use the QR codes to test the customer ordering flow

## Project Structure

```
Restaurant_order_site/
├── src/
│   ├── models/          # MongoDB models
│   │   ├── MenuItem.ts
│   │   ├── Table.ts
│   │   └── Order.ts
│   ├── controllers/     # Route controllers
│   │   ├── menuController.ts
│   │   ├── tableController.ts
│   │   └── orderController.ts
│   ├── routes/          # API routes
│   │   ├── menuRoutes.ts
│   │   ├── tableRoutes.ts
│   │   └── orderRoutes.ts
│   ├── middleware/      # Custom middleware
│   │   └── validation.ts
│   ├── utils/           # Utility functions
│   │   └── qrcode.ts
│   └── server.ts        # Main server file
├── public/              # Static files
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── menu.js
│   │   └── admin.js
│   ├── admin/
│   │   └── index.html
│   ├── index.html
│   └── menu.html
└── dist/                # Compiled TypeScript (generated)
```

## API Endpoints

### Menu Items
- `GET /api/menu` - Get all available menu items
- `GET /api/menu/:id` - Get single menu item
- `POST /api/menu` - Create new menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

### Tables
- `GET /api/tables` - Get all tables
- `GET /api/tables/code/:code` - Get table by code
- `POST /api/tables` - Create new table
- `PUT /api/tables/:id` - Update table
- `DELETE /api/tables/:id` - Delete table
- `POST /api/tables/:id/regenerate-qr` - Regenerate QR code

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `GET /api/orders/table/:tableCode` - Get orders for specific table
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

## Security Features

- Input validation on all endpoints using custom middleware
- MongoDB injection protection through Mongoose ODM
- CORS enabled for cross-origin requests
- Request body parsing with size limits
- Environment variable configuration for sensitive data
- TypeScript for type safety and error prevention

## Features Details

### QR Code System
- Each table has a unique 8-character alphanumeric code
- QR codes are automatically generated when tables are created
- QR codes encode the full menu URL for easy scanning
- QR codes can be regenerated if needed

### Order Status Flow
Orders progress through the following statuses:
1. **Pending** - Order just received
2. **Preparing** - Kitchen is preparing the order
3. **Ready** - Order is ready for serving
4. **Served** - Order has been delivered to customer
5. **Cancelled** - Order was cancelled

### Menu Categories
- **Appetizers** - Starters and small plates
- **Main Courses** - Main dishes
- **Desserts** - Sweet treats
- **Beverages** - Drinks
- **Other** - Miscellaneous items

### Cart Features
- Persistent cart storage (uses localStorage)
- Real-time price calculation
- Quantity adjustment (+/- buttons)
- Special instructions field
- Clear cart option
- Visual feedback when adding items

## Admin Panel Usage

1. Navigate to `/admin`
2. Use the tabs to switch between:
   - **Orders**: View and manage all orders, update statuses
   - **Menu Items**: Add, edit, or delete menu items
   - **Tables**: Create tables, view/regenerate QR codes

## Customer Flow

1. Customer scans QR code at their table
2. Opens menu page with table-specific code
3. Browses menu items and adds to cart
4. Reviews cart and places order
5. Order is sent to admin panel for processing

## License

ISC

## Deployment

### Preparing for Production

1. Update environment variables:
   - Set `NODE_ENV=production`
   - Update `BASE_URL` to your production domain
   - Update `MONGODB_URI` to your production MongoDB instance (e.g., MongoDB Atlas)

2. Build the application:
```bash
npm run build
```

3. Set up a process manager (e.g., PM2):
```bash
npm install -g pm2
pm2 start dist/server.js --name restaurant-app
pm2 save
pm2 startup
```

### Deployment Platforms

This application can be deployed to:
- **Heroku**: Add MongoDB add-on, set environment variables
- **DigitalOcean**: Deploy on droplet with MongoDB
- **AWS**: Use EC2 with MongoDB Atlas
- **Vercel/Netlify**: Backend needs separate hosting (use serverless functions or separate backend)

### Production Considerations

- Use HTTPS in production
- Set up proper CORS origins
- Enable MongoDB authentication
- Set up backup strategy for database
- Implement rate limiting
- Add authentication for admin panel
- Set up monitoring and logging
- Use a reverse proxy (nginx)

## Future Enhancements

Potential features to add:
- User authentication for admin panel
- Order notifications (WebSocket or push notifications)
- Payment integration
- Order history for customers
- Receipt generation
- Multiple restaurant locations support
- Table reservation system
- Analytics dashboard
- Customer feedback system
- Multi-language support

## Author

Viktor Nyberg
