import { LogService } from "../services/LogService";
import { Services } from "../services";
import { Targets, isSupportedTarget } from "../targets/Target";
import { UnsupportedError } from "../errors/UnsupportedError";

export type Context = { readonly logger: LogService };

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
