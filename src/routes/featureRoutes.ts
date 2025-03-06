import express, { Request, Response, Router } from 'express';
import { FeatureController } from '@controllers/FeatureController';

const router = express.Router();

/**
 * @route   POST /api/features
 * @desc    Create a new feature
 * @access  Public (modify as needed based on your authentication strategy)
 */
router.post('/',async (req: Request, res: Response) => {await FeatureController.createFeature(req, res)});

/**
 * @route   GET /api/features
 * @desc    Get all features
 * @access  Protected (typically requires admin or specific role)
 */
router.get('/', async (req: Request, res: Response) => {await FeatureController.getAllFeatures(req, res)});

/**
 * @route   GET /api/features/:featureName
 * @desc    Get feature by name
 * @access  Protected
 */
router.get('/:featureName', async (req: Request, res: Response) => {await FeatureController.getFeatureByName(req, res)});

/**
 * @route   PUT /api/features
 * @desc    Update feature
 * @access  Protected
 */
router.put('/',async (req: Request, res: Response) => {await FeatureController.updateFeature(req, res)});

export default router;