# Flows-framework Express Based Routes

## Options
* routes - required object with map of the routes
* isAwsRoutes - default false, if this flag is true the object that pass to the flow will mimic aws object
  `{headers, body, pathParameters, queryStringParameters}`
* port - default 8080

Default object that pass to the flow
`{headers, body, params, query}`

## Usage
```js
const flowsFramework = require('@codeinkit/flows-framework');
const restRoutes = require('@codeinkit/express-routes')
const routes = {
  'get route': 'flow/path'
};

(async () => {
  await flowsFramework.init(__dirname);

  await flowsFramework.addRoute(restRoutes({routes}))
})();
```