const multipleMongooseToObject = (mongooseArray) => {
    return mongooseArray.map((mongoose) => mongoose.toObject());
}

const mongooseToObject = (mongoose) => {
    return mongoose ? mongoose.toObject() : mongoose;
}

export { multipleMongooseToObject, mongooseToObject };