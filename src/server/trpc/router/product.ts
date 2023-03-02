import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const productOuter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.products.findMany({
      include: {
        outlets: true,
      },
    });
  }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.products.findUnique({
        where: {
          id: input.id,
        },
      });
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
        price: z.number(),
        type: z.enum(["kiloan", "selimut", "kaos", "bed_cover", "lainnya"]),
        outlet_id: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.products.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          price: input.price,
          type: input.type,
          outlet_id: input.outlet_id,
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
