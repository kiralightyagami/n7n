import { prefetch, trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";


type Input = inferInput<typeof trpc.executions.getAll>;


export const prefetchExecutions = (params: Input) => {
    return prefetch(trpc.executions.getAll.queryOptions(params));
};

export const prefetchExecution = (id: string) => {
    return prefetch(trpc.executions.getOne.queryOptions({ id }));
};