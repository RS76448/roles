// src/types/index.ts
import { Document, Model } from 'mongoose';
import mongoose from 'mongoose';
// Role Interface
export interface IRole extends Document {
  name: string;
  features: string[];
  privileges: ('SuperUser' | 'Admin' | 'User')[];
  locations: string[];
  // assets: string[];
  createdAt: Date;
}

// Feature Interface
export interface IFeature extends Document {
  name: 'Feature_1' | 'Feature_2' | 'Feature_3' | 'Feature_4' | 'Feature_5';
  description?: string;
}

export interface Iassets extends Document{
  _id:string,
  name?: string;
  location?: number;
  description?: string | null;
  createdAt?: string[];
}
// Location Interface
export interface ILocation extends Document {
  _id:string,
  name: string;
  level: number;
  parent?: string | null;
  assets?: Iassets[];
  children?: (mongoose.Types.ObjectId | ILocation)[];

}
export interface EmptyObj extends Document {
 

}

// Asset Interface
export interface IAsset extends Document {
  name: string;
  location: string;
  description?: string;
  createdAt: Date;
}

// User Interface
export interface IUser extends Document {
  username: string;
  email: string;
  role?: string;
  createdAt: Date;
}

// Model Interfaces
export interface RoleModel extends Model<IRole> {
  findByName(name: string): Promise<IRole | null>;
}

export interface LocationModel extends Model<ILocation> {
  findDescendants(locationId: string): Promise<ILocation[]>;
}