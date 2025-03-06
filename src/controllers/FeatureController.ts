// src/controllers/featureController.ts
import { Request, Response } from 'express';
import Feature from '@models/Feature';
import { IFeature } from 'types/index';

export class FeatureController {
  /**
   * Create a new feature
   */
  static async createFeature(req: Request, res: Response): Promise<Response> {
    try {
      const { name, description } = req.body;

      // Check if feature already exists
      const existingFeature = await Feature.findOne({ name });
      if (existingFeature) {
        return res.status(400).json({ 
          message: 'Feature already exists' 
        });
      }

      const newFeature: IFeature = new Feature({
        name,
        description
      });

      await newFeature.save();

      return res.status(201).json({status:true,newFeature});
    } catch (error) {
      console.error('Feature creation error:', error);
      
      return res.status(500).json({ 
        status:false,
        message: 'Error creating feature', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Get feature by name
   */
  static async getFeatureByName(req: Request, res: Response): Promise<Response> {
    try {
      const feature = await Feature.findOne({ 
        _id: req.params.featureName 
      });

      if (!feature) {
        return res.status(404).json({ 
          message: 'Feature not found' 
        });
      }

      return res.status(200).json(feature);
    } catch (error) {
      console.error('Get feature error:', error);
      
      return res.status(500).json({ 
        message: 'Error retrieving feature', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Get all features
   */
  static async getAllFeatures(req: Request, res: Response): Promise<Response> {
    try {
      const features = await Feature.find();

      return res.status(200).json(features);
    } catch (error) {
      console.error('Get all features error:', error);
      
      return res.status(500).json({ 
        message: 'Error retrieving features', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Update a feature
   */
  static async updateFeature(req: Request, res: Response): Promise<Response> {
    try {
      const { name, description,id } = req.body;

      const feature = await Feature.findById(id);
      
      if (!feature) {
        return res.status(404).json({ 
          message: 'Feature not found' 
        });
      }

      // Update description if provided
      if (description) feature.description = description;
      if(name) feature.name=name
      await feature.save();

      return res.status(200).json({status:true,feature});
    } catch (error) {
      console.error('Feature update error:', error);
      
      return res.status(500).json({ 
        status:false,
        message: 'Error updating feature', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
   static async deletemodel(req: Request, res: Response): Promise<Response> {
      try {
        const asset = await Feature.findById(req.params.id);
  
        if (!asset) {
          return res.status(404).json({status:false, message: "model not found" });
        }
  
        // **Delete related records if they exist**
       
  
        // **Delete the asset**
        await asset.deleteOne();
  
        return res.status(200).json({status:true});
      } catch (error) {
        console.error('Get asset error:', error);
        
        return res.status(500).json({ 
          message: 'Other models are dependent on this Feature, It can not be deleted', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
}