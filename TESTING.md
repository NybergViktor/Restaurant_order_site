# Testing Guide

This guide will help you test all features of the Restaurant Order System.

## Prerequisites

1. MongoDB is running (via Docker or local installation)
2. Application dependencies are installed (`npm install`)
3. Database is seeded with sample data (`npm run seed`)

## Starting the Application

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Testing Customer Features

### 1. Access the Menu

1. Open the admin panel: `http://localhost:3000/admin`
2. Click on the "Tables" tab
3. Click "View QR" on any table to see its QR code
4. Copy the table code from the display
5. Navigate to: `http://localhost:3000/menu/{tableCode}` (replace {tableCode} with the actual code)

### 2. Browse Menu Items

- Use the category filter buttons to filter by:
  - All
  - Appetizers
  - Main Courses
  - Desserts
  - Beverages

### 3. Add Items to Cart

1. Select a quantity using the +/- buttons
2. Click "Add to Cart"
3. Notice the cart count updates in the bottom-right corner

### 4. View and Modify Cart

1. Click the "View Cart" button
2. In the cart modal:
   - Adjust quantities using +/- buttons
   - Remove items using the × button
   - Add special instructions in the text area

### 5. Place an Order

1. With items in your cart, click "Place Order"
2. You should see a success message
3. The cart will be cleared

## Testing Admin Features

### 1. Order Management

1. Go to `http://localhost:3000/admin`
2. The "Orders" tab should be active by default
3. You should see any orders that have been placed
4. Test order status updates:
   - Select a new status from the dropdown
   - The order should update immediately
5. Test order filtering:
   - Use the status filter dropdown to show specific order types
6. Test order deletion:
   - Click "Delete" on an order
   - Confirm the deletion

### 2. Menu Management

1. Click the "Menu Items" tab
2. Test adding a menu item:
   - Click "Add Menu Item"
   - Fill in all required fields:
     - Name: "Test Item"
     - Description: "This is a test item"
     - Price: 99
     - Category: Choose any
   - Check/uncheck "Available"
   - Click "Save"
   - The new item should appear in the list
3. Test editing a menu item:
   - Click "Edit" on any menu item
   - Change some values
   - Click "Save"
   - Verify the changes appear
4. Test deleting a menu item:
   - Click "Delete" on a menu item
   - Confirm the deletion
   - The item should disappear from the list

### 3. Table Management

1. Click the "Tables" tab
2. Test adding a table:
   - Click "Add Table"
   - Enter a table number (e.g., "6")
   - Enter capacity (e.g., 4)
   - Click "Save"
   - A new table with a unique code and QR code should be created
3. Test viewing QR codes:
   - Click "View QR" on any table
   - The QR code image should display
   - The table code should be shown
4. Test editing a table:
   - Click "Edit" on a table
   - Change the capacity
   - Toggle the "Active" status
   - Click "Save"
   - Verify the changes
5. Test deleting a table:
   - Click "Delete" on a table
   - Confirm the deletion

## Integration Testing

### Complete Order Flow

1. Start at admin panel, go to Tables tab
2. Get a table code from any table
3. Open menu page: `http://localhost:3000/menu/{tableCode}`
4. Add multiple items to cart
5. Place an order
6. Return to admin panel, Orders tab
7. Verify the order appears with correct:
   - Table code
   - Items and quantities
   - Total amount
   - Status (should be "Pending")
8. Update the order status through these stages:
   - Pending → Preparing → Ready → Served

## Responsive Design Testing

Test the application on different screen sizes:

1. Desktop (1920x1080)
2. Tablet (768x1024)
3. Mobile (375x667)

Key areas to verify:
- Menu grid adjusts to screen size
- Admin panel tabs stack on mobile
- Buttons remain accessible
- Modals display properly
- Cart button stays visible

## Error Handling Testing

### Invalid Table Code

1. Navigate to: `http://localhost:3000/menu/INVALID`
2. Should show "Invalid table code" message

### Empty Cart

1. Go to a menu page
2. Click "View Cart" without adding items
3. Should show "Your cart is empty"
4. Try to place order - should show alert

### Form Validation

1. In admin panel, try to add a menu item with:
   - Empty name
   - Negative price
   - No category selected
2. Should see validation errors

## API Testing

You can also test the API endpoints directly using curl or Postman:

```bash
# Get all menu items
curl http://localhost:3000/api/menu

# Get all tables
curl http://localhost:3000/api/tables

# Get all orders
curl http://localhost:3000/api/orders

# Create a menu item
curl -X POST http://localhost:3000/api/menu \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Item",
    "description": "Test description",
    "price": 99,
    "category": "other",
    "available": true
  }'
```

## Expected Results

After completing all tests:

- ✓ Customers can view menu and place orders
- ✓ Orders are stored in database
- ✓ Admin can manage all aspects (menu, tables, orders)
- ✓ QR codes are generated for tables
- ✓ Input validation works correctly
- ✓ Responsive design works on all screen sizes
- ✓ Error messages are displayed appropriately

## Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running: `docker-compose ps` or check local MongoDB service
- Verify connection string in `.env` file

### Port Already in Use

- Change the PORT in `.env` file
- Or kill the process using port 3000: `lsof -ti:3000 | xargs kill`

### Build Errors

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear dist folder and rebuild: `rm -rf dist && npm run build`
