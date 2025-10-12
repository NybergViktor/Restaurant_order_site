import express from 'express';
import {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/menuController';
import { validate } from '../middleware/validation';

const router = express.Router();

// Get all menu items
router.get('/', getAllMenuItems);

// Get single menu item
router.get('/:id', getMenuItemById);

// Create menu item
router.post('/', 
  validate([
    { field: 'name', type: 'string', required: true, min: 1, max: 100 },
    { field: 'description', type: 'string', required: true, min: 1, max: 500 },
    { field: 'price', type: 'number', required: true, min: 0 },
    { field: 'category', type: 'string', required: true, enum: ['appetizer', 'main', 'dessert', 'beverage', 'other'] },
    { field: 'available', type: 'boolean' }
  ]),
  createMenuItem
);

// Update menu item
router.put('/:id',
  validate([
    { field: 'name', type: 'string', min: 1, max: 100 },
    { field: 'description', type: 'string', min: 1, max: 500 },
    { field: 'price', type: 'number', min: 0 },
    { field: 'category', type: 'string', enum: ['appetizer', 'main', 'dessert', 'beverage', 'other'] },
    { field: 'available', type: 'boolean' }
  ]),
  updateMenuItem
);

// Delete menu item
router.delete('/:id', deleteMenuItem);

export default router;
