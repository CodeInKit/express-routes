const express = require('express');
const app = express();
const _ = require('lodash');

function awsRouteRegister(flowName, exec, req, res) {
  const response = await exec(flowName, {headers: req.headers, body: req.body, pathParameters: req.params, queryStringParameters: req.query})
  .catch(error => ({statusCode: 500, body:{error: error.message}}));

  res.status(response.statusCode).send(response.body);
}

function standardRouteRegister(flowName, exec, req, res) {
  const response = await exec(flowName, {headers: req.headers, body: req.body, params: req.params, query: req.query});
  
  res.send(response);
}

module.exports = (data = {isAwsRoutes: false, port: 8080, routes: {}}) => (exec) => {
  const restRoutes = data.routes;

  _.each(restRoutes, (flowName, routeName) => {
    const [method, url] = routeName.split(' ');

    app[method](url, async (req, res) => {
      data.isAwsRoutes 
        ? awsRouteRegister(flowName, exec, req, res)
        : standardRouteRegister(flowName, exec, req, res);
    });
  });

  app.listen(data.port, () => {
    console.log(`${new Date()} rest server is listening on port ${data.port}`);
  });
}