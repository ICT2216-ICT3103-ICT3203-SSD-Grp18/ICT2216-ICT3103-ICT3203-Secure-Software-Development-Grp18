const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());  // Enable CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${JSON.stringify(req.body)}`);
  next();
});

require('./routes/user.routes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
