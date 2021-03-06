const express = require('express');
const app = express();
const _ = require('lodash');

async function awsRouteRegister(flowName, exec, statefulObj, req, res) {
  const response = 
    await exec(flowName, {
      headers: req.headers, body: req.body, pathParameters: req.params, queryStringParameters: req.query}, {res, req, ...statefulObj})
    .catch(error => ({statusCode: 500, body:{error: error.message}}));

  res.status(response.statusCode).send(response.body);
}

async function standardRouteRegister(flowName, exec, statefulObj, req, res) {
  const response = 
    await exec(flowName, {headers: req.headers, body: req.body, params: req.params, query: req.query}, {res, req, ...statefulObj})
    .catch(error => ({error: error.message}));
  
  if(_.has(response, 'error')) {
    return res.status(500).send(response);
  }
  
  res.send(response);
}

module.exports = (data = {isAwsRoutes: false, port: 8080, routes: {}, middlewares: [], statefulObj: {}}) => (exec) => {
  const restRoutes = data.routes;

  _.each(data.middlewares, middleware => {
    app.use(middleware);
  })

  _.each(restRoutes, (flowName, routeName) => {
    const [method, url] = routeName.split(' ');

    app[method](url, async (req, res) => {
      data.isAwsRoutes 
        ? await awsRouteRegister(flowName, exec, data.statefulObj, req, res)
        : await standardRouteRegister(flowName, exec, data.statefulObj, req, res);
    });
  });

  app.listen(data.port, () => {
    console.log(`${new Date()} rest server is listening on port ${data.port}`);
  });
}