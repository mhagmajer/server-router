/* @flow */

declare module 'meteor/mhagmajer:server-router' {
  declare type Path = {|
    path: string,
    options?: {|
      sensitive?: boolean,
      strict?: boolean,
      end?: boolean,
      delimiter?: string,
    |},
    args: ArgsMapper,
    route: Route,
  |};

  declare type ArgsMapper = (
    params: { [key: string]: string | Array<string> },
    query: { [key: string]: string }
  ) => Array<any>;

  declare type Route = (...args: Array<any>) => Promise<void | null | string | Buffer>;

  declare type Routes = { [name: string]: Route | Routes }

  declare export type ServerRouterContext = {
    req: http$IncomingMessage,
    res: http$ServerResponse,
    userId: ?string,
  };

  declare export class ServerRouter {
    constructor(options: {|
      routes: Routes,
      defaultRoutePath?: string,
      paths: Array<Path>,
    |}): this;

    addPath(data: Path): void;
    addPaths(data: Array<Path>): void;
    addRoutes(routes: Routes): void;
    middleware: (req: http$IncomingMessage, res: http$ServerResponse, next: (error?: any) => void) => void;
  }

  declare export class AuthenticationRequiredError {
  }

  declare export class ServerRouterClient<R: Routes> {
    constructor(options: {|
      routes: R,
      defaultRoutePath?: string,
    |}): this;

    redirectTo(href: string): Promise<void>;
    getRouteUrl(name: string, ...args: Array<any>): string;
    redirectToRoute(name: string, ...args: Array<any>): Promise<void>;

    url: R;
    redirect: R;
  }
}
