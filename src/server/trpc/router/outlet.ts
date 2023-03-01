import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const outletRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.outlets.findMany()
  }),
  getById: protectedProcedure.input(
    z.object({
      id: z.number()
    })
  ).query(({ctx, input}) => {
    return ctx.prisma.outlets.findUnique({
      where: {
        id: input.id
      }
    })
  }),
  updateById: protectedProcedure.input(
    z.object({
      id: z.number(),
      name: z.string(),
      address: z.string(),
      contact: z.string(),
    })
  ).mutation(({ctx, input}) => {
    return ctx.prisma.outlets.update({
      where: {
        id: input.id
      },
      data: {
        name: input.name,
        address: input.address,
        contact: input.contact,
      }
    })
  })
});
