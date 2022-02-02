import { Logger } from "../log";
import { Services } from "../services";
import { UnsupportedError } from "../errors";
import { PutParameter } from "./PutParameter";
import { GetParameter } from "./GetParameter";
import { GetParameters } from "./GetParameters";
import { DeleteParameter } from "./DeleteParameter";
import { DeleteParameters } from "./DeleteParameters";
import { DescribeParameters } from "./DescribeParameters";
import { ListTagsForResource } from "./listTagsForResource";

export const Targets = {
  PutParameter,
  GetParameter,
  GetParameters,
  DeleteParameter,
  DeleteParameters,
  DescribeParameters,
  ListTagsForResource,
} as const;

type TargetName = keyof typeof Targets;

export type Context = { readonly logger: Logger };
export type Target<Req extends {}, Res extends {}> = (
  ctx: Context,
  req: Req
) => Promise<Res>;

export const isSupportedTarget = (name: string): name is TargetName =>
  Object.keys(Targets).includes(name);

// eslint-disable-next-line
export type Route = (ctx: Context, req: any) => Promise<any>;
export type Router = (target: string) => Route;

export const Router =
  (services: Services): Router =>
  (target: string) => {
    if (!isSupportedTarget(target)) {
      return () =>
        Promise.reject(
          new UnsupportedError(`Unsupported x-amz-target header "${target}"`)
        );
    }

    const t = Targets[target](services);

    return async (ctx, req) => {
      const targetLogger = ctx.logger.child({
        target,
      });

      targetLogger.debug("start");
      const res = await t(
        {
          ...ctx,
          logger: targetLogger,
        },
        req
      );
      targetLogger.debug("end");
      return res;
    };
  };
