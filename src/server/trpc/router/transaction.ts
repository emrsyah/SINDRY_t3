import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const transactionRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.transactions.findMany({
      include: {
        outlets: {
          select: {
            name: true,
          },
        },
        customers: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
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
      return ctx.prisma.transactions.findUnique({
        where: {
          id: input.id,
        },
        include: {
          outlets: {
            select: {
              name: true,
            },
          },
          customers: {
            select: {
              name: true,
              address: true,
              contact: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          transaction_details : {
            include : {
                products : {
                    select : {
                        price: true,
                        name: true
                    }
                }
            }
          }
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        price: z.number(),
        type: z.enum(["kiloan", "selimut", "kaos", "bed_cover", "lainnya"]),
        outlet_id: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.products.create({
        data: {
          name: input.name,
          price: input.price,
          type: input.type,
          outlet_id: input.outlet_id,
          sold: 0,
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
      return ctx.prisma.transactions.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
