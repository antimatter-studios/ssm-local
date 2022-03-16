import { PutParameterRequest, PutParameterResult } from "aws-sdk/clients/ssm";
import { Services } from "../services";
import {
  SsmServiceInterface,
  SsmParameterInterface,
} from "../services/SsmService";
import { Context } from "../services/context";
import { Target } from "./Target";
import { ValidationError } from "../errors/ValidationError";
import { ResourceNotFoundError } from "../errors/ResourceNotFoundError";
import { ParameterAlreadyExistsError } from "../errors/ParameterAlreadyExistsError";

export type PutParameterTarget = Target<
  PutParameterRequest,
  PutParameterResult
>;

async function createParameter(
  ssm: SsmServiceInterface,
  ctx: Context,
  Name: string,
  Value: string,
  Type: string | undefined,
  LastModifiedDate: Date
): Promise<PutParameterResult> {
  if (!Type) {
    throw new ValidationError(
      "A parameter type is required when you create a parameter."
    );
  }

  const newParameter: SsmParameterInterface = {
    Value,
    Metadata: {
      Name,
      Type,
      //KeyId: "TODO",
      LastModifiedDate,
      //LastModifiedUser: "TODO-the-arn",
      //Description: "TODO",
      //AllowedPattern: "TODO",
      Version: 1,
      Tier: "Standard",
      //Policies: [],
      DataType: "text",
    },
    TagList: [],
  };

  ctx.logger.debug({ newParameter });
  const result = await ssm.put(ctx, Name, newParameter);

  if (!result) {
    throw new ResourceNotFoundError("Could not save parameter");
  }

  return {
    Version: result?.Metadata.Version,
    Tier: result?.Metadata.Tier,
  };
}

async function updateParameter(
  ssm: SsmServiceInterface,
  ctx: Context,
  name: string,
  value: string,
  date: Date,
  overwrite: boolean | undefined,
  param: SsmParameterInterface
): Promise<PutParameterResult> {
  // Overwrite was not set, so throw exception
  if (!overwrite) {
    throw new ParameterAlreadyExistsError();
  }

  param.Value = value;
  param.Metadata.LastModifiedDate = date;

  if (param.Metadata.Version) {
    param.Metadata.Version = param.Metadata.Version + 1;
  } else {
    param.Metadata.Version = 1;
  }

  const result = await ssm.put(ctx, name, param);

  return {
    Version: result?.Metadata.Version,
    Tier: result?.Metadata.Tier,
  };
}

export const PutParameter =
  ({ ssm, clock }: Pick<Services, "ssm" | "clock">): PutParameterTarget =>
  async (ctx, req) => {
    // Check whether parameter exists first, if yes, try to update it
    const existingParameter = await ssm.get(ctx, req.Name);
    const now = clock.get();

    if (existingParameter) {
      return updateParameter(
        ssm,
        ctx,
        req.Name,
        req.Value,
        now,
        req.Overwrite,
        existingParameter
      );
    } else {
      return createParameter(ssm, ctx, req.Name, req.Value, req.Type, now);
    }
  };
