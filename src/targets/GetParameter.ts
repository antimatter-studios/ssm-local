import { GetParameterRequest, GetParameterResult } from "aws-sdk/clients/ssm";
import { Services } from "../services";
import { Target } from "../server/Router";
import { ResourceNotFoundError } from "../errors/ResourceNotFoundError";

export type GetParameterTarget = Target<
  GetParameterRequest,
  GetParameterResult
>;

export const GetParameter =
  ({ ssm }: Pick<Services, "ssm">): GetParameterTarget =>
  async (ctx, req) => {
    ctx.logger.debug({ req });

    const result = await ssm.get(ctx, req.Name);

    if (!result) {
      throw new ResourceNotFoundError();
    }

    const region = "eu-west-1";
    const account_id = "112233445566";

    return await Promise.resolve({
      Parameter: {
        Name: result.Metadata.Name,
        Type: result.Metadata.Type,
        Value: result.Value,
        Version: result.Metadata.Version,
        LastModifiedDate: result.Metadata.LastModifiedDate,
        ARN: `arn:aws:ssm:${region}:${account_id}:parameter${result.Metadata.Name}`,
        DataType: result.Metadata.DataType,
      },
    });
  };
