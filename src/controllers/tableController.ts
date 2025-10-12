import { Request, Response } from 'express';
import Table from '../models/Table';
import { generateQRCode, generateTableCode } from '../utils/qrcode';

export const getAllTables = async (req: Request, res: Response): Promise<void> => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.json({ success: true, data: tables });
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tables' });
  }
};

export const getTableByCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const table = await Table.findOne({ tableCode: req.params.code, active: true });
    if (!table) {
      res.status(404).json({ success: false, message: 'Table not found' });
      return;
    }
    res.json({ success: true, data: table });
  } catch (error) {
    console.error('Error fetching table:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch table' });
  }
};

export const createTable = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tableNumber, capacity } = req.body;
    
    // Check if table number already exists
    const existingTable = await Table.findOne({ tableNumber });
    if (existingTable) {
      res.status(400).json({ success: false, message: 'Table number already exists' });
      return;
    }

    // Generate unique table code
    let tableCode: string;
    let isUnique = false;
    do {
      tableCode = generateTableCode();
      const existing = await Table.findOne({ tableCode });
      if (!existing) {
        isUnique = true;
      }
    } while (!isUnique);

    // Generate QR code
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    const menuURL = `${baseURL}/menu/${tableCode}`;
    const qrCode = await generateQRCode(menuURL);

    const newTable = new Table({
      tableNumber,
      tableCode,
      qrCode,
      capacity,
      active: true
    });

    await newTable.save();
    res.status(201).json({ success: true, data: newTable });
  } catch (error) {
    console.error('Error creating table:', error);
    res.status(500).json({ success: false, message: 'Failed to create table' });
  }
};

export const updateTable = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tableNumber, capacity, active } = req.body;
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { tableNumber, capacity, active },
      { new: true, runValidators: true }
    );
    if (!table) {
      res.status(404).json({ success: false, message: 'Table not found' });
      return;
    }
    res.json({ success: true, data: table });
  } catch (error) {
    console.error('Error updating table:', error);
    res.status(500).json({ success: false, message: 'Failed to update table' });
  }
};

export const deleteTable = async (req: Request, res: Response): Promise<void> => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) {
      res.status(404).json({ success: false, message: 'Table not found' });
      return;
    }
    res.json({ success: true, message: 'Table deleted successfully' });
  } catch (error) {
    console.error('Error deleting table:', error);
    res.status(500).json({ success: false, message: 'Failed to delete table' });
  }
};

export const regenerateQRCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      res.status(404).json({ success: false, message: 'Table not found' });
      return;
    }

    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    const menuURL = `${baseURL}/menu/${table.tableCode}`;
    const qrCode = await generateQRCode(menuURL);

    table.qrCode = qrCode;
    await table.save();

    res.json({ success: true, data: table });
  } catch (error) {
    console.error('Error regenerating QR code:', error);
    res.status(500).json({ success: false, message: 'Failed to regenerate QR code' });
  }
};
