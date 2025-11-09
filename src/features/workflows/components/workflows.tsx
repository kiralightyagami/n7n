"use client";
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-views";
import { useCreateWorkflows, useRemoveWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { WorkflowModel as Workflow } from "@/generated/prisma/models";   
import { WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";


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
    const workflows  = useSuspenseWorkflows();

    return(
        <EntityList
        items={workflows.data.items}
        renderItem={(workflow) => (
            <WorkflowsItem data={workflow} />
        )}
        getKey={(workflow) => workflow.id}
        emptyView={<WorkflowsEmpty />}
        />
    )
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
    const router = useRouter();
    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onError: (error) => {
                toast.error(`Failed to create workflow: ${error.message}`);
            },
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`);
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


export const WorkflowsItem = ({
    data,
}: {
    data:Workflow
}) => {

  const removeWorkflow = useRemoveWorkflow();


  const handleRemove = () => {
    removeWorkflow.mutate({ id: data.id });
  };

  return (
    <EntityItem
    href={`/workflows/${data.id}`}
    title={data.name}
    subtitle={
    <>
      Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
      &bull; Created
      {formatDistanceToNow(data.createdAt, { addSuffix: true })}
    </>}
    image={
        <div className="size-8 flex items-center justify-center">
            <WorkflowIcon className="size-5 text-muted-foreground" />
        </div>
    }
    onRemove={handleRemove}
    isRemoving={removeWorkflow.isPending}
    />
  )
}