"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";


const loginFormSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
    const router = useRouter();
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        await authClient.signIn.email({
            email: data.email,
            password: data.password,
            callbackURL: "/",
        },{
            onSuccess: () => {
                toast.success("Logged in successfully");
                router.push("/");
            },
            onError: (error) => {
                toast.error(error.error.message);
            },
        })
    };

    const isPending = form.formState.isSubmitting;

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>
                        Login to your account
                    </CardTitle>
                    <CardDescription>
                        Enter your email and password to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid gap-6">
                                <div className="flex flex-col gap-4">
                                    <Button 
                                      variant="outline" 
                                      className="w-full"
                                      type="button"
                                      disabled={isPending}
                                    >
                                        <Image src="/icons/github.svg" alt="Github" width={20} height={20} />
                                        Continue with Github
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      className="w-full"
                                      type="button"
                                      disabled={isPending}
                                    >
                                        <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
                                        Continue with Google
                                    </Button>
                                </div>
                                <div className="grid gap-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="example@example.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="********"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isPending}
                                    >
                                        {isPending ? <Spinner /> : "Login"}
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Don't have an account? {" "}
                                    <Link 
                                      href="/register" 
                                      className="underline underline-offset-4 "
                                    >
                                        Register
                                    </Link>
                                </div>
                                <div className="text-center text-sm">
                                    <Link href="/forgot-password" className="text-primary underline">Forgot password?</Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};   
