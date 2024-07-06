const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { authenticateToken } = require('./middleware/authMiddleware');
require('./jobs/raffleCronJob'); 
<<<<<<< Updated upstream
=======
const rateLimit = require('express-rate-limit');
const orderRoutes = require('./routes/orderRoutes');
>>>>>>> Stashed changes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

const corsOptions = {
<<<<<<< Updated upstream
  origin: 'http://localhost:3000', // Only allow your frontend's origin
=======
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Use environment variable for origin or default to localhost
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
>>>>>>> Stashed changes
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 30 * 60 * 1000 // 30 minutes
  }
}));

<<<<<<< Updated upstream
=======

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again later.',
});

// Apply the rate limiter to all requests
app.use(limiter);

>>>>>>> Stashed changes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRoutes);
app.use('/api', eventRoutes);
<<<<<<< Updated upstream
=======
app.use('/api/admin', adminRoutes);
app.use('/api', orderRoutes);

>>>>>>> Stashed changes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
