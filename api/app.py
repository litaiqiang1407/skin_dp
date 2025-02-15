import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
from fastapi import FastAPI, File, UploadFile
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from pathlib import Path
from PIL import Image

tf.get_logger().setLevel('ERROR')

# Khởi tạo FastAPI app
app = FastAPI()

# Định nghĩa đường dẫn đến model đã lưu
MODEL_PATH = Path("models/resnet.keras")

# Kiểm tra mô hình có tồn tại không
if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Không tìm thấy mô hình tại {MODEL_PATH}")

# Danh sách lớp (bệnh da)
labels_map = {0: "Acne", 1: "Chickenpox", 2: "Monkeypox", 3: "Measles"}

# Hàm tiền xử lý ảnh
def preprocess_image(img: Image.Image):
    """Resize ảnh, chuẩn hóa và chuyển thành tensor phù hợp với ResNet"""
    img = img.resize((224, 224))  # Resize về kích thước ResNet yêu cầu
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = tf.keras.applications.resnet.preprocess_input(img_array)  # Tiền xử lý theo chuẩn ResNet
    return img_array

# API nhận ảnh từ người dùng và dự đoán
@app.post("/analyze/")
async def analyze(file: UploadFile = File(...)):
    """
    API nhận ảnh, dự đoán bệnh da bằng ResNet, và trả về kết quả.
    """

    # **1. Đọc ảnh**
    img = Image.open(file.file).convert("RGB")

    # **2. Tiền xử lý ảnh**
    processed_image = preprocess_image(img)


    # **3. Load lại mô hình ResNet để đảm bảo dùng dữ liệu mới**
    tf.keras.backend.clear_session()  # Xóa cache của mô hình
    model = load_model(str(MODEL_PATH), compile=False)

    # **4. Dự đoán bằng ResNet**
    prediction = model.predict(processed_image)
    predicted_class = int(np.argmax(prediction))  # Chuyển từ numpy int thành Python int
    predicted_label = labels_map[predicted_class]
    
    # ✅ Chuyển numpy.float32 thành float Python để tránh lỗi FastAPI
    confidence = float(np.max(prediction) * 100)

    print(f"✅ Dự đoán từ ResNet: {predicted_label} (Độ tin cậy: {confidence:.2f}%)")

    # **5. Hiển thị ảnh và kết quả**
    plt.imshow(img)
    plt.axis("off")
    plt.title(f"Dự đoán: {predicted_label}\nĐộ tin cậy: {confidence:.2f}%", color='blue')
    plt.savefig("result.png")  # Lưu hình ảnh với kết quả
    plt.close()

    # **6. Trả về kết quả JSON**
    return {
        "predicted_class": predicted_label,
        "confidence": float(round(confidence, 2)), 
        "image_path": "result.png"
    }

# Chạy server với: uvicorn app:app --host 0.0.0.0 --port 5000 --reload
