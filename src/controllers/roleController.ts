// src/controllers/roleController.ts
import { Request, Response } from 'express';
import Role from '@models/Role';
import Feature from '@models/Feature';
import Location from '@models/Location';
import Asset from '@models/Asset';
import { ILocation } from 'types';
import { IRole } from 'types';
import { LocationHierarchyHelper } from '@utils/locationHierarchyHelper';
import mongoose from 'mongoose';
export class RoleController {
  /**
   * Create a new role
   * @param req Express request object
   * @param res Express response object
   */
  static async createRole(req: Request, res: Response): Promise<Response> {
    try {
      const { 
        name, 
        features, 
        privileges, 
        locations, 
        assets 
      } = req.body;

      // Validate features
      if (features) {
        const validFeatures = await Feature.find({ 
          _id: { $in: features } 
        });
        
        if (validFeatures.length !== features.length) {
          return res.status(400).json({ 
            message: 'Invalid features provided' 
          });
        }
      }

      // Validate locations
      if (locations) {
        const validLocations = await Location.find({
          _id: { $in: locations }
        });
        
        if (validLocations.length !== locations.length) {
          return res.status(400).json({ 
            message: 'Invalid locations provided' 
          });
        }
      }

      // Validate assets
      // if (assets) {
      //   const validAssets = await Asset.find({
      //     _id: { $in: assets }
      //   });
        
      //   if (validAssets.length !== assets.length) {
      //     return res.status(400).json({ 
      //       message: 'Invalid assets provided' 
      //     });
      //   }
      // }

      const newRole: IRole = new Role({
        name,
        features,
        privileges,
        locations,
        // assets
      });

      await newRole.save();

      return res.status(201).json({status:true,newRole});
    } catch (error) {
      console.error('Role creation error:', error);
      
      return res.status(500).json({ 
        status:false,
        message: 'Error creating role', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Update an existing role
   * @param req Express request object
   * @param res Express response object
   */
  static async updateRole(req: Request, res: Response): Promise<Response> {
    try {
      const { 
        roleId, 
        features, 
        privileges, 
        locations, 
        assets 
      } = req.body;

      const role = await Role.findById(roleId);
      
      if (!role) {
        return res.status(404).json({ 
          message: 'Role not found' 
        });
      }

      // Validate features
      if (features) {
        const validFeatures = await Feature.find({ 
          _id: { $in: features } 
        });
        
        if (validFeatures.length !== features.length) {
          return res.status(400).json({ 
            message: 'Invalid features provided' 
          });
        }
        role.features = features;
      }

      // Update privileges
      if (privileges) {
        role.privileges = privileges;
      }

      // Validate locations
      if (locations) {
        const validLocations = await Location.find({
          _id: { $in: locations }
        });
        
        if (validLocations.length !== locations.length) {
          return res.status(400).json({ 
            message: 'Invalid locations provided' 
          });
        }
        role.locations = locations;
      }

      // Validate assets
      // if (assets) {
      //   const validAssets = await Asset.find({
      //     _id: { $in: assets }
      //   });
        
      //   if (validAssets.length !== assets.length) {
      //     return res.status(400).json({ 
      //       message: 'Invalid assets provided' 
      //     });
      //   }
      //   role.assets = assets;
      // }

      await role.save();

      return res.status(200).json({status:true,data:role});
    } catch (error) {
      console.error('Role update error:', error);
      
      return res.status(500).json({ 
        status:false,
        message: 'Error updating role', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Get a role by its ID
   * @param req Express request object
   * @param res Express response object
   */

  static async getRoleById(req: Request, res: Response): Promise<Response> {
    try {
      const role = await Role.findById(req.params.roleId)
        .populate('features')
        .populate({
          path: 'locations',
          populate: [
              { path: 'children' },   // Populate children inside locations
              { path: 'assets' }      // Populate assets inside locations
          ]
      })
       .lean()
      
      if (!role) {
        return res.status(404).json({ 
          message: 'Role not found' 
        });
      }

      if (role && role.locations) {
        // for (let i = 0; i < role.locations.length; i++) {
        //     role.locations[i] = await this.populateChildren(role.locations[i]);
        // }
    }

      return res.status(200).json(role);
    } catch (error) {
      console.error('Get role error:', error);
      
      return res.status(500).json({ 
        message: 'Error retrieving role', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }


  static async  populateChildren(location: ILocation): Promise<ILocation> {
    if (!location.children || location.children.length === 0) {
        location.children = []; // Ensure it's always an array
        return location;
    }

    // Fetch all children and populate their fields
    const populatedChildren: ILocation[] = await Location.find({ _id: { $in: location.children } })
        .populate('children')  // Populate first-level children
        .populate('assets')    // Populate assets
        .lean();

    // Recursively populate each child's children
    for (let i = 0; i < populatedChildren.length; i++) {
        populatedChildren[i] = await this.populateChildren(populatedChildren[i]);
    }

    location.children = populatedChildren; // Assign populated children
    return location;
}


  /**
   * Get all roles
   * @param req Express request object
   * @param res Express response object
   */
  static async getAllRoles(req: Request, res: Response): Promise<Response> {
    try {
      const roles = await Role.find()
        .populate('features')
        .populate('locations')
        // .populate('assets');

      return res.status(200).json(roles);
    } catch (error) {
      console.error('Get all roles error:', error);
      
      return res.status(500).json({ 
        message: 'Error retrieving roles', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
}