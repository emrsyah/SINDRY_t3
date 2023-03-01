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
  })
});
