export class Response {
  code: number;
  msg: string;
  data: any;
}

export class SucceedResponse {
  code: number = 0;
  msg: string = 'OK';
  data: any;
}

export class FailedResponse {
  code: number = 1;
  msg: string;
  data: any;
}

export class ResponseData {
  code: number = 0;
  msg: string = 'OK';
  data: any = {};
}