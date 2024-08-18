import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { InvalidEmailPasswordError } from "./utils/errors"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        credentials: {
          email: {},
          password: {},
        },
        authorize: async (credentials) => {
          let user = null
   
          // logic to salt and hash password
          // logic to verify if the user exists
          //call backend
   
   
          if (!user) {
            // No user found, so this is their first attempt to login
            // meaning this is also the place you could do registration
            throw new InvalidEmailPasswordError()
          }
   
          // return user object with their profile data
          return user
        },
      }),
  ],
  pages: {
    signIn: "/auth/login",
  },
})