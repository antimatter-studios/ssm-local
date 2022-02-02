import { Response } from "express";
import { Logger } from "./log";

export class UnsupportedError extends Error {}

export class ServiceError extends Error {
  public readonly __type: string;
  public readonly code: string;

  public constructor(code: string, message: string) {
    super(message);
    this.__type = code;
    this.code = `SSMLocal#${code}`;
  }
}

export class NotAuthorizedError extends ServiceError {
  public constructor() {
    super("NotAuthorizedException", "User not authorized");
  }
}

export class UserNotFoundError extends ServiceError {
  public constructor(message = "User not found") {
    super("UserNotFoundException", message);
  }
}

export class UsernameExistsError extends ServiceError {
  public constructor() {
    super("UsernameExistsException", "User already exists");
  }
}

export class CodeMismatchError extends ServiceError {
  public constructor() {
    super("CodeMismatchException", "Incorrect confirmation code");
  }
}

export class InvalidPasswordError extends ServiceError {
  public constructor() {
    super("InvalidPasswordException", "Invalid password");
  }
}

export class PasswordResetRequiredError extends ServiceError {
  public constructor() {
    super("PasswordResetRequiredException", "Password reset required");
  }
}

export class ResourceNotFoundError extends ServiceError {
  public constructor(message?: string) {
    super("ResourceNotFoundException", message ?? "Resource not found");
  }
}

export class UnexpectedLambdaExceptionError extends ServiceError {
  public constructor() {
    super(
      "UnexpectedLambdaExceptionException",
      "Unexpected error when invoking lambda"
    );
  }
}

export class UserLambdaValidationError extends ServiceError {
  public constructor(message?: string) {
    super(
      "UserLambdaValidationException",
      message ?? "Lambda threw an exception"
    );
  }
}

export class InvalidLambdaResponseError extends ServiceError {
  public constructor() {
    super("InvalidLambdaResponseException", "Invalid Lambda response");
  }
}

export class InvalidParameterError extends ServiceError {
  public constructor(message = "Invalid parameter") {
    super("InvalidParameterException", message);
  }
}

export class ValidationError extends ServiceError {
  public constructor(message = "The parameter data was invalid") {
    super("ValidationError", message);
  }
}

export class ParameterAlreadyExistsError extends ServiceError {
  public constructor(
    message = "The parameter already exists. To overwrite this value, set the overwrite option in the request to true."
  ) {
    super("ParameterAlreadyExistsError", message);
  }
}

export class ParameterNotFound extends ServiceError {
  public constructor(message = "The parameter was not found.") {
    super("ParameterNotFound", message);
  }
}

export const unsupported = (message: string, res: Response, logger: Logger) => {
  logger.error(`SSM Local unsupported feature: ${message}`);
  return res.status(500).json({
    code: "SSMLocal#Unsupported",
    message: `SSM Local unsupported feature: ${message}`,
  });
};
