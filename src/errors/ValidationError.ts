import { ServiceError } from "./ServiceError";

export class ValidationError extends ServiceError {
  public constructor(message = "The parameter data was invalid") {
    super("ValidationError", message);
  }
}
