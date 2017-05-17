# mhagmajer:server-router
Server router with authentication for Meteor

Documentation: https://mhagmajer.github.io/server-router/.

# Installing

`meteor add mhagmajer:server-router`

# Example

## Server-side

```js
import { ServerRouter } from 'meteor/mhagmajer:server-router';

WebApp.connectHandlers.use(ServerRouter.middleware({
  paths: [],
  routes: {
    hello() {
      return `You are ${this.userId}`;
    },
  },
}));
```

## Client-side

```js
import { ServerRouterClient } from 'meteor/mhagmajer:server-router';

const serverRouterClient = new ServerRouterClient({
  routes: {
    hello: 1,
  },
});

<Button onClick={() => {
  ServerRouterClient.redirect.hello();  
}} />
```
