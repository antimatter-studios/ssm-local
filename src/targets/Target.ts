import { Context } from "../services/context";

import { PutParameter } from "./PutParameter";
import { GetParameter } from "./GetParameter";
import { GetParameters } from "./GetParameters";
import { GetParametersByPath } from "./GetParametersByPath";
import { DeleteParameter } from "./DeleteParameter";
import { DeleteParameters } from "./DeleteParameters";
import { DescribeParameters } from "./DescribeParameters";
import { ListTagsForResource } from "./ListTagsForResource";

export const Targets = {
  PutParameter,
  GetParameter,
  GetParameters,
  GetParametersByPath,
  DeleteParameter,
  DeleteParameters,
  DescribeParameters,
  ListTagsForResource,
} as const;

type TargetName = keyof typeof Targets;

export type Target<Req extends {}, Res extends {}> = (
  ctx: Context,
  req: Req
) => Promise<Res>;

export const isSupportedTarget = (name: string): name is TargetName =>
  Object.keys(Targets).includes(name);
