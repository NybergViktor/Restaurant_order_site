import mongoose, { Document, Schema } from 'mongoose';

export interface ITable extends Document {
  tableNumber: string;
  tableCode: string;
  qrCode: string;
  capacity: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TableSchema = new Schema<ITable>({
  tableNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  tableCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  qrCode: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
    default: 4
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<ITable>('Table', TableSchema);
