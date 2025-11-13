"use client";


import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";


interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const StripeTriggerDialog = ({ 
    open, 
    onOpenChange 
}: Props) => {

    const params = useParams();
    const workflowId = params.workflowId as string;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const webhookUrl = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`;
    
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(webhookUrl);
            toast.success("Webhook URL copied to clipboard");
        } catch (error) {
            toast.error("Failed to copy to clipboard");
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Stripe Trigger</DialogTitle>
                    <DialogDescription>
                        Configure this webhook URL in your Stripe Dashboard
                        to trigger this workflow when a new payment is made.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="webhookUrl">
                            Webhook URL
                        </Label>
                        <div className="flex gap-2">
                            <Input
                             id="webhookUrl"
                             value={webhookUrl}
                             readOnly
                             className="font-mono text-sm"
                            />
                            <Button
                             type="button"
                             size="icon"
                             onClick={copyToClipboard}
                             variant="outline"
                            >
                                <CopyIcon className="size-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="font-medium text-sm">Setup instructions:</h4>
                        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>Open your Stripe Dashboard</li>
                            <li>Go to Developers -&gt; Webhooks</li>
                            <li>Click "Add endpoint"</li>
                            <li>Paste the webhook URL above</li>
                            <li>Select events to listen for (e.g.,
                                payment_intent.succeeded)
                            </li>
                            <li>Save and copy the signing secret</li>
                        </ol>
                    </div>

                    <div className="rounded-lg bg-muted p-4 space-y-2">
                         <h4 className="font-medium text-sm">Available variables:</h4>
                         <ul className="text-sm text-muted-foreground space-y-1">
                            <li>
                                <code className="bg-background px-1 py-0.5 rounded">
                                    {"{{stripe.amount}}"}
                                </code>
                                - Payment amount
                            </li>
                            <li>
                                <code className="bg-background px-1 py-0.5 rounded">
                                    {"{{stripe.currency}}"}
                                </code>
                                - Payment currency
                            </li>
                            <li>
                                <code className="bg-background px-1 py-0.5 rounded">
                                    {"{{stripe.customerId}}"}
                                </code>
                                - Customer ID
                            </li>
                            <li>
                                <code className="bg-background px-1 py-0.5 rounded">
                                    {"{{json stripe}}"}
                                </code>
                                - All payment details as a JSON object
                            </li>
                            <li>
                                <code className="bg-background px-1 py-0.5 rounded">
                                    {"{{tripe.eventType}}"}
                                </code>
                                - Event type
                            </li>
                         </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};