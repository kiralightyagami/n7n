import { type NextRequest, NextResponse } from "next/server";
import { sendWorkflowExecutionEvent } from "@/ingest/utils";

export async function POST(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const workflowId = url.searchParams.get("workflowId");
        
        if (!workflowId) {
            return NextResponse.json({ success: false, error: "Workflow ID is required" }, { status: 400 });
        };

        const body = await request.json();

        const stripeData = {
            eventId: body.id,
            eventType: body.type,
            timestamp: body.created,
            livemode: body.livemode,
            raw: body.data?.object,
        };

        await sendWorkflowExecutionEvent({
            workflowId,
            intialData: {
                stripe: stripeData,
            },
        });
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Stripe webhook error:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}