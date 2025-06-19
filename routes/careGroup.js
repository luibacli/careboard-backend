import express from 'express';
import {
  createCareGroup,
    getAllCareGroups,
  getCareGroupsByMain,
  getCareGroup,
  updateCareGroup,
  deleteCareGroup
} from '../controllers/careGroupController.js';

const router = express.Router();

router.post('/', createCareGroup);
router.get('/', getAllCareGroups);
router.get('/main/:main', getCareGroupsByMain);
router.get('/:id', getCareGroup);
router.put('/:id', updateCareGroup);
router.delete('/:id', deleteCareGroup);

export default router;
