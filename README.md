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

3. Create environment configuration:
```bash
cp .env.example .env
```

4. Edit `.env` file with your configuration:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/restaurant_orders
NODE_ENV=development
BASE_URL=http://localhost:3000
```

5. Ensure MongoDB is running on your system

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

The application will be available at:
- Main page: `http://localhost:3000`
- Admin panel: `http://localhost:3000/admin`
- Menu (example): `http://localhost:3000/menu/{tableCode}`

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

- Input validation on all endpoints
- MongoDB injection protection
- CORS enabled
- Request body parsing limits
- Environment variable configuration

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

## Author

Viktor Nyberg
