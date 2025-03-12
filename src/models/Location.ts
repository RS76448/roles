// src/models/Location.ts
import mongoose from 'mongoose';
import { ILocation } from 'types';

const LocationSchema = new mongoose.Schema<ILocation>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique:true
  },
  assets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset'
  }],
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    default: null
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  }]
}, {
  timestamps: true
});

// Ensure unique combination of name and level
// LocationSchema.index({ name: 1, level: 1 }, { unique: true });

const Location = mongoose.model<ILocation>('Location', LocationSchema);

export default Location;