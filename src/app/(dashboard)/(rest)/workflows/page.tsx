import { requireAuth } from "@/lib/auth-utils";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary} from "react-error-boundary";
import { Suspense } from "react";
import { WorkflowsContainer, WorkflowsList } from "@/features/workflows/components/workflows";
import type { SearchParams } from "nuqs";
import { workflowsParamsLoader } from "@/features/workflows/server/params-loader";


type Props = {
    searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {
    const params = await workflowsParamsLoader(searchParams);
    await requireAuth();
    prefetchWorkflows(params);
    
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