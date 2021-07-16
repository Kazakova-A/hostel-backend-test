import { RESPONSE_STATUSES as rs, SERVER_MESSAGES as sm } from '../config';
import { ResponseObject } from './types';

export default (
  Request,
  Response,
  status = rs[200],
  message = sm.ok,
  data = null,
  middleware = false,
) => {
  const responseObject: ResponseObject = {
    datetime: Date.now(),
    message,
    request: `${(middleware && Request.originalUrl) || Request.url} [${
      Request.method
    }]`,
    status,
  };
  if (data) {
    responseObject.data = data;
  }

  if (middleware) {
    Response.setHeader('Content-Type', 'application/json');
    Response.statusCode = status;
    return Response.end(JSON.stringify(responseObject));
  }

  return Response.send(responseObject);
};
