import { ServiceError } from "./ServiceError";

export class ParameterNotFoundError extends ServiceError {
  public constructor(
    message = "The parameter couldn't be found. Verify the name and try again."
  ) {
    super("ParameterNotFoundError", message);
  }
}
