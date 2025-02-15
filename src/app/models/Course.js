import mongoose from "mongoose";
import slugUpdater from "mongoose-slug-updater";

mongoose.plugin(slugUpdater);


const { Schema } = mongoose;

const CourseSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 255
    },
    description: {
        type: String,
        default: "",
        maxLength: 600
    },
    thumbnail: {
        type: String,
        default: ""
    },
    slug: { type: String, slug: "name", unique: true }
}, {
    timestamps: true
})

const Course = mongoose.model("Course", CourseSchema);

export default Course;