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
        id: z.string(),
        name: z.string(),
        email: z.string(),
        password: z.string(),
        role: z.enum(["admin", "owner", "cashier"]),
        outlet_id: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.create({
        data: {
          id: input.id,
          name: input.name,
          email: input.email,
          password: input.password,
          role: input.role,
          outletsId: input.outlet_id
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
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
