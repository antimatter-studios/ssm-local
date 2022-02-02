import {
  PutParameterRequest,
  PutParameterResult,
} from "aws-sdk/clients/ssm";
import { ResourceNotFoundError } from "../errors";
import { Services } from "../services";
import { SsmParameterInterface } from "../services/SsmService";
import { Target } from "./router";

export type PutParameterTarget = Target<PutParameterRequest, PutParameterResult>;

export const PutParameter =
  ({ ssm, clock }: Pick<Services, "ssm" | "clock">): PutParameterTarget =>
  async (ctx, req) => {
    const parameter: SsmParameterInterface = {
      Value: req.Value,
      Metadata: {
        Name: req.Name,
        Type: "String",
        //KeyId: "TODO",
        LastModifiedDate: clock.get(),
        //LastModifiedUser: "TODO-the-arn",
        //Description: "TODO",
        //AllowedPattern: "TODO",
        Version: 1,
        Tier: "Standard",
        //Policies: [],
        DataType: "text",
      },
      TagList: []
    }
    
    ctx.logger.debug({parameter});
    const result: SsmParameterInterface | null = await ssm.put(ctx, req.Name, parameter);

    if(!result){
      throw new ResourceNotFoundError("Could not save parameter");
    }

    return {
      Version: result.Metadata.Version,
      Tier: result.Metadata.Tier,
    };
  };
