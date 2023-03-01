import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { outletRouter } from "./outlet";

export const appRouter = router({
  // example: exampleRouter,
  outlet: outletRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
