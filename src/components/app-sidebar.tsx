"use client";


import {
    FolderOpenIcon,
    HistoryIcon,
    KeyIcon,
    LogOutIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
   SidebarGroupContent,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";


const menuItems = [
    {
        title: "Workflows",
        items: [
            {
                title: "Workflows",
                href: "/workflows",
                icon: FolderOpenIcon
            },
            {
                title: "Credentials",
                href: "/credentials",
                icon: KeyIcon
            },
            {
                title: "Executions",
                href: "/executions",
                icon: HistoryIcon
            }
        ],
    }
];


export const AppSidebar = () => {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild className="gap-x-4">
                        <Link href="/" prefetch>
                            <Image src="icons/logo.svg" alt="Logo" width={30} height={30} />
                            <span className="text-sm font-semibold">n7n</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarHeader>
            <SidebarContent>
                {menuItems.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupContent>
                            <SidebarMenu>
                            {group.items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                      tooltip={item.title}
                                      isActive={
                                        item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
                                      }
                                      asChild
                                      className="gap-x-4 h-10 px-4"
                                    >
                                        <Link href={item.href} prefetch>
                                            <item.icon className="size-4"/>
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                        tooltip="Logout"
                        onClick={() => {
                            authClient.signOut({
                                fetchOptions: {
                                    onSuccess: () => {
                                        router.push("/login");
                                    },
                                },
                            });
                        }}
                        className="gap-x-4 h-10 px-4">
                            <LogOutIcon className="size-4"/>
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};