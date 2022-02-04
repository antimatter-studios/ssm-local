import { SsmServiceInterface } from "../services";
import { DataStore } from "../services/dataStore/dataStore";
import { MockDataStore } from "./MockDataStore";

export const MockSsmService = (
  dataStore: DataStore = MockDataStore()
): jest.Mocked<SsmServiceInterface> => ({
  all: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  describe: jest.fn(),
  delete: jest.fn(),
});
