import express from 'express';
import { getProfile, patchProfile } from "../controllers/profileController.js";

const router = express.Router();

router.get('/', getProfile);
router.patch('/', patchProfile);

export { router as profileRoutes };