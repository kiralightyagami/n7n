import { PAGINATION } from "@/config/constant";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";


export const workflowsRouter = createTRPCRouter({
    create: protectedProcedure.mutation(async ({ ctx}) => {
       return prisma.workflow.create({
        data: {
            name: "New Workflow",
            userId: ctx.auth.user.id,
            createdAt: new Date(),
        },
       });
    }),
    remove: protectedProcedure
        .input(z.object({
            id: z.string(),
       }))
       .mutation(async ({ ctx, input}) => {
            return prisma.workflow.delete({
                where: {
                   id: input.id,
                   userId: ctx.auth.user.id,
                },
            });
    }),
    updateName: protectedProcedure
        .input(z.object({
            id: z.string(),
            name: z.string().min(1),
        }))
        .mutation(async ({ ctx, input}) => {
            return prisma.workflow.update({
                where: {
                    id: input.id,
                    userId: ctx.auth.user.id,
                },
                data: {
                    name: input.name,
                    updatedAt: new Date(),
                },
            });
        }),
    getOne: protectedProcedure
        .input(z.object({
            id: z.string(),
        }))
        .query(async ({ ctx, input}) => {
            return prisma.workflow.findUnique({
                where: {
                    id: input.id,
                    userId: ctx.auth.user.id,
                },
            });
        }),
    getAll: protectedProcedure
        .input(z.object({
            page: z.number().default(PAGINATION.DEFAULT_PAGE),
            pageSize: z.number().min(PAGINATION.MIN_PAGE_SIZE).max(PAGINATION.MAX_PAGE_SIZE).default(PAGINATION.DEFAULT_PAGE_SIZE),
            search: z.string().default(""),
        }))
        .query(async ({ ctx, input}) => {
            const { page, pageSize, search } = input;

            const [items, totalCount] = await Promise.all([
                prisma.workflow.findMany({
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                    where: {
                        userId: ctx.auth.user.id,
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                }),
                prisma.workflow.count({
                    where: {
                        userId: ctx.auth.user.id,
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                }),
            ])

            const totalPages = Math.ceil(totalCount / pageSize);
            const hasNextPage = page < totalPages;
            const hasPreviousPage = page > 1;

            return {
                items: items,
                page,
                pageSize,
                totalCount,
                totalPages,
                hasNextPage,
                hasPreviousPage, 
            };
        }),
});