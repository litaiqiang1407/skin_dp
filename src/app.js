import express from 'express';
import { engine } from 'express-handlebars';
import morgan from 'morgan';
import routes from './routes/index.js'; // import router
import db from './config/db/index.js';

// Connect to the database
db.connect();

const app = express();
const port = 3000;

// Serve static files (CSS, images, etc.) from the 'public' directory
app.use(express.static('src/public'));

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Used to parse JSON bodies

// HTTP request logger middleware
// app.use(morgan('combined'));

// Set Handlebars as the template engine with .hbs extension
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: './src/resources/views/layouts', 
  partialsDir: './src/resources/views/partials',
  viewsDir: './src/resources/views/pages', 
}));

app.set('view engine', 'hbs');
app.set('views', './src/resources/views/pages'); 

app.set('view cache', false);

// Use the defined routes
app.use(routes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
