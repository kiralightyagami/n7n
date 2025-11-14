"use client"

import { useReactFlow, type Node, type NodeProps} from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { SlackFormValues, SlackDialog } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchSlackRealtimeToken } from "./actions";
import { SLACK_CHANNEL } from "@/ingest/channels/slack";

type SlackNodeData = {
    webhookUrl?: string;
    content?: string;
};

type SlackNodeType = Node<SlackNodeData>;


export const SlackNode = memo((props: NodeProps<SlackNodeType>) => {
    
    const [open, setOpen] = useState(false);
    const { setNodes } = useReactFlow();
    const nodeData = props.data;
    const description = nodeData?.content ? 
     `Send: ${nodeData.content.slice(0, 50)}...`
     : "Not configured";

     const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: SLACK_CHANNEL,
        topic: "status",
        refreshToken: fetchSlackRealtimeToken,
     });

     const handleSettings = () => {
        setOpen(true);
     }
 
     const handleSubmit = (values: SlackFormValues) => {
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
        <SlackDialog 
            open={open} 
            onOpenChange={setOpen}
            onSubmit={handleSubmit}
           defaultValues={nodeData}

        />
        <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/icons/slack.svg"
        name="Slack"
        description={description}
        status={nodeStatus}
        onSettings={handleSettings}
        onDoubleClick={handleSettings}
        />

        </>
     )
   
});

SlackNode.displayName = "SlackNode";