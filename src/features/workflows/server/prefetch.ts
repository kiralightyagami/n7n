import { prefetch, trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";


type Input = inferInput<typeof trpc.workflows.getAll>;


export const prefetchWorkflows = (params: Input) => {
    prefetch(trpc.workflows.getAll.queryOptions(params));
};