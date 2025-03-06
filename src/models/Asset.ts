// src/models/Asset.ts
import mongoose from 'mongoose';
import { IAsset } from 'types';

const AssetSchema = new mongoose.Schema<IAsset>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    ref: 'Location',
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Asset = mongoose.model<IAsset>('Asset', AssetSchema);

export default Asset;