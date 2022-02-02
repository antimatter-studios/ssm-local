import { Context } from "../services/context";
import { DataStoreFactory } from "../services/dataStore/factory";
import mergeWith from "lodash.mergewith";

export interface Config {
  path: string;
}
export const DefaultConfig: Config = {
  path: 'data',
};

export const loadConfig = async (
  ctx: Context,
  dataStoreFactory: DataStoreFactory
): Promise<Config> => {
  ctx.logger.debug("loadConfig");
  const dataStore = await dataStoreFactory.create(ctx, "config", {});

  const config = await dataStore.getRoot<Config>(ctx);

  return mergeWith(
    {},
    DefaultConfig,
    config ?? {},
    function customizer(objValue, srcValue) {
      if (Array.isArray(srcValue)) {
        return srcValue;
      }
    }
  );
};
