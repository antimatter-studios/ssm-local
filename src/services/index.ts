import { Config } from "../server/config";
import { Clock } from "./clock";
import { SsmServiceInterface } from "./SsmService";

export { Clock, DateClock } from "./clock";
export { SsmServiceInterface, SsmService } from "./SsmService";

export interface Services {
  clock: Clock;
  config: Config;
  ssm: SsmServiceInterface;
}
