import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const outletRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.outlets.findMany();
  }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.outlets.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  getTopSales: protectedProcedure.query(({ctx})=>{
    return ctx.prisma.outlets.findMany({
      orderBy: {
        total_sales: "desc"
      },
      take: 5
    })
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        address: z.string(),
        contact: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.outlets.create({
        data: {
          name: input.name,
          address: input.address,
          contact: input.contact,
          total_sales: 0,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        address: z.string(),
        contact: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.outlets.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          address: input.address,
          contact: input.contact,
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.outlets.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
