import express from 'express';
import { getAllAssets, createAsset, updateAsset, deleteAsset } from '../controllers/assetController.js';
import { validateAsset } from '../validations/assetValidation.js';
import { validationResult } from 'express-validator';

const router = express.Router();

router.get('/', getAllAssets);
router.post('/', validateAsset, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  createAsset(req, res);
});
router.put('/:id', updateAsset);
router.delete('/:id', deleteAsset);

export default router;
