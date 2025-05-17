import { body } from 'express-validator';

export const validateAsset = [
  body('assetName')
    .trim()
    .notEmpty().withMessage('Asset Name is required.')
    .isLength({ max: 100 }).withMessage('Asset Name must be at most 100 characters.'),
  
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required.')
    .isLength({ max: 100 }).withMessage('Location must be at most 100 characters.'),
  
  body('dateAcquired')
    .notEmpty().withMessage('Date Acquired is required.')
    .isISO8601().withMessage('Date Acquired must be a valid date.')
    .toDate()
];
