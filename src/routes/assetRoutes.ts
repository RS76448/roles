import express, { Request, Response, Router } from 'express';
import { AssetController } from '@controllers/AssestController';

const router = express.Router();

/**
 * @route   POST /api/assets
 * @desc    Create a new asset
 * @access  Public (modify as needed based on your authentication strategy)
 */
router.post('/',async (req: Request, res: Response) => {
  await AssetController.createAsset(req,res)
});

/**
 * @route   GET /api/assets
 * @desc    Get all assets
 * @access  Protected (typically requires admin or specific role)
 */
router.get('/',async (req: Request, res: Response) => { await AssetController.getAllAssets(req,res)});

/**
 * @route   GET /api/assets/:assetId
 * @desc    Get asset by ID
 * @access  Protected
 */
router.get('/:assetId',async (req: Request, res: Response) => { await AssetController.getAssetById(req,res)});

/**
 * @route   PUT /api/assets
 * @desc    Update asset
 * @access  Protected
 */
router.put('/',async (req: Request, res: Response) => {AssetController.updateAsset(req,res)});

export default router;