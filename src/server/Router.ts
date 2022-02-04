import { LogService } from "../services/LogService";
import { Services } from "../services";
import { PutParameter } from "../targets/PutParameter";
import { GetParameter } from "../targets/GetParameter";
import { GetParameters } from "../targets/GetParameters";
import { DeleteParameter } from "../targets/DeleteParameter";
import { DeleteParameters } from "../targets/DeleteParameters";
import { DescribeParameters } from "../targets/DescribeParameters";
import { ListTagsForResource } from "../targets/ListTagsForResource";
import { UnsupportedError } from "../errors/UnsupportedError";

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

export type Context = { readonly logger: LogService };
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
