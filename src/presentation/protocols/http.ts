export interface HttpResponse {
  statusCode: number;
  body: any;
  headers?: any;
}

export interface HttpRequest {
  body?: any;
  params?: any;
  headers?: any;
  query?: any;
}
