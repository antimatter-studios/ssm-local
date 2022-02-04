import { Context } from "../services/context";
import { MockLogger } from "./mockLogger";

export const MockContext: Context = {
  logger: MockLogger,
};
