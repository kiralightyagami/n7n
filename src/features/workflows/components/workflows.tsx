"use client";
import { EmptyView, EntityContainer, EntityHeader, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-views";
import { useCreateWorkflows, useSuspenseWorkflows } from "../hooks/use-workflows";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";


export const WorkflowsSearch = () => {
const [params, setParams] = useWorkflowsParams();
const { searchValue, onSearchChange } = useEntitySearch({ params, setParams });
    return (
        <EntitySearch
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Search workflows"
        />
    );
}




export const WorkflowsList = () => {
    const { data: workflows } = useSuspenseWorkflows();

    if (workflows.items.length === 0) {
        return <WorkflowsEmpty />;
    }

    return (
        <div className="flex-1 flex justify-center items-center">
            {JSON.stringify(workflows, null, 2)}
        </div>
    );
}


export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
    const  createWorkflow  = useCreateWorkflows();
    const router = useRouter();
    const handleNewWorkflow = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`);
            },
            onError: (error) => {
                toast.error(`Failed to create workflow: ${error.message}`);
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


export const WorkflowsPagination = () => {
    const workflows = useSuspenseWorkflows();
    const [params, setParams] = useWorkflowsParams();


    return (
        <EntityPagination
         disabled={workflows.isFetching}
         totalPages={workflows.data.totalPages}
         page={workflows.data.page}
         onPageChange={(page) => setParams({ ...params, page })}
        />
    );
};


export const WorkflowsContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <EntityContainer 
            header={<WorkflowsHeader />}
            search={<WorkflowsSearch />}
            pagination={<WorkflowsPagination />}
        >
            {children}
        </EntityContainer>
    )
};


export const WorkflowsLoading = () => {
     return <LoadingView message="Loading workflows..."/>
}

export const WorkflowsError = () => {
    return <ErrorView message="Error loading workflows"/>
}

export const WorkflowsEmpty = () => {
    const createWorkflow = useCreateWorkflows();
    
    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onError: (error) => {
                toast.error(`Failed to create workflow: ${error.message}`);
            },
        })
    }
    
    return (
        <>
          <EmptyView 
          onNew={handleCreate}
          message="you haven't created any workflows yet. Get started by creating a new workflow."/>
        </>
    );
};