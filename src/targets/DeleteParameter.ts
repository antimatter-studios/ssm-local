import {
  DeleteParameterRequest,
  DeleteParameterResult,
} from "aws-sdk/clients/ssm";
import { ParameterNotFound } from "../errors";
import { Services } from "../services";
import { Target } from "../server/Router";

export type DeleteParameterTarget = Target<
  DeleteParameterRequest,
  DeleteParameterResult
>;

export const DeleteParameter =
  ({ ssm }: Pick<Services, "ssm">): DeleteParameterTarget =>
  async (ctx, req) => {
    ctx.logger.debug({ Name: req.Name }, "DeleteParameter");

    const param = await ssm.get(ctx, req.Name);

    if (!param) {
      throw new ParameterNotFound();
    }

    const success = await ssm.delete(ctx, req.Name);

    if (!success) {
      ctx.logger.error(
        `The parameter '${req.Name}' has failed to delete from the database`
      );
    }

    return {};
  };
