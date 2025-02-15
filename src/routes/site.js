import express from 'express';
import SiteController from '../app/controllers/SiteController.js';

const router = express.Router();

router.get('/about', SiteController.about);
router.get('/search', SiteController.search);
router.get('/', SiteController.home);

export default router;