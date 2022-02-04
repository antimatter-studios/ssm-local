import { PutParameter, PutParameterTarget } from "./PutParameter";
import { MockClock } from "../mocks/MockClock";
import { MockContext } from "../mocks/MockContext";
import { MockSsmService } from "../mocks/MockSsmService";
import { MockSsmMetadata, MockSsmParameter } from "../mocks/MockSsmParameter";
import { ParameterAlreadyExistsError } from "../errors/ParameterAlreadyExistsError";

describe("PutParameter Target", () => {
  let handler: PutParameterTarget;
  const currentDate = new Date();
  const clock = new MockClock(currentDate);
  const ssm = MockSsmService();

  beforeEach(() => {
    handler = PutParameter({
      ssm,
      clock,
    });
  });

  it("succeeds to creates a new parameter", async () => {
    const parameter = MockSsmParameter();

    ssm.put.mockResolvedValue(parameter);

    const result = await handler(MockContext, {
      Name: parameter.Metadata.Name as string,
      Value: parameter.Value,
      Type: parameter.Metadata.Type,
    });

    expect(result).toEqual({
      Version: 1.0,
      Tier: "STANDARD",
    });
  });

  it("fails to create a parameter that already exists with no overwrite flag", async () => {
    const parameter = MockSsmParameter();
    ssm.get.mockResolvedValue(parameter);

    await expect(
      handler(MockContext, {
        Name: parameter.Metadata.Name as string,
        Value: parameter.Value,
        Type: parameter.Metadata.Type,
      })
    ).rejects.toEqual(new ParameterAlreadyExistsError());
  });

  it("succeeds to create a parameter that already exists with overwrite flag set", async () => {
    const existingParameter = MockSsmParameter();
    const compareMetaData = { Version: 10.1, Tier: "TESTING_METADATA_TIER" };
    const updatedParameter = MockSsmParameter({
      Metadata: MockSsmMetadata(compareMetaData),
    });

    ssm.get.mockResolvedValue(existingParameter);
    ssm.put.mockResolvedValue(updatedParameter);

    const result = await handler(MockContext, {
      Name: existingParameter.Metadata.Name as string,
      Value: existingParameter.Value,
      Type: existingParameter.Metadata.Type,
      Overwrite: true,
    });

    expect(result).toEqual(compareMetaData);
  });
});
