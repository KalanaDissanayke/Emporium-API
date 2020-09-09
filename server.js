const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const connectDB = require('./config/db');
const swaggerOptions = require('./config/swagger.conf');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const products = require('./routes/products');
const categories = require('./routes/categories');
const auth = require('./routes/auth');
const admin = require('./routes/admin');
const users = require('./routes/users');
const reviews = require('./routes/reviews');
const carts = require('./routes/carts');
const orders = require('./routes/orders');

const app = express();

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// File Uploading
app.use(fileupload());

// Sanitize Data
app.use(mongoSanitize());

// Set Security Headers
app.use(helmet());

// Prevent XSS Attacks
app.use(xss());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100,
});

app.use(limiter);

// Prevent HTTP Param Pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Swagger Options
const specs = swaggerJSDoc(swaggerOptions);

// Mount routers
app.use('/api/v1/products', products);
app.use('/api/v1/categories', categories);
app.use('/api/v1/auth', auth);
app.use('/api/v1/admin/products', admin);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/carts', carts);
app.use('/api/v1/orders', orders);

app.use(errorHandler);

// Document routes
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold),
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);

    // Close server & exit process
    server.close(() => process.exit());
});
