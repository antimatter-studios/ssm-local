import {
  ListTagsForResourceRequest,
  ListTagsForResourceResult,
} from "aws-sdk/clients/ssm";
import { Services } from "../services";
import { Target } from "../server/Router";
import { ResourceNotFoundError } from "../errors/ResourceNotFoundError";

export type ListTagsForResourceTarget = Target<
  ListTagsForResourceRequest,
  ListTagsForResourceResult
>;

export const ListTagsForResource =
  ({
    ssm,
    clock,
  }: Pick<Services, "ssm" | "clock">): ListTagsForResourceTarget =>
  async (ctx, req) => {
    ctx.logger.debug({ req });
    const result = await Promise.resolve([]);

    if (!result) {
      throw new ResourceNotFoundError("Could not save parameter");
    }

    return {
      TagList: [],
    };
  };
