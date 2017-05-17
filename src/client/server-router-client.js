/* @flow */
/* globals window: false */

import { EJSON } from 'meteor/ejson';
import { Meteor } from 'meteor/meteor';
import pathToRegexp from 'path-to-regexp';
import queryString from 'query-string';
import Url from 'url-parse';

type Routes = { [name: string]: any | Routes }

/**
 * Client for ServerRouter
 *
 * @param options
 * @param {Routes} options.routes Known server-side routes. When providing this object you can
 * substitute function with anything other than object. For example:
 * ```javascript
 * const x: any = 1;
 * const routes: Routes = {
 *   Reports: {
 *     genReport: x,
 *     genReport2: x,
 *   },
 * };
 * ```
 * This is used to populate {@link #ServerRouterClient#url} and
 * @param {string} [options.defaultRoutePath=/r/:name/:args*] Same as in {@link ServerRouter}.
 */
export class ServerRouterClient<R: Routes> {
  constructor(options: {|
    routes: R,
    defaultRoutePath?: string,
  |}) {
    this._routes = options.routes;
    this._defaultRoutePath = pathToRegexp.compile(options.defaultRoutePath || '/r/:name/:args*');

    this.url = this._createRouteHandlers();
    this.redirect = this._createRouteHandlers({
      redirect: true,
    });

    InjectData.getData('_ServerRouterAuthenticationRequired', (shouldRefresh) => {
      if (!shouldRefresh || !Meteor.userId()) {
        return;
      }
      this.redirectTo(window.location.href);
    });
  }

  /**
   * Redirects to given url with authentication. If you want to redirect to a publicly available
   * route, you can just do:
   * ```javascript
   * window.location.href = 'http://www.meteor.com/';
   * ```
   *
   * Returns a promise so you catch any errors connected with the authentication itself.
   */
  async redirectTo(href: string): Promise<void> {
    const userId = Meteor.userId();
    if (!userId) {
      window.location.href = href;
      return;
    }

    const token = await new Promise((resolve, reject) => {
      Meteor.call('_ServerRouterGetUserToken', (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    const url = new Url(href);
    const query = queryString.parse(url.query);
    Object.assign(query, {
      _u: userId,
      _t: token,
    });
    url.set('query', queryString.stringify(query));

    window.location.href = url.toString();
  }

  /**
   * Returns url for given route and args.
   */
  getRouteUrl(name: string, ...args: Array<any>): string {
    return this._defaultRoutePath({ name, args: args.map(EJSON.stringify) });
  }

  /**
   * Redirects to given route and args with authenication. Short for (example):
   * ```javascript
   * serverRouter.redirectTo(serverRouter.getRouteUrl('privateImages.img1', 800, 600));
   * ```
   *
   * Returns a promise for the same reason like {@link #ServerRouterClient#redirectTo}.
   */
  async redirectToRoute(name: string, ...args: Array<any>) {
    return this.redirectTo(this.getRouteUrl(name, ...args));
  }

  /**
   * Convenient getters of urls for server routes. Compatible with static type checkers like Flow.
   * @example
   * console.log(serverRouter.url.privateImages.img1(800, 600));
   */
  url: R;

  /**
   * Convenient methods for redirecting to a server route with authentication.
   * @example
   * serverRouter.redirect.privateImages.img1(800, 600);
   */
  redirect: R;

  _routes: R;
  _defaultRoutePath: () => string;

  _createRouteHandlers(options?: {|
    redirect?: boolean,
  |}): R {
    const { redirect } = options || {};

    // non-object values are mapped to route calls
    const routes: any = mapValuesDeep(this._routes, (value, name) => (...args) => {
      const url = this.getRouteUrl(name, args);

      if (!redirect) {
        return url;
      }

      return this.redirectTo(url);
    });
    return routes;
  }
}

function mapValuesDeep(
  obj: { [key: string]: any },
  mapper: (value: any, key: string) => any,
  keyPrefix?: string,
) {
  const ret = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const deepKey = (keyPrefix || '') + key;
    if (typeof value === 'object' && value != null) {
      ret[key] = mapValuesDeep(value, mapper, `${deepKey}.`);
    } else {
      ret[key] = mapper(value, deepKey);
    }
  });
  return ret;
}
