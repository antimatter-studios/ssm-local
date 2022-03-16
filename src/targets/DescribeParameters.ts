import {
  DescribeParametersRequest,
  DescribeParametersResult,
  ParameterMetadata,
} from "aws-sdk/clients/ssm";
import { Services } from "../services";
import { SsmParameterInterface } from "../services/SsmService";
import { Target } from "./Target";
import { ResourceNotFoundError } from "../errors/ResourceNotFoundError";

export type DescribeParametersTarget = Target<
  DescribeParametersRequest,
  DescribeParametersResult
>;

export const DescribeParameters =
  ({ ssm }: Pick<Services, "ssm">): DescribeParametersTarget =>
  async (ctx, req) => {
    console.log({ req });
    const all = await ssm.all(ctx);

    if (!all) {
      throw new ResourceNotFoundError();
    }

    const metadata = all.map<ParameterMetadata>(
      (value: SsmParameterInterface) => value.Metadata
    );

    ctx.logger.debug({ all });
    ctx.logger.debug({ metadata });

    return await Promise.resolve({
      Parameters: metadata,
      //NextToken: null,
    });
  };
