import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

export const authOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID,
      clientSecret: process.env.COGNITO_CLIENT_SECRET,
      issuer: process.env.COGNITO_ISSUER,
      checks: "both",
    })
  ],
  session: {
    jwt: true,
    maxAge: 365 * 24 * 60 * 60, // 365 days
  }
}

export default NextAuth(authOptions)