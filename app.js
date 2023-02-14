const express = require('express');
require("dotenv").config();
const app = express();
var bodyParser = require("body-parser");
const API_BASE_URL = process.env.API_BASE_URL;

const PORT = process.env.PORT || 4000;
const cors = require('cors')
const mongoose = require('mongoose');
const MONGODB_URL = process.env.MONGODB_URL;

global.__basedir = __dirname;
mongoose.connect(MONGODB_URL);

mongoose.connection.on('connected', () => {
    console.log('db connected');
})

app.use(cors());
app.use(express.json());

require('./models/user_model')
require('./models/post_model')

app.use(require('./routes/user_route'));
app.use(require('./routes/post_route'));
app.use(require('./routes/file_route'));


app.listen(PORT, () => {
    console.log("server statred")
})