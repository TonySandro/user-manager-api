import { ServerError, UnauthorizedError } from "../../errors";
import { HttpResponse } from "../../protocols";

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack),
});

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
});

export const redirect = (url: string) => ({
  statusCode: 302,
  headers: { Location: url },
});

export const success = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});
