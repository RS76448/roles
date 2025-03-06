// src/models/Role.ts
import mongoose from 'mongoose';
import { IRole } from 'types';

const RoleSchema = new mongoose.Schema<IRole>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  features: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feature'
    // enum: ['Feature_1', 'Feature_2', 'Feature_3', 'Feature_4', 'Feature_5']
  }],
  privileges: [{
    type: String,
    enum: ['SuperUser', 'Admin', 'User']
  }],
  locations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  }],
  // assets: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Asset'
  // }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Optional: Add indexes for performance
RoleSchema.index({ name: 1 });

const Role = mongoose.model<IRole>('Role', RoleSchema);

export default Role;