import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from './models/MenuItem';
import Table from './models/Table';
import { generateQRCode, generateTableCode } from './utils/qrcode';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_orders';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const sampleMenuItems = [
  {
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with parmesan cheese, croutons, and Caesar dressing',
    price: 89,
    category: 'appetizer',
    available: true
  },
  {
    name: 'Bruschetta',
    description: 'Toasted bread topped with fresh tomatoes, garlic, basil, and olive oil',
    price: 75,
    category: 'appetizer',
    available: true
  },
  {
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with seasonal vegetables and lemon butter sauce',
    price: 245,
    category: 'main',
    available: true
  },
  {
    name: 'Beef Burger',
    description: 'Juicy beef patty with lettuce, tomato, cheese, and special sauce. Served with fries',
    price: 165,
    category: 'main',
    available: true
  },
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
    price: 145,
    category: 'main',
    available: true
  },
  {
    name: 'Pasta Carbonara',
    description: 'Creamy pasta with bacon, eggs, parmesan cheese, and black pepper',
    price: 155,
    category: 'main',
    available: true
  },
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
    price: 95,
    category: 'dessert',
    available: true
  },
  {
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
    price: 85,
    category: 'dessert',
    available: true
  },
  {
    name: 'Coca Cola',
    description: 'Classic Coca Cola (330ml)',
    price: 35,
    category: 'beverage',
    available: true
  },
  {
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice (300ml)',
    price: 45,
    category: 'beverage',
    available: true
  },
  {
    name: 'Coffee',
    description: 'Freshly brewed coffee',
    price: 35,
    category: 'beverage',
    available: true
  }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await MenuItem.deleteMany({});
    await Table.deleteMany({});
    console.log('Existing data cleared');

    // Insert menu items
    console.log('Inserting menu items...');
    const menuItems = await MenuItem.insertMany(sampleMenuItems);
    console.log(`Inserted ${menuItems.length} menu items`);

    // Create tables
    console.log('Creating tables...');
    const tablesToCreate = [
      { tableNumber: '1', capacity: 2 },
      { tableNumber: '2', capacity: 4 },
      { tableNumber: '3', capacity: 4 },
      { tableNumber: '4', capacity: 6 },
      { tableNumber: '5', capacity: 8 }
    ];

    for (const tableData of tablesToCreate) {
      const tableCode = generateTableCode();
      const menuURL = `${BASE_URL}/menu/${tableCode}`;
      const qrCode = await generateQRCode(menuURL);

      const table = new Table({
        tableNumber: tableData.tableNumber,
        tableCode,
        qrCode,
        capacity: tableData.capacity,
        active: true
      });

      await table.save();
      console.log(`Created table ${tableData.tableNumber} with code: ${tableCode}`);
    }

    console.log('Database seeded successfully!');
    console.log('\nYou can now:');
    console.log('1. Visit http://localhost:3000/admin to manage the restaurant');
    console.log('2. View table QR codes in the admin panel');
    console.log('3. Scan QR codes to place orders');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
