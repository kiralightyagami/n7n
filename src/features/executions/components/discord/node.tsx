"use client"

import { useReactFlow, type Node, type NodeProps} from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { GeminiFormValues, GeminiDialog, GEMINI_AVAILABLE_MODELS } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchGeminiRealtimeToken } from "./actions";
import { GEMINI_CHANNEL } from "@/ingest/channels/gemini";

type GeminiNodeData = {
    variableName?: string;
    credentialId?: string;
    model?: typeof GEMINI_AVAILABLE_MODELS[number];
    systemPrompt?: string;
    userPrompt?: string;
};

type GeminiNodeType = Node<GeminiNodeData>;


export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
    
    const [open, setOpen] = useState(false);
    const { setNodes } = useReactFlow();
    const nodeData = props.data;
    const description = nodeData?.userPrompt ? 
     `${nodeData.model || GEMINI_AVAILABLE_MODELS[0] }: ${nodeData.userPrompt.slice(0, 50)}...`
     : "Not configured";

     const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: GEMINI_CHANNEL,
        topic: "status",
        refreshToken: fetchGeminiRealtimeToken,
     });

     const handleSettings = () => {
        setOpen(true);
     }
 
     const handleSubmit = (values: GeminiFormValues) => {
        setNodes((nodes) => nodes.map((node) => {
            if (node.id === props.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        ...values,
                    },
                }
            }
            return node;
        }));
     }
     return (
        <>
        <GeminiDialog 
            open={open} 
            onOpenChange={setOpen}
            onSubmit={handleSubmit}
           defaultValues={nodeData}

        />
        <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/icons/gemini.svg"
        name="Gemini"
        description={description}
        status={nodeStatus}
        onSettings={handleSettings}
        onDoubleClick={handleSettings}
        />

        </>
     )
   
});

GeminiNode.displayName = "GeminiNode";