
import Course from "../models/Course.js";
import { multipleMongooseToObject } from "../../util/mongoose.js";
class SiteController {

    // GET /home
    async home(req, res, next) {
        try {
            const courses = await Course.find({});
            res.render('home', { title: 'Home', courses: multipleMongooseToObject(courses) });
        } catch (error) {
            next(error);
        }
    }
    
    // GET /search
    search(req, res ) {
        res.render('search', { title: 'Search' });
    }

    // GET /about
    about(req, res ) {
        res.render('about', { title: 'About' });
    }
}

export default new SiteController();