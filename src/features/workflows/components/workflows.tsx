"use client";
import { EntityContainer, EntityHeader } from "@/components/entity-views";
import { useCreateWorkflows, useSuspenseWorkflows } from "../hooks/use-workflows";
import { toast } from "sonner";

export const WorkflowsList = () => {
    const { data: workflows } = useSuspenseWorkflows();

    return (
        <div className="flex-1 flex justify-center items-center">
            {JSON.stringify(workflows, null, 2)}
        </div>
    );
}


export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
    const  createWorkflow  = useCreateWorkflows();

    const handleNewWorkflow = () => {
        createWorkflow.mutate(undefined, {
            onError: (error) => {
                console.error(error);
            },    
        });
    }
    return (
        <>
        <EntityHeader
        title="Workflows"
        description="Manage your workflows"
        onNew={handleNewWorkflow}
        newButtonLabel="New Workflow"
        disabled={disabled}
        isCreating={createWorkflow.isPending}
        />
        </>
    );
};


export const WorkflowsContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <EntityContainer 
            header={<WorkflowsHeader />}
            search={<></>}
            pagination={<></>}
        >
            {children}
        </EntityContainer>
    )
}