"use client"


import { useReactFlow, type Node, type NodeProps} from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "@/features/executions/base-execution-node";
import { FormType, HttpRequestDialog } from "./dialog";


type HttpRequestNodeData = {
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: string;
    [key: string]: any;
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
 
     const handleSubmit = (values: FormType) => {
        setNodes((nodes) => nodes.map((node) => {
            if (node.id === props.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        endpoint: values.endpoint,
                        method: values.method,
                        body: values.body,
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
            defaultEndpoint={nodeData.endpoint}
            defaultMethod={nodeData.method}
            defaultBody={nodeData.body}

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