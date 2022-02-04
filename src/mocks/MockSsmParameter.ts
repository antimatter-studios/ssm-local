import { ParameterMetadata } from "aws-sdk/clients/ssm";
import { SsmParameterInterface } from "../services/SsmService";

export const MockSsmMetadata = (
  partial?: Partial<ParameterMetadata>
): ParameterMetadata => ({
  Name: partial?.Name ?? "mock-name",
  Type: partial?.Type ?? "String",
  KeyId: partial?.KeyId ?? undefined,
  LastModifiedDate: partial?.LastModifiedDate ?? new Date(),
  LastModifiedUser: partial?.LastModifiedUser ?? "mock-user",
  Description: partial?.Description ?? "mock-description",
  AllowedPattern: partial?.AllowedPattern ?? undefined,
  Version: partial?.Version ?? 1.0,
  Tier: partial?.Tier ?? "STANDARD",
  Policies: partial?.Policies ?? [],
  DataType: partial?.DataType ?? "text",
});

export const MockSsmParameter = (
  partial?: Partial<SsmParameterInterface>
): SsmParameterInterface => ({
  Value: partial?.Value ?? "mock-value",
  Metadata: partial?.Metadata ?? MockSsmMetadata(),
  TagList: partial?.TagList ?? [],
});
