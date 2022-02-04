import {
  ListTagsForResourceRequest,
  ListTagsForResourceResult,
} from "aws-sdk/clients/ssm";
import { ResourceNotFoundError } from "../errors";
import { Services } from "../services";
import { Target } from "../server/Router";

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
