"use client";
import { EntityContainer, EntityHeader } from "@/components/entity-views";
import { useSuspenseWorkflows } from "../hooks/use-workflows";

export const WorkflowsList = () => {
    const { data: workflows } = useSuspenseWorkflows();

    return (
        <div className="flex flex-col gap-4">
            {workflows.map((workflow) => (
                <div key={workflow.id}>{workflow.name}</div>
            ))}
        </div>
    );
}


export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {

    return (
        <>
        <EntityHeader
        title="Workflows"
        description="Manage your workflows"
        onNew={() => {}}
        newButtonLabel="New Workflow"
        disabled={disabled}
        isCreating={false}
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