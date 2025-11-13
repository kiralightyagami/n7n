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
import { generateGoogleFormScript } from "./utils";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const GoogleFormTriggerDialog = ({ 
    open, 
    onOpenChange 
}: Props) => {

    const params = useParams();
    const workflowId = params.workflowId as string;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;
    
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
                    <DialogTitle>Google Form Trigger</DialogTitle>
                    <DialogDescription>
                        Use this webhook URL in your Google Form's Apps Script to
                        trigger this workflow when a new form is submitted.
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
                            <li>Open your Google Form</li>
                            <li>Click the three dots menu -&gt; Script Editor</li>
                            <li>Copy and paste the script below</li>
                            <li>Replace WEBHOOK_URL with the webhook URL above</li>
                            <li>Save and click "Triggers" -&gt; Add Trigger</li>
                            <li>Choose: From form -&gt; On form submit -&gt; Save</li>
                        </ol>
                    </div>

                    <div className="rounded-lg bg-muted p-4 space-y-3">
                        <h4 className="font-medium text-sm">Google Apps Script</h4>
                        <Button
                         type="button"
                         variant="outline"
                         onClick={ async () => {
                            const script = generateGoogleFormScript(webhookUrl);
                            try {
                                await navigator.clipboard.writeText(script);
                                toast.success("Script copied to clipboard");
                            } catch (error) {
                                toast.error("Failed to copy script");
                            }
                         }}
                        >
                            <CopyIcon className="size-4 mr-2" />
                            Copy Script
                        </Button>
                        <p className="text-sm text-muted-foreground">
                            This script includes your webhook URL
                            handles form submission.
                        </p>
                    </div>
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                         <h4 className="font-medium text-sm">Available variables:</h4>
                         <ul className="text-sm text-muted-foreground space-y-1">
                            <li>
                                <code className="bg-background px-1 py-0.5 rounded">
                                    {"{{googleForm.respondentEmail}}"}
                                </code>
                                - Respondent's email
                            </li>
                            <li>
                                <code className="bg-background px-1 py-0.5 rounded">
                                    {"{{googleForm.responses['Question Name']}}"}
                                </code>
                                - Specific answer
                            </li>
                            <li>
                                <code className="bg-background px-1 py-0.5 rounded">
                                    {"{{json googleForm.responses}}"}
                                </code>
                                - All answers as a JSON object
                            </li>
                         </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};