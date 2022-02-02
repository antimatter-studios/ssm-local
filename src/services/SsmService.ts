import { ParameterMetadata, TagList } from "aws-sdk/clients/ssm";
import { Context } from "./context";
import { DataStore } from "./dataStore/dataStore";

export interface SsmParameterInterface {
  Value: string;
  Metadata: ParameterMetadata;
  TagList: TagList;
}

export interface SsmServiceInterface {
  all(ctx: Context): Promise<SsmParameterInterface[]>;
  get(ctx: Context, key: string): Promise<SsmParameterInterface | null>;
  put(
    ctx: Context,
    key: string,
    value: SsmParameterInterface
  ): Promise<SsmParameterInterface | null>;
  describe(ctx: Context, key: string): Promise<SsmParameterInterface | null>;
  delete(ctx: Context, key: string): Promise<boolean>;
}

export class SsmService implements SsmServiceInterface {
  private dataStore: DataStore;

  public constructor(dataStore: DataStore) {
    this.dataStore = dataStore;
  }

  public async all(ctx: Context): Promise<SsmParameterInterface[]> {
    ctx.logger.debug("SsmService.all");

    const values = await this.dataStore.getRoot<object>(ctx);

    if (!values) {
      throw new Error("Datastore has no root element");
    }

    return Object.values(values);
  }

  public async get(
    ctx: Context,
    key: string
  ): Promise<SsmParameterInterface | null> {
    ctx.logger.debug("SsmService.get");

    return await this.dataStore.get<SsmParameterInterface>(ctx, key);
  }

  public async put(
    ctx: Context,
    key: string,
    value: SsmParameterInterface
  ): Promise<SsmParameterInterface | null> {
    ctx.logger.debug("SsmService.put");
    console.log({ value });

    await this.dataStore.set<SsmParameterInterface>(ctx, key, value);

    return await this.get(ctx, key);
  }

  public async describe(
    ctx: Context,
    key: string
  ): Promise<SsmParameterInterface | null> {
    ctx.logger.debug("SsmService.describe");

    try {
      const values = await this.get(ctx, key);
      console.log({ values });

      // TODO: I don't know what I should do here
      // TODO: return SsmParameterInterface|SsmParameterInterface[]

      return null;
    } catch {
      return null;
    }
  }

  public async delete(ctx: Context, key: string): Promise<boolean> {
    ctx.logger.debug("SsmService.delete");

    try {
      if ((await Promise.resolve(this.get(ctx, key))) !== null) {
        await this.dataStore.delete(ctx, key);

        return (await this.dataStore.get(ctx, key)) !== null;
      }
    } catch {
      // do nothing
    }

    return false;
  }
}
