import { PAGINATION } from "@/config/constant";
import { NodeType } from "@/generated/prisma/client";
import { sendWorkflowExecutionEvent } from "@/ingest/utils";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { Edge, Node } from "@xyflow/react";
import { z } from "zod";


export const workflowsRouter = createTRPCRouter({
    execute: protectedProcedure
        .input(z.object({
            id: z.string(),
        }))
        .mutation(async ({ ctx, input}) => {
            const workflow = await prisma.workflow.findUniqueOrThrow({
                where: {
                    id: input.id,
                    userId: ctx.auth.user.id,
                },
            });
            

            await sendWorkflowExecutionEvent({
                workflowId: input.id,
            });

            return workflow;
        }),
    create: protectedProcedure.mutation(async ({ ctx}) => {
       return prisma.workflow.create({
        data: {
            name: "New Workflow",
            userId: ctx.auth.user.id,
            createdAt: new Date(),
            nodes: {
                create: {
                    name: NodeType.INITIAL,
                    type: NodeType.INITIAL,
                    position: { x: 0, y: 0 },
                },
            },
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
    update: protectedProcedure
    .input(z.object({
        id: z.string(),
        nodes: z.array(z.object({
            id: z.string(),
            type: z.string().nullish(),
            position: z.object({
                x: z.number(),
                y: z.number(),
            }),
            data: z.record(z.string(), z.any()).optional(),
        })
    ),
      edges: z.array(z.object({
        source: z.string(),
        target: z.string(),
        sourceHandle: z.string().nullish(),
        targetHandle: z.string().nullish(),
      })),
    }))
    .mutation(async ({ ctx, input}) => {
        const { id, nodes, edges } = input;
        
        const workflow = await prisma.workflow.findUniqueOrThrow({
            where: {
                id,
                userId: ctx.auth.user.id,
            },
        });

        return await prisma.$transaction(async (tx) => {

            await tx.node.deleteMany({
                where: {
                    workflowId: id,
                },
            });

            await tx.node.createMany({
                data: nodes.map((node) => ({
                    id: node.id,
                    workflowId: id,
                    name: node.type || "unknown",
                    type: node.type as NodeType,
                    position: node.position,
                    data: node.data || {},
                })),
            });

            await tx.connection.createMany({
                data: edges.map((edge) => ({
                    workflowId: id,
                    fromNodeId: edge.source,
                    toNodeId: edge.target,
                    fromOutput: edge.sourceHandle || "main",
                    toInput: edge.targetHandle || "main",
                })),
            });

            await tx.workflow.update({
                where: {
                    id,
                },
                data: {
                    updatedAt: new Date(),
                },
            });
            return workflow;
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
            const workflow = await prisma.workflow.findUniqueOrThrow({
                where: {
                    id: input.id,
                    userId: ctx.auth.user.id,
                },
                include: {
                    nodes: true,
                    connections: true,
                },
            });
        const nodes: Node[] = workflow.nodes.map((node) => ({
            id: node.id,
            position: node.position as { x: number, y: number },
            data: (node.data as Record<string, unknown>) || {},
            type: node.type,
        }));
        const edges: Edge[] = workflow.connections.map((connection) => ({
            id: connection.id,
            source: connection.fromNodeId,
            target: connection.toNodeId,
            sourceHandle: connection.fromOutput,
            targetHandle: connection.toInput,
        }));
        return { 
            id: workflow.id,
            name: workflow.name,
            nodes,
            edges,
         };
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