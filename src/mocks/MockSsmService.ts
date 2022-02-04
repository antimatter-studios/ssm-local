import { SsmServiceInterface } from "../services";

export const MockSsmService = (): jest.Mocked<SsmServiceInterface> => ({
  all: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  describe: jest.fn(),
  delete: jest.fn(),
});
