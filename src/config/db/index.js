import mongoose from 'mongoose';

const connect = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1/skin_detection_dev');
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed');
    }
}

export default { connect };