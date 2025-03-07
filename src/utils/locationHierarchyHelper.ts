// src/utils/locationHierarchyHelper.ts
import Location from '@models/Location';
import { ILocation } from 'types';
import mongoose from 'mongoose';

interface LocationData {
  name: string;
  level: number;
  assets?:string,
  parentId?: string | null;
}

export class LocationHierarchyHelper {
  /**
   * Get all descendant locations for a given location
   * @param locationId - The ID of the parent location
   * @returns Array of descendant location IDs
   */
  static async getDescendantLocations(locationId: string): Promise<mongoose.Types.ObjectId[]> {
    const descendants: mongoose.Types.ObjectId[] = [];
    
    async function traverse(currentLocationId: string): Promise<void> {
      const children = await Location.find({ parent: currentLocationId });
      
      for (const child of children) {
        let objectid=new mongoose.Types.ObjectId(child._id+"")
        descendants.push(objectid);
        await traverse(objectid.toString());
      }
    }
    
    await traverse(locationId);
    return descendants;
  }

  /**
   * Create a location in the hierarchy
   * @param locationData - Data for creating the location
   * @returns Created location
   */
  static async createLocationHierarchy(locationData: LocationData): Promise<ILocation> {
    const { name, level, parentId,assets } = locationData;
    console.log("shit")
    // Validate level
    if (level < 1 || level > 6) {
      throw new Error('Invalid location level');
    }
    
    // Check parent constraints
    if (level === 1 && parentId) {
      throw new Error('Level 1 location cannot have a parent');
    }
    
    // Check if level 6 has children
    if (level === 6) {
      const existingChildren = await Location.findOne({ parent: parentId });
      if (existingChildren) {
        throw new Error('Level 6 location cannot have children');
      }
    }
    
    const location = new Location({
      name,
      level,
      parent: parentId || null,
      assets:assets
    });
    
    // If parent exists, add this location to parent's children
    if (parentId) {
      await Location.findByIdAndUpdate(parentId, {
        $push: { children: location._id }
      });
    }
    
    return location.save();
  }

  /**
   * Get the full location hierarchy
   * @param locationId - The ID of the location to start from
   * @returns Full hierarchy of locations
   */
  static async getLocationHierarchy(locationId: string): Promise<ILocation | null> {
    const location = await Location.findById(locationId).populate('children').populate('assets').lean();

    if (!location) return null;
    const visited = new Set<string>();
    // Recursive function to populate children fully
    async function populateChildren(loc: ILocation): Promise<ILocation> {
        if (!loc.children || loc.children.length === 0) return loc;

        // Prevent cycles by checking if the location has already been processed
        if (visited.has(loc.name.toString())) {
          console.warn(`Cycle detected: Skipping location ${loc._id}`);
          return loc;
      }
      visited.add(loc.name.toString()); // Mark this location as visited
        // Separate string IDs from actual objects
        // console.log("loc.childern",loc.children)
        const childIds = loc.children.filter((child): child is mongoose.Types.ObjectId => 
          child instanceof mongoose.Types.ObjectId
      );
        
        // console.log("childIds",childIds)
        const childObjects: ILocation[] = loc.children.filter((child): child is ILocation => typeof child !== 'string');
        console.log("childobjs",childObjects)
        // Fetch missing children if they are stored as IDs
        const fetchedChildren = await Location.find({ _id: { $in: childIds } }).populate('children').populate('assets').lean();
        
        // Assign fully populated children
        loc.children = [...childObjects, ...fetchedChildren]
        // Recursively populate each child
        for (const child of loc.children) {
            if (child instanceof mongoose.Types.ObjectId) continue
            await populateChildren(child);
        }

        return loc; 
    }

    return populateChildren(location);
}




}