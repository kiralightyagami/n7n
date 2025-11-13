"use client"

import { useReactFlow, type Node, type NodeProps} from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { AnthropicFormValues, AnthropicDialog, ANTHROPIC_AVAILABLE_MODELS } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchAnthropicToken } from "./actions";
import { ANTHROPIC_CHANNEL } from "@/ingest/channels/anthropic";

type AnthropicNodeData = {
    variableName?: string;
    model?: typeof ANTHROPIC_AVAILABLE_MODELS[number];
    systemPrompt?: string;
    userPrompt?: string;
};

type AnthropicNodeType = Node<AnthropicNodeData>;


export const AnthropicNode = memo((props: NodeProps<AnthropicNodeType>) => {
    
    const [open, setOpen] = useState(false);
    const { setNodes } = useReactFlow();
    const nodeData = props.data;
    const description = nodeData?.userPrompt ? 
     `${nodeData.model || ANTHROPIC_AVAILABLE_MODELS[0] }: ${nodeData.userPrompt.slice(0, 50)}...`
     : "Not configured";

     const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: ANTHROPIC_CHANNEL,
        topic: "status",
        refreshToken: fetchAnthropicToken,
     });

     const handleSettings = () => {
        setOpen(true);
     }
 
     const handleSubmit = (values: AnthropicFormValues) => {
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
        <AnthropicDialog 
            open={open} 
            onOpenChange={setOpen}
            onSubmit={handleSubmit}
           defaultValues={nodeData}

        />
        <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/icons/anthropic.svg"
        name="Anthropic"
        description={description}
        status={nodeStatus}
        onSettings={handleSettings}
        onDoubleClick={handleSettings}
        />

        </>
     )
   
});

AnthropicNode.displayName = "AnthropicNode";