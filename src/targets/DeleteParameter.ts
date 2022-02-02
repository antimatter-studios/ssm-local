import {
  DeleteParameterRequest,
  DeleteParameterResult,
} from "aws-sdk/clients/ssm";
import { ResourceNotFoundError } from "../errors";
import { Services } from "../services";
import { Target } from "./router";

export type DeleteParameterTarget = Target<DeleteParameterRequest, DeleteParameterResult>;

export const DeleteParameter =
  ({ ssm }: Pick<Services, "ssm">): DeleteParameterTarget =>
  async (ctx, req) => {
    ctx.logger.debug({Name: req.Name}, "DeleteParameter");

    return await Promise.resolve({});
  };
