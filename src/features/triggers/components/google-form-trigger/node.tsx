"use client";
import { memo, useState } from "react";
import { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { MANUAL_TRIGGER_CHANNEL } from "@/ingest/channels/manual-trigger";
import { fetchManualTriggerRealtimeToken } from "./actions";

export const GoogleFormTrigger = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);

  const nodeStatus = "initial";

  const handleSettings = () => {
    setOpen(true);
  }
  return(
    <>
    <ManualTriggerDialog open={open} onOpenChange={setOpen} />
     <BaseTriggerNode
     {...props}
     icon="/icons/google-form.svg"
     name= "When a new form is submitted"
     status={nodeStatus}
     onSettings={handleSettings}
     onDoubleClick={handleSettings}
     />
    </>
  )
});