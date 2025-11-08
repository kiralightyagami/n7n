import { requireAuth } from "@/lib/auth-utils";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary} from "react-error-boundary";
import { Suspense } from "react";
import { WorkflowsContainer, WorkflowsList } from "@/features/workflows/components/workflows";

const Page = async () => {
    await requireAuth();
    prefetchWorkflows();
    
    return (
    <WorkflowsContainer>
        <HydrateClient>
            <ErrorBoundary fallback={<p>Error loading workflows</p>} >
                    <Suspense fallback={<p>Loading workflows...</p>} >
                        <WorkflowsList />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
    </WorkflowsContainer>
    )
}

export default Page;