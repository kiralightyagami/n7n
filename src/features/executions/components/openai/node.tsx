"use client"

import { useReactFlow, type Node, type NodeProps} from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { OpenAIFormValues, OpenAIDialog, OPENAI_AVAILABLE_MODELS } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchOpenAIToken } from "./actions";
import { OPENAI_CHANNEL } from "@/ingest/channels/openai";

type OpenAINodeData = {
    variableName?: string;
    credentialId?: string;
    model?: typeof OPENAI_AVAILABLE_MODELS[number];
    systemPrompt?: string;
    userPrompt?: string;
};

type OpenAINodeType = Node<OpenAINodeData>;


export const OpenAINode = memo((props: NodeProps<OpenAINodeType>) => {
    
    const [open, setOpen] = useState(false);
    const { setNodes } = useReactFlow();
    const nodeData = props.data;
    const description = nodeData?.userPrompt ? 
     `${nodeData.model || OPENAI_AVAILABLE_MODELS[0] }: ${nodeData.userPrompt.slice(0, 50)}...`
     : "Not configured";

     const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: OPENAI_CHANNEL,
        topic: "status",
        refreshToken: fetchOpenAIToken,
     });

     const handleSettings = () => {
        setOpen(true);
     }
 
     const handleSubmit = (values: OpenAIFormValues) => {
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
        <OpenAIDialog 
            open={open} 
            onOpenChange={setOpen}
            onSubmit={handleSubmit}
           defaultValues={nodeData}

        />
        <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/icons/openai.svg"
        name="OpenAI"
        description={description}
        status={nodeStatus}
        onSettings={handleSettings}
        onDoubleClick={handleSettings}
        />

        </>
     )
   
});

OpenAINode.displayName = "OpenAINode";