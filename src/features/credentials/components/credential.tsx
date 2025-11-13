"use client";

import { CredentialType } from "@/generated/prisma/enums";
import { useRouter } from "next/navigation";
import { useCreateCredential, useSuspenseCredential, useUpdateCredential } from "../hooks/use-credentials";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";


const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    value: z.string().min(1, "Value is required"),
    type: z.enum(CredentialType),
});

type FormValues = z.infer<typeof formSchema>;

const credentialsTypeOptions = [
    {
        value: CredentialType.GEMINI,
        label: "Gemini",
        icon: "/icons/gemini.svg",
    },
    {
        value: CredentialType.ANTHROPIC,
        label: "Anthropic",
        icon: "/icons/anthropic.svg",
    },
    {
        value: CredentialType.OPENAI,
        label: "OpenAI",
        icon: "/icons/openai.svg",
    },
]

interface CredentialFormProps {
    initialData?: {
        id?: string;
        name: string;
        value: string;
        type: CredentialType;
    };
};

export const CredentialForm = ({ 
    initialData 
}: CredentialFormProps) => {
    const router = useRouter();
    const createCredential = useCreateCredential();
    const updateCredential = useUpdateCredential();

    const isEdit = !!initialData?.id;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            value: "",
            type: CredentialType.GEMINI,
        },
    })

    const onSubmit = async (values: FormValues) => {
        if (isEdit && initialData?.id) {
            await updateCredential.mutateAsync({
                id: initialData.id,
                ...values,
            });
        }
        else {
            await createCredential.mutateAsync(values,{
                onSuccess: (data) => {
                    router.push(`/credentials/${data.id}`);
                    
                },
                onError: (error) => {
                toast.error(`Failed to create credential: ${error.message}`);
            },
            });
        }
    }
    
    return (
    <>
     <Card className="shadow-none">
        <CardHeader>
            <CardTitle>
                {isEdit ? "Edit Credential" : "Create Credential"}
            </CardTitle>
            <CardDescription>
            {isEdit ? "Edit the credential details" : "Create a new credential"}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                >
                 <FormField
                 control={form.control}
                 name="name"
                 render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input 
                            {...field} 
                            placeholder="My API Key"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                 )}
                 />
                 <FormField
                 control={form.control}
                 name="type"
                 render={({ field }) => (
                    <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        >
                            <FormControl>
                                <SelectTrigger className="w-full">
                                    <SelectValue/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {credentialsTypeOptions.map((option) => (
                                    <SelectItem 
                                    key={option.value} 
                                    value={option.value}
                                    >
                                      <div className="flex items-center gap-2">
                                        <Image 
                                        src={option.icon} 
                                        alt={option.label} 
                                        width={16} 
                                        height={16} />
                                        {option.label}
                                      </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                 )}
                 />
                 <FormField
                 control={form.control}
                 name="value"
                 render={({ field }) => (
                    <FormItem>
                        <FormLabel>API Key</FormLabel>
                        <FormControl>
                            <Input 
                            type="password"
                            {...field} 
                            placeholder="sk-..."
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                 )}
                 />
                 <div className="flex gap-4">
                 <Button
                 type="submit"
                 disabled={createCredential.isPending || updateCredential.isPending}
                 >
                   {isEdit ? "Update" : "Create"} 
                 </Button>
                 <Button
                 type="button"
                 variant="outline"
                 asChild
                 >
                <Link href="/credentials" prefetch>
                   Cancel
                </Link>
                 </Button>
                </div>
                
                </form>
            </Form>
        </CardContent>
     </Card>
     </>
    );
};

export const CredentialView = ({
    credentialId,
}: {
    credentialId: string;
}) => {
    const { data: credential } = useSuspenseCredential(credentialId);

    return <CredentialForm initialData={credential} />
}