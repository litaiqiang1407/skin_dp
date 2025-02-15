import express from 'express';
import DetectController from '../app/controllers/DetectController.js';
import multer from "multer";

const upload = multer({ dest: "src/public/uploads/" });

const router = express.Router();

router.get('/', DetectController.index);
router.post('/predict', upload.single('image'), DetectController.predict);

export default router;