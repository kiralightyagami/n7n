import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";


export const useSuspenseWorkflows = () => {
    const trpc = useTRPC();
    const [params] = useWorkflowsParams();
    return useSuspenseQuery(trpc.workflows.getAll.queryOptions(params));
};



export const useCreateWorkflows = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation(trpc.workflows.create.mutationOptions({
        onSuccess: (data) => {
            toast.success(`Workflow ${data.name} created successfully`);
            router.push(`/workflows/${data.id}`);
            queryClient.invalidateQueries(trpc.workflows.getAll.queryOptions({}));
        },
        onError: (error) => {
            toast.error(`Failed to create workflow: ${error.message}`);
        },
    }))
};