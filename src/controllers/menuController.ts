import { Request, Response } from 'express';
import MenuItem from '../models/MenuItem';

export const getAllMenuItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await MenuItem.find({ available: true }).sort({ category: 1, name: 1 });
    res.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch menu items' });
  }
};

export const getMenuItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Menu item not found' });
      return;
    }
    res.json({ success: true, data: item });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch menu item' });
  }
};

export const createMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, image, available } = req.body;
    const newItem = new MenuItem({
      name,
      description,
      price,
      category,
      image,
      available
    });
    await newItem.save();
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ success: false, message: 'Failed to create menu item' });
  }
};

export const updateMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, image, available } = req.body;
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, image, available },
      { new: true, runValidators: true }
    );
    if (!item) {
      res.status(404).json({ success: false, message: 'Menu item not found' });
      return;
    }
    res.json({ success: true, data: item });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ success: false, message: 'Failed to update menu item' });
  }
};

export const deleteMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Menu item not found' });
      return;
    }
    res.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ success: false, message: 'Failed to delete menu item' });
  }
};
