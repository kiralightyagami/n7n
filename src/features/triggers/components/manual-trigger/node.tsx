"use client";
import { memo, useState } from "react";
import { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
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
     icon={MousePointerIcon}
     name= "When clicking 'Execution workflow"
     status={nodeStatus}
     onSettings={handleSettings}
     onDoubleClick={handleSettings}
     />
    </>
  )
});