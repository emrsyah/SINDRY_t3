import { router } from "../trpc";
import { authRouter } from "./auth";
import { customerRouter } from "./customer";
import { outletRouter } from "./outlet";
import { productRouter } from './product';
import { transactionRouter } from './transaction';
import { userRouter } from "./user";

export const appRouter = router({
  // example: exampleRouter,
  outlet: outletRouter,
  customer: customerRouter,
  auth: authRouter,
  product: productRouter,
  transaction: transactionRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
