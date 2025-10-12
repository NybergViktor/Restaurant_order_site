import express from 'express';
import {
  getAllOrders,
  getOrderById,
  getOrdersByTable,
  createOrder,
  updateOrderStatus,
  deleteOrder
} from '../controllers/orderController';
import { validate } from '../middleware/validation';

const router = express.Router();

// Get all orders
router.get('/', getAllOrders);

// Get single order
router.get('/:id', getOrderById);

// Get orders by table
router.get('/table/:tableCode', getOrdersByTable);

// Create order
router.post('/',
  validate([
    { field: 'tableCode', type: 'string', required: true },
    { field: 'items', type: 'array', required: true },
    { field: 'notes', type: 'string', max: 500 }
  ]),
  createOrder
);

// Update order status
router.patch('/:id/status',
  validate([
    { field: 'status', type: 'string', required: true, enum: ['pending', 'preparing', 'ready', 'served', 'cancelled'] }
  ]),
  updateOrderStatus
);

// Delete order
router.delete('/:id', deleteOrder);

export default router;
