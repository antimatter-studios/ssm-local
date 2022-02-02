import pino from "pino";
import { DateClock } from "../services";
import { InMemoryCache } from "../services/dataStore/cache";
import { StormDBDataStoreFactory } from "../services/dataStore/stormDb";
import { SsmService } from "../services/SsmService";
import { Router } from "../targets/router";
import { loadConfig } from "./config";
import { createServer, Server } from "./server";

export const createDefaultServer = async (
  logger: pino.Logger
): Promise<Server> => {
  const ctx = {
    logger,
  };

  const configDirectory = "data";
  const dataDirectory = configDirectory;

  const config = await loadConfig(
    ctx,
    // the config gets a separate factory because it's stored in a different directory
    new StormDBDataStoreFactory(configDirectory, new InMemoryCache())
  );

  logger.debug({ config }, "Loaded config");

  const clock = new DateClock();

  const dataStoreFactory = new StormDBDataStoreFactory(
    dataDirectory,
    new InMemoryCache()
  );

  let ssmDataStore = await dataStoreFactory.get(ctx, 'ssm');
  if(!ssmDataStore) ssmDataStore = await dataStoreFactory.create(ctx, 'ssm', {});

  const ssm = new SsmService(ssmDataStore);

  return createServer(
    Router({
      clock,
      config,
      ssm,
    }),
    logger,
    {
      development: !!process.env.DEVMODE,
    }
  );
};
