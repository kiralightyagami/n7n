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


const registerFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export function RegisterForm() {
    const router = useRouter();
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const signUpWithGoogle = async () => {
        await authClient.signIn.social({
            provider: "google",
        },
    {
        onSuccess: () => {
            router.push("/");
        },
        onError: () => {
            toast.error("Failed to sign up with Google");
        },
     });
    };

    const signUpWithGithub = async () => {
        await authClient.signIn.social({
            provider: "github",
        },
    {
        onSuccess: () => {
            router.push("/");
        },
        onError: () => {
            toast.error("Failed to sign up with Github");
        },
     });
    };

    const onSubmit = async (data: RegisterFormValues) => {
        await authClient.signUp.email({
            email: data.email,
            name: data.name,
            password: data.password,
            callbackURL: "/",
        },{
            onSuccess: () => {
                toast.success("Account created successfully");
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
                            Register your account
                    </CardTitle>
                    <CardDescription>
                        Enter your email and password to register your account
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
                                      onClick={signUpWithGithub}
                                    >
                                        <Image src="/icons/github.svg" alt="Github" width={20} height={20} />
                                        Continue with Github
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      className="w-full"
                                      type="button"
                                      disabled={isPending}
                                      onClick={signUpWithGoogle}
                                    >
                                        <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
                                        Continue with Google
                                    </Button>
                                </div>
                                <div className="grid gap-6">
                                <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="John Doe"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
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
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
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
                                    <FormMessage />
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isPending}
                                    >
                                        {isPending ? <Spinner /> : "Register"}
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Already have an account? {" "}
                                    <Link 
                                      href="/login" 
                                      className="underline underline-offset-4 "
                                    >
                                        Login
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};   
