import {
  DeleteParametersRequest,
  DeleteParametersResult,
} from "aws-sdk/clients/ssm";
import { Services } from "../services";
import { Target } from "./Target";

export type DeleteParametersTarget = Target<
  DeleteParametersRequest,
  DeleteParametersResult
>;

export const DeleteParameters =
  ({ ssm }: Pick<Services, "ssm">): DeleteParametersTarget =>
  async (ctx, req) => {
    ctx.logger.debug({ Name: req.Names }, "DeleteParameters");

    const results: DeleteParametersResult = {
      DeletedParameters: [],
      InvalidParameters: [],
    };

    await Promise.all(
      req.Names.map(async (name) => {
        const success = ssm.delete(ctx, name);

        if ((await Promise.resolve(success)) === true) {
          results?.DeletedParameters?.push(name);
        } else {
          results?.InvalidParameters?.push(name);
        }

        return success;
      })
    );

    return results;
  };
