"use client";
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-views";
import { useSuspenseExecutions } from "../hooks/use-executions";
import { useExecutionsParams } from "../hooks/use-executions-params";
import { formatDistanceToNow } from "date-fns";
import { ExecutionStatus } from "@/generated/prisma/enums";
import { Execution } from "@/generated/prisma/client";
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react";


export const ExecutionsList = () => {
    const executions  = useSuspenseExecutions();

    return(
        <EntityList
        items={executions.data.items}
        renderItem={(execution) => (
            <ExecutionsItem data={execution} />
        )}
        getKey={(execution) => execution.id}
        emptyView={<ExecutionsEmpty />}
        />
    )
};


export const ExecutionsHeader = () => {   
    return (
        <EntityHeader
        title="Executions"
        description="View your workflow executions"
        />
    );
};


export const ExecutionsPagination = () => {
    const executions = useSuspenseExecutions();
    const [params, setParams] = useExecutionsParams();


    return (
        <EntityPagination
         disabled={executions.isFetching}
         totalPages={executions.data.totalPages}
         page={executions.data.page}
         onPageChange={(page) => setParams({ ...params, page })}
        />
    );
};


export const ExecutionsContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <EntityContainer 
            header={<ExecutionsHeader />}
            pagination={<ExecutionsPagination />}
        >
            {children}
        </EntityContainer>
    )
};


export const ExecutionsLoading = () => {
     return <LoadingView message="Loading executions..."/>
};

export const ExecutionsError = () => {
    return <ErrorView message="Error loading executions"/>
};

export const ExecutionsEmpty = () => {
    return (
          <EmptyView 
          message="you haven't created any executions yet. Get started by creating a new execution and running it."/>
    );
};


const getStatusIcon = (status: ExecutionStatus) => {
    switch (status) {
        case ExecutionStatus.RUNNING:
            return <Loader2Icon className="size-5 text-blue-600 animate-spin" />;
        case ExecutionStatus.SUCCESS:
            return <CheckCircle2Icon className="size-5 text-green-600" />;
        case ExecutionStatus.FAILED:
            return <XCircleIcon className="size-5 text-red-600" />;
        default:
            return <ClockIcon className="size-5 text-yellow-600" />;
    }
}

const formatStatus = (status: ExecutionStatus) => {
    return status.charAt(0) + status.slice(1).toLocaleLowerCase();
}

export const ExecutionsItem = ({
    data,
}: {
    data:Execution & { workflow: {
        id: string;
        name: string;
    }}
}) => {

  const duration = data.completedAt
  ? Math.round(
    (new Date(data.completedAt).getTime() - new Date(data.startedAt).getTime()) / 1000,
  ) : null ;

  const subtitle = (
    <>
      {data.workflow.name} &bull; Started{" "}
      {formatDistanceToNow(data.startedAt, { addSuffix: true })}
      {duration !== null && <> &bull; Took {duration}s </>}
    </>
  );

  return (
    <EntityItem
    href={`/executions/${data.id}`}
    title={formatStatus(data.status)}
    subtitle={subtitle}
    image={
        <div className="size-8 flex items-center justify-center">
            {getStatusIcon(data.status)}
        </div>
    }
    />
  )
};