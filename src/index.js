require("dotenv").config();

// var proxy = require('html2canvas-proxy');
const express = require('express');
const cors = require('cors');
// const path = require("path");
const routes = require('./routes');
// const cookieParser = require('cookie-parser');
// const bodyParser = require("body-parser");
// const projectRoot = process.cwd();
// const staticFilesDirectory = path.join(projectRoot, 'src', 'temp', 'uploads');

const app = express();

// const allowedOrigins = ['https://www.valuationshub.com','https://valuationshub.com', 'https://valuationshub.onrender.com','http://localhost:3000'];
const allowedOrigins = ['http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
  allowedHeaders: 'Content-Type,Authorization',
  maxAge: 86400, 
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions))
// app.use('/', proxy());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(cookieParser());

// app.use('/files', express.static(staticFilesDirectory));
app.use(routes);

app.use((error, request, response, next) => {
  response.status(error.status || 500);
  response.json({ error: error.message });
});

app.listen(4000, () => {
  console.log('Servidor de Unotres S.A. en puerta 4000');
});