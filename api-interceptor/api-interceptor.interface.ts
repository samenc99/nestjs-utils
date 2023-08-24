export interface IHandle {
  body: any;
  params: any;
  query: any;
  url: string;
  method: string;
  user?: any;
}

export interface IHandleIntercept extends IHandle {
  response: any;
}

export interface IHandleCatch extends IHandle {
  exception: any;
}
