const bodyParser = require('body-parser')
const fs = require('fs');
const path = require('path');

const addRoutes = (app) => {
    const basePath = path.join(__dirname, `../api/${process.env.API_VERSION}/`);
    fs.readdir(basePath, (err, files) => {
        if (err) {
          console.error('Error reading directory:', err);
          return;
        }
      
        files.forEach(file => {
            const routeFilePath = path.join(basePath, file, 'route.js');

            fs.access(routeFilePath, fs.constants.F_OK, (err) => {
            if (!err) {
                const router = require(routeFilePath);
                app.use(`/${file}`, router);
            } else {
                console.error('File does not exist:', routeFilePath);
            }
            });
        });
    }); 
}

module.exports = {
    addRoutes
}