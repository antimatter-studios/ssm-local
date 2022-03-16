import {
  GetParametersByPathRequest,
  GetParametersByPathResult,
} from "aws-sdk/clients/ssm";
import { Services } from "../services";
import { Target } from "./Target";

export type GetParametersByPathTarget = Target<
  GetParametersByPathRequest,
  GetParametersByPathResult
>;

export const GetParametersByPath =
  ({ ssm }: Pick<Services, "ssm">): GetParametersByPathTarget =>
  async (ctx, req) => {
    ctx.logger.debug("something", { req });

    //req.Recursive;
    const result = await ssm.getByPath(ctx, req.Path, req.Recursive);

    console.dir({ result }, { depth: null });

    const region = "eu-west-1";
    const account_id = "112233445566";

    return await Promise.resolve({
      Parameters: result.map((r) => ({
        Name: r.Metadata.Name,
        Type: r.Metadata.Type,
        Value: r.Value,
        Version: r.Metadata.Version,
        LastModifiedDate: r.Metadata.LastModifiedDate,
        ARN: `arn:aws:ssm:${region}:${account_id}:parameter${r.Metadata.Name}`,
        DataType: r.Metadata.DataType,
      })),
    });
  };
