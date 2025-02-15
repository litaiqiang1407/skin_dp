import express from 'express';
import detectRouter from './detect.js';
import siteRouter from './site.js';
import coursesRouter from './courses.js';

const router = express.Router();

router.use('/detect', detectRouter);
router.use('/courses', coursesRouter);
router.get('/', siteRouter);

export default router;
