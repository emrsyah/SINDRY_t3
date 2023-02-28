import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: publicProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  loginEmailPassword: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.users.findFirst({
        where: {
          email: input.email,
          password: input.password,
        },
      });
      return user;
    }),
});
