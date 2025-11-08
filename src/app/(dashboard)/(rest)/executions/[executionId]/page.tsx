import { requireAuth } from "@/lib/auth-utils";


interface PageProps {
    params: Promise<{
        executionId: string;
    }>
}



const Page = async ({ params }: PageProps) => {
    const { executionId } = await params;
    await requireAuth();
    return (
        <div>
            <h1>ExecutionId: {executionId}</h1>
        </div>
    )
}

export default Page;