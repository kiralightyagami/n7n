import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";
import { workflowsParams } from "../params";

export const workflowsParamsLoader = createLoader(workflowsParams);