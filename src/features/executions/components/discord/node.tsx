"use client"

import { useReactFlow, type Node, type NodeProps} from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { DiscordFormValues, DiscordDialog } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchDiscordRealtimeToken } from "./actions";
import { DISCORD_CHANNEL } from "@/ingest/channels/discord";

type DiscordNodeData = {
    webhookUrl?: string;
    content?: string;
    username?: string;
};

type DiscordNodeType = Node<DiscordNodeData>;


export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
    
    const [open, setOpen] = useState(false);
    const { setNodes } = useReactFlow();
    const nodeData = props.data;
    const description = nodeData?.content ? 
     `Send: ${nodeData.content.slice(0, 50)}...`
     : "Not configured";

     const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: DISCORD_CHANNEL,
        topic: "status",
        refreshToken: fetchDiscordRealtimeToken,
     });

     const handleSettings = () => {
        setOpen(true);
     }
 
     const handleSubmit = (values: DiscordFormValues) => {
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
        <DiscordDialog 
            open={open} 
            onOpenChange={setOpen}
            onSubmit={handleSubmit}
           defaultValues={nodeData}

        />
        <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/icons/discord.svg"
        name="Discord"
        description={description}
        status={nodeStatus}
        onSettings={handleSettings}
        onDoubleClick={handleSettings}
        />

        </>
     )
   
});

DiscordNode.displayName = "DiscordNode";