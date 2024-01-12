const express = require('express')
const app = express();
const {acceptJson, addRoutes} = require('./utils/utils')
require('dotenv').config();
app.listen(process.env.PORT, () => {
    addRoutes(app);
    console.log('App started at port 3000')
})
