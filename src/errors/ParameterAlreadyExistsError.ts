import { ServiceError } from "./ServiceError";

export class ParameterAlreadyExistsError extends ServiceError {
  public constructor(
    message = "The parameter already exists. To overwrite this value, set the overwrite option in the request to true."
  ) {
    super("ParameterAlreadyExistsError", message);
  }
}
