import Course from "../models/Course.js";
import { mongooseToObject, multipleMongooseToObject } from "../../util/mongoose.js";

class CourseController {
    // GET /Courses
    async index(req, res, next) {
        try {
            const courses = await Course.find({});
            res.render('courses/index', { title: 'Courses', courses: multipleMongooseToObject(courses) });
        } catch (error) {
            next(error);
        }
    }

    // GET /Detail
    async detail(req, res, next) {
        try {
            const course = await Course.findOne({ slug: req.params.slug });
            res.render('courses/detail', { title: course.name, course: mongooseToObject(course) });
        } catch (error) {
            next(error);
        }
    }

    // GET /courses/create
    create(req, res) {
        res.render('courses/create', { title: 'Create course' });
    }

    // POST /courses/store
    async store(req, res) {
        try {
            const course = new Course(req.body);
            await course.save();
            res.redirect(`/courses/${course.slug}`);
        } catch (error) {
            console.log(error);
            res.status(500).send("Lỗi khi lưu khóa học");
        }
    }    
}

export default new CourseController();