// src/models/Feature.ts
import mongoose from 'mongoose';
import { IFeature } from 'types';

const FeatureSchema = new mongoose.Schema<IFeature>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Feature = mongoose.model<IFeature>('Feature', FeatureSchema);

export default Feature;