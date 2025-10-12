import express from 'express';
import {
  getAllTables,
  getTableByCode,
  createTable,
  updateTable,
  deleteTable,
  regenerateQRCode
} from '../controllers/tableController';
import { validate } from '../middleware/validation';

const router = express.Router();

// Get all tables
router.get('/', getAllTables);

// Get table by code
router.get('/code/:code', getTableByCode);

// Create table
router.post('/',
  validate([
    { field: 'tableNumber', type: 'string', required: true, min: 1, max: 20 },
    { field: 'capacity', type: 'number', required: true, min: 1, max: 20 }
  ]),
  createTable
);

// Update table
router.put('/:id',
  validate([
    { field: 'tableNumber', type: 'string', min: 1, max: 20 },
    { field: 'capacity', type: 'number', min: 1, max: 20 },
    { field: 'active', type: 'boolean' }
  ]),
  updateTable
);

// Delete table
router.delete('/:id', deleteTable);

// Regenerate QR code
router.post('/:id/regenerate-qr', regenerateQRCode);

export default router;
