import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix lỗi __dirname khi dùng ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DetectController {

    // GET /detect
    index(req, res ) {
        res.render('detect', { title: 'Detect' });
    }

    // POST /detect/predict (Xử lý upload & detect ảnh)
    async predict(req, res) {
        try {
            const filePath = path.join(__dirname, '../../public/uploads', req.file.filename);

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ error: "File not found" });
            }

            const imageBuffer = fs.readFileSync(filePath);
            const base64Image = imageBuffer.toString('base64');

            const response = await fetch('https://detect.roboflow.com/infer/workflows/skindetetction/small-object-detection-sahi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    api_key: 'zQQ7GkEqFr1v5xUzopon',
                    inputs: {
                        "image": { "type": "base64", "value": base64Image }
                    },
                })
            });
            
            const result = await response.json();

            console.log(result.outputs[0]);

            const outputImage = result.outputs[0]?.output_image?.value 
                ? `data:image/png;base64,${result.outputs[0].output_image.value}`
                : null;
            const predictions = result.outputs[0]?.predictions?.predictions || [];

            const explanation = result.outputs[0]?.explain?.output || [];

            res.json({
                imageDetected: outputImage,
                predictions: predictions,
                explanation: explanation
            });
        } catch (error) {
            console.error("Error in prediction:", error);
            res.status(500).send("Error in processing the image.");
        }
    }
}

export default new DetectController();