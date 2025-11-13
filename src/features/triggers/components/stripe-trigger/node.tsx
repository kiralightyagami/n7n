"use client";
import { memo, useState } from "react";
import { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "../base-trigger-node";
import { StripeTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { STRIPE_TRIGGER_CHANNEL } from "@/ingest/channels/stripe-trigger";
import { fetchStripeTriggerRealtimeToken } from "./actions";

export const StripeTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: STRIPE_TRIGGER_CHANNEL,
    topic: "status",
    refreshToken: fetchStripeTriggerRealtimeToken,
  });

  const handleSettings = () => {
    setOpen(true);
  }
  return(
    <>
    <StripeTriggerDialog open={open} onOpenChange={setOpen} />
     <BaseTriggerNode
     {...props}
     icon="/icons/stripe.svg"
     name= "Stripe"
     description= "When a new payment is made"
     status={nodeStatus}
     onSettings={handleSettings}
     onDoubleClick={handleSettings}
     />
    </>
  )
});