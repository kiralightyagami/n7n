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

        const formData = {
            formId: body.formId,
            formTitle: body.formTitle,
            responseId: body.responseId,
            timestamp: body.timestamp,
            respondentEmail: body.respondentEmail,
            responses: body.responses,
            raw: body,
        };

        await sendWorkflowExecutionEvent({
            workflowId,
            intialData: {
                googleForm: formData,
            },
        });
    } catch (error) {
        console.error("Google Form webhook error:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}