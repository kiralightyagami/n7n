import { prefetch, trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";


type Input = inferInput<typeof trpc.credentials.getAll>;


export const prefetchCredentials = (params: Input) => {
    return prefetch(trpc.credentials.getAll.queryOptions(params));
};

export const prefetchCredential = (id: string) => {
    return prefetch(trpc.credentials.getOne.queryOptions({ id }));
};