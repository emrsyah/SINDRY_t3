import { router } from "../trpc";
import { authRouter } from "./auth";
import { customerRouter } from "./customer";
import { exampleRouter } from "./example";
import { outletRouter } from "./outlet";
import { productOuter } from './product';

export const appRouter = router({
  // example: exampleRouter,
  outlet: outletRouter,
  customer: customerRouter,
  auth: authRouter,
  product: productOuter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
