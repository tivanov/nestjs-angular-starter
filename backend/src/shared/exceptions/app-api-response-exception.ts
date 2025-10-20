export class ApiResponseException extends Error {
  response: any;
  code: string;
  constructor(message: string, code: string, response: any) {
    super(message);
    this.code = code;
    this.response = response;
  }
}
