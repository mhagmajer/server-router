# mhagmajer:server-router
Server router with authentication for Meteor

Documentation: https://mhagmajer.github.io/server-router/.

# Installing

`meteor add mhagmajer:server-router`

You can find Flow type definitions in `/definitions`.

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
  serverRouterClient.redirect.hello();  
}} />
```

# Publishing (collaborators)

Run `npm run clean` before `meteor publish`.
