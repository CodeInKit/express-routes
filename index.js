const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const RESTPORT = process.env.RESTPORT || '8080'; 
const _ = require('lodash');
const cors = require('cors');
const compression = require('compression')

module.exports = (data) => (exec) => {
  const restRoutes = data.routes;
  
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cors());
  app.use(compression({level: 1}))

  _.each(restRoutes, (flowName, routeName) => {
    const [method, url] = routeName.split(' ');

    app[method](url, async (req, res) => {
      const response = await exec(flowName, {headers: req.headers, body: req.body, params: req.params, query: req.query});
      if(response.file) {
        return res.sendFile(response.file);
      } 
      
      res.send(response);
    });
  });

  app.listen(RESTPORT, () => {
    console.log(`${new Date()} rest server is listening on port ${RESTPORT}`);
  });
}