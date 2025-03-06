import express, { Request, Response, Router } from 'express';
import { UserController } from '@controllers/userController';

const router = express.Router();

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Public (modify as needed based on your authentication strategy)
 */
router.post('/',async (req: Request, res: Response) => { UserController.createUser(req,res)});

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Protected (typically requires admin role)
 */
router.get('/', async (req: Request, res: Response) => {UserController.getAllUsers(req,res)});

/**
 * @route   GET /api/users/:userId
 * @desc    Get user by ID
 * @access  Protected
 */
router.get('/:userId',async (req: Request, res: Response) => { UserController.getUserById(req,res)});

/**
 * @route   PUT /api/users
 * @desc    Update user
 * @access  Protected
 */
router.put('/',async (req: Request, res: Response) => { UserController.updateUser(req,res)});
router.delete('/:id',async (req: Request, res: Response) => {UserController.deletemodel(req,res)});
export default router;