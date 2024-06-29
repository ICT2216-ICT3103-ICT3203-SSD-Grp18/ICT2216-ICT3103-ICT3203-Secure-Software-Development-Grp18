const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { authenticateToken } = require('./middleware/authMiddleware');
require('./jobs/raffleCronJob'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Use environment variable for origin or default to localhost
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
};

app.use(helmet()); // Use helmet for setting various HTTP headers
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 30 * 60 * 1000 // 30 minutes
  }
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRoutes);
app.use('/api', eventRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
