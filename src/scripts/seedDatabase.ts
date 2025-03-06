// src/scripts/seedDatabase.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Feature from '@models/Feature';
import Location from '@models/Location';
import { LocationHierarchyHelper } from '@utils/locationHierarchyHelper';

// Load environment variables
dotenv.config();

const seedDatabase = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/role_management';
    await mongoose.connect(mongoUri);

    console.log('Connected to database for seeding');

    // Seed Features
    const features = [
      { name: 'Feature_1', description: 'First Feature' },
      { name: 'Feature_2', description: 'Second Feature' },
      { name: 'Feature_3', description: 'Third Feature' },
      { name: 'Feature_4', description: 'Fourth Feature' },
      { name: 'Feature_5', description: 'Fifth Feature' }
    ];

    // Clear existing features
    await Feature.deleteMany({});
    await Feature.insertMany(features);
    console.log('Features seeded successfully');

    // Clear existing locations
    await Location.deleteMany({});

    // Create hierarchical locations
    const createLocationHierarchy = async (
      name: string, 
      level: number, 
      parentId?: string
    ): Promise<mongoose.Types.ObjectId> => {
      const location = await LocationHierarchyHelper.createLocationHierarchy({
        name, 
        level, 
        parentId
      });
      return new mongoose.Types.ObjectId(location._id+"");
    };

    // Sample hierarchy creation
    const level1 = await createLocationHierarchy('Country', 1);
    const level2 = await createLocationHierarchy('State', 2, level1.toString());
    const level3 = await createLocationHierarchy('City', 3, level2.toString());

    console.log('Location hierarchy seeded successfully');

    // Disconnect after seeding
    await mongoose.disconnect();
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run the seeding script
seedDatabase();