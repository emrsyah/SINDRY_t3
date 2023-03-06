import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
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
        }
      });
    }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
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
        id: z.string(),
        name: z.string(),
        email: z.string(),
        role: z.enum(["admin", "owner", "cashier"]),
        outlet_id: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          email: input.email,
          role: input.role,
          outletsId: input.outlet_id
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
