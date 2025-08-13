import { baseProcedure, createTRPCRouter } from "../init";
import { loginSchema, registerSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const userRouter = createTRPCRouter({
    // Register a new user
  register: baseProcedure.input(registerSchema).mutation(async ({ input }) => {
    const { email, password, name } = input;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new TRPCError({ code: "CONFLICT", message: "User already exists" });
    }
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
    return user;
  }),
  // Login a user
  login: baseProcedure.input(loginSchema).mutation(async ({ input }) => {
    const { email, password } = input;
    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Invalid credentials",
            });
          default:
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Something went wrong",
            });
        }
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
});
