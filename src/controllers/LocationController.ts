// src/controllers/locationController.ts
import { Request, Response } from 'express';
import Location from '@models/Location';
import Asset from '@models/Asset';
import mongoose from 'mongoose';
import { LocationHierarchyHelper } from '@utils/locationHierarchyHelper';
import { ILocation, IAsset, EmptyObj, Iassets } from 'types/index';

export class LocationController {
  /**
   * Create a new location
   */
  static async createLocation(req: Request, res: Response): Promise<Response> {
    try {
      const { name, level, parentId,assets } = req.body;
      const alreadythere = await Location.findOne({name:name});
      // console.log(alreadythere)
      if (alreadythere) {
        return res.status(400).json({ 
          status:false,
          message: 'Location name already in use' 
        });
      }
      // console.log("name")
      //  Validate assets
      if (assets) {
        const validAssets = await Asset.find({
          _id: { $in: assets }
        });
        
        if (validAssets.length !== assets.length) {
          return res.status(400).json({ 
            message: 'Invalid assets provided' 
          });
        }
      }
      let parent;
      if(parentId){
        parent=await Location.findById(parentId).lean()
        let parentLevel=parent?.level
        // let parentLevel=parent?.level?parseInt(parent.level):0
        if(parentLevel&&parentLevel>=level){
          return res.json({
            status:false,
            message:"Parent Level should be higher then child level"
          })
        }
      }
     
      const location = await LocationHierarchyHelper.createLocationHierarchy({
        name,
        level,
        parentId,
        assets
      });

      return res.status(201).json({status:true,location});
    } catch (error) {
      console.error('Location creation error:', error);
      
      return res.status(500).json({ 
        status:false,
        message: 'Error creating location', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Get location by ID with full hierarchy
   */
  static async getLocationById(req: Request, res: Response): Promise<Response> {
    try {
      const location = await LocationHierarchyHelper.getLocationHierarchy(
        req.params.locationId
      );
      
      if (!location) {
        return res.status(404).json({ 
          message: 'Location not found' 
        });
      }
      let locationname=location.name
      let childrenArray: string[] = [];
      let levelunder:number[]=[]
      let assetsArray: string[] = [];
      levelunder.push(location.level)
      location?.assets?.map(e=>e?.name&&assetsArray.push(e?.name))
      function traverse(node: ILocation): void {
          // Add child locations to array
          if (node.children) {
              node.children.forEach(child => {
                  if(!(child instanceof mongoose.Types.ObjectId)){
                    if(!childrenArray.includes(child.name)){
                      childrenArray.push(child.name);
                    }
                   
                    // if(!levelunder.includes(child.level)){
                    //   levelunder.push(child.level)
                    // }
                    traverse(child); // Recursively process children
                  }
                 
              });
          }
          node.assets?.forEach(assest=>{
            if(assest.name){
              if(!assetsArray.includes(assest.name)){
                assetsArray.push(assest.name)
              }
             
            }
           
          })
          
      }
  
      traverse(location);
      return res.status(200).json({status:true,data:location,overalldata:{childrenArray:childrenArray?.filter((e)=>e!=locationname),levelunder,assetsArray}});
    } catch (error) {
      console.error('Get location error:', error);
      
      return res.status(500).json({ 
        message: 'Error retrieving location', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
  static async getLocationByIdView(req: Request, res: Response): Promise<Response|void> {
    try {
      const location = await LocationHierarchyHelper.getLocationHierarchy(
        req.params.locationId
      );
      
      if (!location) {
        return res.status(404).json({ 
          message: 'Location not found' 
        });
      }
      let locationname=location.name
      let childrenArray: string[] = [];
      let levelunder:number[]=[]
      let assetsArray: string[] = [];
      levelunder.push(location.level)
      location?.assets?.map(e=>e?.name&&assetsArray.push(e?.name))
      async function traverse(node: ILocation): Promise<void> {
          // Add child locations to array
          if (node.children) {
            for (const child of node.children) {
              if (!(child instanceof mongoose.Types.ObjectId)) {
                if (!childrenArray.includes(child.name)) {
                  childrenArray.push(child.name);
                }
                // Await the recursive call to ensure all processing completes
                await traverse(child);
              }
            }
          }
          if (node.assets && node.assets.length > 0) {
            for (const asset of node.assets) {
              if (asset.name) {
                if (!assetsArray.includes(asset.name)) {
                  assetsArray.push(asset.name);
                }
              } else if (asset instanceof mongoose.Types.ObjectId) {
                try {
                  const assetDoc = await Asset.findById(asset);
                  const assetname = assetDoc?.name;
                  if (assetname && !assetsArray.includes(assetname)) {
                    assetsArray.push(assetname);
                  }
                } catch (err) {
                  console.error(`Error fetching asset ${asset}:`, err);
                  // Continue processing even if one asset fails
                }
              }
            }
          }
          
      }
  
      await traverse(location);
      // return res.json( {
      //   data: location,
      //   overalldata: {
      //     childrenArray: childrenArray?.filter((e) => e != locationname),
      //     levelunder,
      //     assetsArray
      //   }
      // });
      return res.render('locationview', {
        data: location,
        overalldata: {
          childrenArray: childrenArray?.filter((e) => e != locationname),
          levelunder,
          assetsArray
        }
      });
    } catch (error) {
      console.error('Get location error:', error);
      
      return res.status(500).json({ 
        message: 'Error retrieving location', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
  /**
   * Get all locations
   */
  static async getAllLocations(req: Request, res: Response): Promise<Response> {
    try {
      const locations = await Location.find()
        .populate('parent')
        .populate('children');

      return res.status(200).json(locations);
    } catch (error) {
      console.error('Get all locations error:', error);
      
      return res.status(500).json({ 
        message: 'Error retrieving locations', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Update a location
   */
  static async updateLocation(req: Request, res: Response): Promise<Response> {
    try {
      const { locationId, name, parentId,assets } = req.body;

      const location = await Location.findById(locationId);
      
      if (!location) {
        return res.status(404).json({ 
          message: 'Location not found' 
        });
      }

      // Update name if provided
      if (name) location.name = name;
      location.assets=assets
      // Update parent if provided
      if (parentId) {
        let level=location.level
        let parent=await Location.findById(parentId).lean()
        let parentLevel=parent?.level
        // let parentLevel=parent?.level?parseInt(parent.level):0
        if(parentLevel&&parentLevel>=level){
          return res.json({
            status:false,
            message:"Parent Level should be higher then child level"
          })
        }
        // let parent=await Location.findById(parentId);
        if(parent&&parent.parent==locationId){
          return res.json({
            status:false,
            message:"Parent/child cycle not allowed"
          })
        }
        // Remove from current parent's children
        if (location.parent) {
          await Location.findByIdAndUpdate(location.parent, {
            $pull: { children: location._id }
          });
        }

        // Add to new parent's children
        await Location.findByIdAndUpdate(parentId, {
          $push: { children: location._id }
        });

        location.parent = parentId;
      }

      await location.save();

      return res.status(200).json({status:true,location});
    } catch (error) {
      console.error('Location update error:', error);
      
      return res.status(500).json({ 
        status:false,
        message: 'Error updating location', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
   static async deletemodel(req: Request, res: Response): Promise<Response> {
      try {
        const asset = await Location.findById(req.params.id);
  
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
          message: 'Other models are dependent on this Location, It can not be deleted', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
    static async getviableparentlocations(req: Request, res: Response): Promise<Response> {
      try {
        let locationid=req.params.locationId
        const location= await Location.findById(locationid)
        const locations = await Location.find()
          .populate('parent')
          .populate('children');
        const childs=await LocationHierarchyHelper.getLocationHierarchy(locationid)
        
        let childrenArray: string[] = [];
       
       if(childs){
        function traverse(node: ILocation): void {
          // Add child locations to array
          if (node.children) {
              node.children.forEach(child => {
                  if(!(child instanceof mongoose.Types.ObjectId)){
                    if(!childrenArray.includes(child._id.toString())){
                      childrenArray.push(child._id.toString());
                    }
                   
                   
                    traverse(child); // Recursively process children
                  }
                 
              });
          }
        
          
      }
  
        traverse(childs);
       }
       
        // let viablelocations=locations?.filter((e)=>{
        //   let stringedID=e._id.toString()
        //   if((!childrenArray.includes(stringedID))&&(stringedID!=locationid)&&(location?.parent&&!childrenArray?.includes(location?.parent.toString()))){
        //     return e
        //   }
        // })
        let viableLocations = locations?.filter((e) => {
          let stringedID = e._id.toString();
          
          return (
              !childrenArray.includes(stringedID) && 
              stringedID !== locationid && 
              (!location?.parent || !(location.parent.toString()==stringedID))
          );
      });
      
        return res.status(200).json(viableLocations);
      } catch (error) {
        console.error('Get all locations error:', error);
        
        return res.status(500).json({ 
          message: 'Error retrieving locations', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
}