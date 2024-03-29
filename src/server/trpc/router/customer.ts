import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../trpc";

export const customerRouter = router({
  getAll: adminProcedure.query(({ ctx }) => {
    return ctx.prisma.customers.findMany({
      include: {
        outlets: true,
      },
    });
  }),
  getByOutlet: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.customers.findMany({
        where: {
          outlet_id: input.id
        },
        include: {
          outlets: {
            select: {
              name: true
            }
          }
        }
      });
    }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.customers.findUnique({
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
        gender: z.enum(["L", "P"]),
        outlet_id: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.customers.create({
        data: {
          name: input.name,
          address: input.address,
          contact: input.contact,
          gender: input.gender,
          outlet_id: input.outlet_id,
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
        gender: z.enum(["L", "P"]),
        outlet_id: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.customers.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          address: input.address,
          contact: input.contact,
          gender: input.gender,
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
      return ctx.prisma.customers.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
