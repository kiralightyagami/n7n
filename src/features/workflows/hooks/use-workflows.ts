import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export const useSuspenseWorkflows = () => {
    const trpc = useTRPC();

    return useSuspenseQuery(trpc.workflows.getAll.queryOptions());
};



export const useCreateWorkflows = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation(trpc.workflows.create.mutationOptions({
        onSuccess: (data) => {
            toast.success(`Workflow ${data.name} created successfully`);
            router.push(`/workflows/${data.id}`);
            queryClient.invalidateQueries(trpc.workflows.getAll.queryOptions());
        },
        onError: (error) => {
            toast.error(`Failed to create workflow: ${error.message}`);
        },
    }))
};