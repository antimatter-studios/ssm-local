import {
  ListTagsForResourceRequest,
  ListTagsForResourceResult,
} from "aws-sdk/clients/ssm";
import { Target } from "./Target";
import { ResourceNotFoundError } from "../errors/ResourceNotFoundError";

export type ListTagsForResourceTarget = Target<
  ListTagsForResourceRequest,
  ListTagsForResourceResult
>;

export const ListTagsForResource =
  (): ListTagsForResourceTarget => async (ctx, req) => {
    ctx.logger.debug({ req });
    const result = await Promise.resolve([]);

    if (!result) {
      throw new ResourceNotFoundError("Could not save parameter");
    }

    return {
      TagList: [],
    };
  };
