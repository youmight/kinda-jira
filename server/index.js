const express = require('express')
const app = express();
const { acceptJson, addRoutes } = require('./utils/utils')
require('dotenv').config();
const db = require('./utils/sequelizeLoader')

db.sequelize
    .sync()
    .then((result) => {
        app.listen(process.env.PORT, () => {
            acceptJson(app);
            addRoutes(app);
            console.log('App started at port 3000')
        })
    })
    .catch((err) => {
        console.log(err);
    });
