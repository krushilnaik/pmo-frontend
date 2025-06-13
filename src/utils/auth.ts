import { NextAuthOptions } from "next-auth";
import AzureAD from "next-auth/providers/azure-ad";

console.log("Client ID:", process.env.CLIENT_ID);
console.log("Client Secret:", process.env.CLIENT_SECRET);
console.log("Tenant ID:", process.env.TENANT_ID);
console.log("NextAuth Secret:", process.env.NEXTAUTH_SECRET);

export const authOptions: NextAuthOptions = {
  providers: [
    AzureAD({
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
      tenantId: process.env.TENANT_ID!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
};
