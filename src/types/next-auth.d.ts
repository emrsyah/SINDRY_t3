import { type DefaultSession } from "next-auth";

export enum Role {
  cashier = "cashier",
  owner = "owner",
  admin = "admin",
}

interface IUser extends DefaultUser {
  role?: Role;
}
declare module "next-auth" {
  interface User extends IUser {}
  interface Session {
    user?: User;
  }
}
declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}

// declare module "next-auth" {
/**
 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
 */
// interface Session {
//   user?: {
//     id: string;
//   } & DefaultSession["user"];
// }
// }
