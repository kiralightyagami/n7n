"use client";
import { memo, useState } from "react";
import { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "../base-trigger-node";
import { GoogleFormTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { GOOGLE_FORM_TRIGGER_CHANNEL } from "@/ingest/channels/google-form-trigger";
import { fetchGoogleFormTriggerRealtimeToken } from "./actions";

export const GoogleFormTrigger = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: GOOGLE_FORM_TRIGGER_CHANNEL,
    topic: "status",
    refreshToken: fetchGoogleFormTriggerRealtimeToken,
  });

  const handleSettings = () => {
    setOpen(true);
  }
  return(
    <>
    <GoogleFormTriggerDialog open={open} onOpenChange={setOpen} />
     <BaseTriggerNode
     {...props}
     icon="/icons/google-form.svg"
     name= "Google Form"
     description= "When a new form is submitted"
     status={nodeStatus}
     onSettings={handleSettings}
     onDoubleClick={handleSettings}
     />
    </>
  )
});