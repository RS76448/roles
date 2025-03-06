import express, { Request, Response, Router } from 'express';
import { RoleController } from '@controllers/roleController';

const router: Router = express.Router();

/**
 * @route   POST /api/roles
 * @desc    Create a new role
 * @access  Public (modify as needed based on your authentication strategy)
 */
router.post('/', async (req: Request, res: Response) => {
  await RoleController.createRole(req, res);
});

/**
 * @route   GET /api/roles
 * @desc    Get all roles
 * @access  Protected (typically requires admin or specific role)
 */
router.get('/', async (req: Request, res: Response) => {
  await RoleController.getAllRoles(req, res);
});

/**
 * @route   GET /api/roles/:roleName
 * @desc    Get role by name
 * @access  Protected
 */
router.get('/:roleId', async (req: Request, res: Response) => {
  await RoleController.getRoleById(req, res);
});
router.delete('/:id',async (req: Request, res: Response) => {RoleController.deletemodel(req,res)});
/**
 * @route   PUT /api/roles
 * @desc    Update role
 * @access  Protected
 */
router.put('/', async (req: Request, res: Response) => {
  await RoleController.updateRole(req, res);
});

export default router;