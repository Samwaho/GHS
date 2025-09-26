import { createTRPCRouter } from '../init';
import { userRouter } from './user';
import { adminRouter } from './admin';
import { publicRouter } from './public';

export const appRouter = createTRPCRouter({
  user: userRouter,
  admin: adminRouter,
  public: publicRouter,
});

export type AppRouter = typeof appRouter;
