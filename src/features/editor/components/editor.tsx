"use client";

import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import { ErrorView, LoadingView } from "@/components/entity-views";



export const EditorLoading = () => {
    return <LoadingView message="Loading workflow..." />;
}

export const EditorError = () => {
    return <ErrorView message="Error loading workflow" />;
}

export const Editor = ({ workflowId }: { workflowId: string }) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId);
    return (
        <p>
            {JSON.stringify(workflow, null, 2)}
        </p>
    );
};