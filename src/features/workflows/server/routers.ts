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
        .query(async ({ ctx}) => {
            return prisma.workflow.findMany({
                where: {
                    userId: ctx.auth.user.id,
                },
            });
        }),
});