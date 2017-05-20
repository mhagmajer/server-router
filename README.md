# mhagmajer:server-router
Server router with authentication for Meteor

Documentation: [https://mhagmajer.github.io/server-router/](https://mhagmajer.github.io/server-router/).

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
    hello(name) {
      this.res.end(`You ${name}, your id is ${this.userId}`);
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
  serverRouterClient.redirect.hello('John');  
}} />
```

# Publishing (contributors)

Run `npm run clean` before `meteor publish`.
