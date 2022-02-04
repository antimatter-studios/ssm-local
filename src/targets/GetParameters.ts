import {
  GetParametersRequest,
  GetParametersResult,
  Parameter,
} from "aws-sdk/clients/ssm";
import { ResourceNotFoundError } from "../errors";
import { Services } from "../services";
import { SsmParameterInterface } from "../services/SsmService";
import { Target } from "../server/Router";

export type GetParametersTarget = Target<
  GetParametersRequest,
  GetParametersResult
>;

export const GetParameters =
  ({ ssm }: Pick<Services, "ssm">): GetParametersTarget =>
  async (ctx, req) => {
    const names = req.Names;
    ctx.logger.debug({ Names: names });

    const results = await Promise.all(names.map((name) => ssm.get(ctx, name)));
    const filtered = results.filter(
      (item) => item !== null
    ) as SsmParameterInterface[];

    const Parameters = filtered.map<Parameter>(
      (param: SsmParameterInterface) => ({
        Name: param.Metadata.Name,
        Type: param.Metadata.Type,
        Value: param.Value,
        Version: param.Metadata.Version,
        LastModifiedDate: param.Metadata.LastModifiedDate,
        ARN: "eu-west-1::ssm::todo",
        DataType: param.Metadata.DataType,
      })
    );

    if (!Parameters || Parameters.length === 0) {
      throw new ResourceNotFoundError();
    }

    return {
      Parameters,
    };
  };

/*
  const entries = await readdir(this.dataDirectory, { withFileTypes: true });

    return Promise.all(
      entries
        .filter(
          (x) =>
            x.isFile() &&
            path.extname(x.name) === ".json" &&
            path.basename(x.name, path.extname(x.name)) !==
              CLIENTS_DATABASE_NAME
        )
        .map(async (x) => {
          const userPool = (await this.getUserPool(
            ctx,
            path.basename(x.name, path.extname(x.name))
          )) as UserPoolService;

          return userPool?.config;
        })
*/
