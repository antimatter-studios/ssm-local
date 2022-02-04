export class ServiceError extends Error {
  public readonly __type: string;
  public readonly code: string;

  public constructor(code: string, message: string) {
    super(message);
    this.__type = code;
    this.code = `SSMLocal#${code}`;
  }
}
