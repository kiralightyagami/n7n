"use client"

import { useReactFlow, type Node, type NodeProps} from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { HttpRequestFormValues, HttpRequestDialog } from "./dialog";


type HttpRequestNodeData = {
    variableName?: string;
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: string;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;


export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
    
    const [open, setOpen] = useState(false);
    const { setNodes } = useReactFlow();
    const nodeData = props.data;
    const description = nodeData?.endpoint ? 
     `${nodeData.method || "GET" }: ${nodeData.endpoint}`
     : "Not configured";

     const nodeStatus = "initial";

     const handleSettings = () => {
        setOpen(true);
     }
 
     const handleSubmit = (values: HttpRequestFormValues) => {
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
        <HttpRequestDialog 
            open={open} 
            onOpenChange={setOpen}
            onSubmit={handleSubmit}
           defaultValues={nodeData}

        />
        <BaseExecutionNode
        {...props}
        id={props.id}
        icon={GlobeIcon}
        name="Http Request"
        description={description}
        status={nodeStatus}
        onSettings={handleSettings}
        onDoubleClick={handleSettings}
        />

        </>
     )
   
});

HttpRequestNode.displayName = "HttpRequestNode";