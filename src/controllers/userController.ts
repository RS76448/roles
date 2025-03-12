// src/controllers/userController.ts
import { Request, Response } from 'express';
import User from '@models/User';
import Role from '@models/Role';
import { IUser } from 'types/index';
import { populate } from 'dotenv';

export class UserController {
  /**
   * Create a new user
   */
  static async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const { username, email, roleId } = req.body;
      console.log("username",username)
      // Check if role exists
      if (roleId) {
        const role = await Role.findById(roleId);
        if (!role) {
          return res.status(400).json({ 
            message: 'Invalid role provided' 
          });
        }
      }

      // Check if username or email already exists
      const existingUser = await User.findOne({
        $or: [{ username }, { email }]
      });

      if (existingUser) {
        return res.status(400).json({ 
          message: 'Username or email already exists' 
        });
      }

      const newUser: IUser = new User({
        username,
        email,
        role: roleId
      });

      await newUser.save();

      return res.status(201).json({status:true,newUser});
    } catch (error) {
      console.error('User creation error:', error);
      
      return res.status(500).json({ 
        status:false,
        message: 'Error creating user', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Get user by ID
   */
  
  static async getUserByIdView(req: Request, res: Response): Promise<Response|void> {
    try {
      const user = await User.findById(req.params.userId)
      .populate({
        path: 'role',
        populate: [
            { path: 'locations' },   // Populate children inside locations
            { path: 'features' }      // Populate assets inside locations
        ]
    })
        
      if (!user) {
        return res.status(404).json({ 
          message: 'User not found' 
        });
      }

      return res.render("userview",{users:[user]});
    } catch (error) {
      console.error('Get user error:', error);
      
      return res.status(500).json({ 
        message: 'Error retrieving user', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
  static async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const user = await User.findById(req.params.userId)
      .populate({
        path: 'role',
        populate: [
            { path: 'locations' },   // Populate children inside locations
            { path: 'features' }      // Populate assets inside locations
        ]
    })
        
      if (!user) {
        return res.status(404).json({ 
          message: 'User not found' 
        });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error('Get user error:', error);
      
      return res.status(500).json({ 
        message: 'Error retrieving user', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Update user
   */
  static async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const { userId, username, email, roleId } = req.body;

      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ 
          message: 'User not found' 
        });
      }

      // Check if role exists
      if (roleId) {
        const role = await Role.findById(roleId);
        if (!role) {
          return res.status(400).json({ 
            message: 'Invalid role provided' 
          });
        }
        user.role = roleId;
      }

      // Update username and email if provided
      if (username) user.username = username;
      if (email) user.email = email;

      await user.save();

      return res.status(200).json({status:true,user});
    } catch (error) {
      console.error('User update error:', error);
      
      return res.status(500).json({ 
        status:false,
        message: 'Error updating user', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Get all users
   */
  static async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await User.find()
        .populate({
          path:'role',
          populate:[{
            path:"features"
          },{
            path:"locations",
            populate:[
              {path:"assets"}
            ]
          }]
        });

      return res.status(200).json(users);
    } catch (error) {
      console.error('Get all users error:', error);
      
      return res.status(500).json({ 
        message: 'Error retrieving users', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
   static async deletemodel(req: Request, res: Response): Promise<Response> {
        try {
          const asset = await User.findById(req.params.id);
    
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
            message: 'Other models are dependent on this User, It can not be deleted', 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      }
}