import { ServiceError } from "./ServiceError";

export class ResourceNotFoundError extends ServiceError {
  public constructor(message?: string) {
    super("ResourceNotFoundException", message ?? "Resource not found");
  }
}
