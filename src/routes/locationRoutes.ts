import express, { Request, Response, Router } from 'express';
import { LocationController } from '@controllers/LocationController';

const router = express.Router();

/**
 * @route   POST /api/locations
 * @desc    Create a new location
 * @access  Public (modify as needed based on your authentication strategy)
 */
router.post('/',async (req: Request, res: Response) => {await LocationController.createLocation(req,res)});

/**
 * @route   GET /api/locations
 * @desc    Get all locations
 * @access  Protected (typically requires admin or specific role)
 */
router.get('/',async (req: Request, res: Response) => { LocationController.getAllLocations(req,res)});

/**
 * @route   GET /api/locations/:locationId
 * @desc    Get location by ID with full hierarchy
 * @access  Protected
 */
router.get('/:locationId',async (req: Request, res: Response) => { LocationController.getLocationById(req,res)});

/**
 * @route   PUT /api/locations
 * @desc    Update location
 * @access  Protected
 */
router.put('/',async (req: Request, res: Response) => { LocationController.updateLocation(req,res)});
router.delete('/:id',async (req: Request, res: Response) => {LocationController.deletemodel(req,res)});
export default router;