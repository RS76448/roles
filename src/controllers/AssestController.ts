// src/controllers/assetController.ts
import { Request, Response } from 'express';
import Asset from '@models/Asset';
import Location from '@models/Location';
import { IAsset } from 'types/index';

export class AssetController {
  /**
   * Create a new asset
   */
  static async createAsset(req: Request, res: Response): Promise<Response> {
    try {
      const { name, locationId, description } = req.body;

      // Validate location
      const location = await Location.findById(locationId);
      if (!location) {
        return res.status(400).json({ 
          message: 'Invalid location provided' 
        });
      }

      const newAsset: IAsset = new Asset({
        name,
        location: locationId,
        description
      });

      await newAsset.save();

      return res.status(201).json({status:true,newAsset});
    } catch (error) {
      console.error('Asset creation error:', error);
      
      return res.status(500).json({ 
        status:false,
        message: 'Error creating asset', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Get asset by ID
   */
  static async getAssetById(req: Request, res: Response): Promise<Response> {
    try {
      const asset = await Asset.findById(req.params.assetId)
        .populate('location');

      if (!asset) {
        return res.status(404).json({ 
          message: 'Asset not found' 
        });
      }

      return res.status(200).json(asset);
    } catch (error) {
      console.error('Get asset error:', error);
      
      return res.status(500).json({ 
        message: 'Error retrieving asset', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Update an asset
   */
  static async updateAsset(req: Request, res: Response): Promise<Response> {
    try {
      const { assetId, name, locationId, description } = req.body;

      const asset = await Asset.findById(assetId);
      
      if (!asset) {
        return res.status(404).json({ 
          message: 'Asset not found' 
        });
      }

      // Validate location if provided
      if (locationId) {
        const location = await Location.findById(locationId);
        if (!location) {
          return res.status(400).json({ 
            message: 'Invalid location provided' 
          });
        }
        asset.location = locationId;
      }

      // Update other fields
      if (name) asset.name = name;
      if (description) asset.description = description;

      await asset.save();

      return res.status(200).json({status:true,asset});
    } catch (error) {
      console.error('Asset update error:', error);
      
      return res.status(500).json({ 
        status:false,
        message: 'Error updating asset', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Get all assets
   */
  static async getAllAssets(req: Request, res: Response): Promise<Response> {
    try {
      const assets = await Asset.find()
        .populate('location');

      return res.status(200).json(assets);
    } catch (error) {
      console.error('Get all assets error:', error);
      
      return res.status(500).json({ 
        message: 'Error retrieving assets', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
}