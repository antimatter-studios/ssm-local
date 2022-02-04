import { PutParameterRequest, PutParameterResult } from "aws-sdk/clients/ssm";
import {
  ParameterAlreadyExistsError,
  ResourceNotFoundError,
  ValidationError,
} from "../errors";
import { Clock, Services } from "../services";
import {
  SsmServiceInterface,
  SsmParameterInterface,
} from "../services/SsmService";
import { Context, Target } from "../server/Router";

export type PutParameterTarget = Target<
  PutParameterRequest,
  PutParameterResult
>;

async function createParameter(
  ssm: SsmServiceInterface,
  clock: Clock,
  ctx: Context,
  req: PutParameterRequest
): Promise<PutParameterResult> {
  if (!req.Type) {
    throw new ValidationError(
      "A parameter type is required when you create a parameter."
    );
  }

  const newParameter: SsmParameterInterface = {
    Value: req.Value,
    Metadata: {
      Name: req.Name,
      Type: req.Type,
      //KeyId: "TODO",
      LastModifiedDate: clock.get(),
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
  const result = await ssm.put(ctx, req.Name, newParameter);

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
  clock: Clock,
  ctx: Context,
  req: PutParameterRequest,
  param: SsmParameterInterface
): Promise<PutParameterResult> {
  // Overwrite was not set, so throw exception
  if (!req.Overwrite) {
    throw new ParameterAlreadyExistsError();
  }

  param.Value = req.Value;
  param.Metadata.LastModifiedDate = clock.get();

  if (param.Metadata.Version) {
    param.Metadata.Version = param.Metadata.Version + 1;
  } else {
    param.Metadata.Version = 1;
  }

  const result = await ssm.put(ctx, req.Name, param);

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
    if (existingParameter) {
      return updateParameter(ssm, clock, ctx, req, existingParameter);
    } else {
      return createParameter(ssm, clock, ctx, req);
    }
  };
