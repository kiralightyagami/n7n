"use client";

import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";
import {
    GlobeIcon,
    MousePointerIcon,
} from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
} from "@/components/ui/sheet";
import { NodeType } from "@/generated/prisma/enums";
import { Separator } from "@/components/ui/separator";

export type NodeTypeOption = {
    type: NodeType;
    icon: React.ComponentType<{ className?: string }> | string;
    label: string;
    description: string;
};


const triggerNodes: NodeTypeOption[] = [
    {
        type: NodeType.MANUAL_TRIGGER,
        icon: MousePointerIcon,
        label: "Trigger manually",
        description: "Trigger the workflow manually.",
    },
    {
        type: NodeType.GOOGLE_FORM_TRIGGER,
        icon: "/icons/google-form.svg",
        label: "Google Form",
        description: "Runs a flow when google form is submitted.",
    },
    {
        type: NodeType.STRIPE_TRIGGER,
        icon: "/icons/stripe.svg",
        label: "Stripe",
        description: "Runs a flow when a new payment is made.",
    },

];


const executionNodes: NodeTypeOption[] = [
    {
        type: NodeType.HTTP_REQUEST,
        icon: GlobeIcon,
        label: "HTTP Request",
        description: "Make an HTTP request to an external API.",
    },
    {
        type: NodeType.GEMINI,
        icon: "/icons/gemini.svg",
        label: "Gemini",
        description: "Uses Gemini to generate text",
    },
    {
        type: NodeType.OPENAI,
        icon: "/icons/openai.svg",
        label: "OpenAI",
        description: "Uses OpenAI to generate text",
    },
];


interface NodeSelectorProps {
    open: boolean;
    children: React.ReactNode;
    onOpenChange: (open: boolean) => void;
};

export const NodeSelector = ({ 
    open, 
    children, 
    onOpenChange 
}: NodeSelectorProps) => {
    const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();
    
    const handleNodeSelect = useCallback((
        nodeType: NodeTypeOption
    ) => {
        if (nodeType.type === NodeType.MANUAL_TRIGGER) {
            const nodes = getNodes();
            const hasManualTrigger = nodes.some(
                (node) => node.type === NodeType.MANUAL_TRIGGER,
            );

            if (hasManualTrigger) {
                toast.error("You can only have one manual trigger node.");
                return;
            }
        }

        setNodes((nodes) => {
            const hasInitialNode = nodes.some(
                (node) => node.type === NodeType.INITIAL,
            );

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const flowPosition = screenToFlowPosition({ 
                x: centerX + (Math.random() - 0.5) * 200, 
                y: centerY + (Math.random() - 0.5) * 200, 
            });


            const newNode = {
                id: createId(),
                type: nodeType.type,
                position: flowPosition,
                data: {},
            };

            if (hasInitialNode) {
                return [newNode];
            }
            return [...nodes, newNode];
        });

        onOpenChange(false);
    }, [
        setNodes,
        getNodes,
        screenToFlowPosition,
        onOpenChange,
    ]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>What trigger this workflow?</SheetTitle>
                    <SheetDescription>
                        Select the node that will trigger the workflow.
                    </SheetDescription>
                </SheetHeader>
                <div>
                    {triggerNodes.map((nodeType) => {
                        const Icon = nodeType.icon;
                        return (
                            <div
                            key={nodeType.type}
                            className="w-full justify-start h-auto py-5 px-4 rounded-node cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                            onClick={() => {handleNodeSelect(nodeType)}}
                            >
                                <div className="flex items-center gap-6 w-full overflow-hidden">
                                    { typeof Icon === "string" ? (
                                        <img
                                        src={Icon}
                                        alt={nodeType.label}
                                        className="size-5 object-contain rounded-sm"
                                        />
                                    ): (
                                        <Icon className="size-5" />
                                    )}
                                    <div className="flex flex-col items-start text-left">
                                        <span className="font-medium text-sm">
                                            {nodeType.label}
                                        </span>
                                        <span className="text-muted-foreground text-xs">
                                            {nodeType.description}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <Separator/>
                <div>
                    {executionNodes.map((nodeType) => {
                        const Icon = nodeType.icon;
                        return (
                            <div
                            key={nodeType.type}
                            className="w-full justify-start h-auto py-5 px-4 rounded-node cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                            onClick={() => {handleNodeSelect(nodeType)}}
                            >
                                <div className="flex items-center gap-6 w-full overflow-hidden">
                                    { typeof Icon === "string" ? (
                                        <img
                                        src={Icon}
                                        alt={nodeType.label}
                                        className="size-5 object-contain rounded-sm"
                                        />
                                    ): (
                                        <Icon className="size-5" />
                                    )}
                                    <div className="flex flex-col items-start text-left">
                                        <span className="font-medium text-sm">
                                            {nodeType.label}
                                        </span>
                                        <span className="text-muted-foreground text-xs">
                                            {nodeType.description}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </SheetContent>
        </Sheet>
    )
};