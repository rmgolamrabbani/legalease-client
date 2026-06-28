import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins/jwt";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.AUTH_BD_NAME || "legal_ease_auth");

export const auth = betterAuth({
  emailAndPassword: { 
    enabled: true, 
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },  

  database: mongodbAdapter(db, {
    client
  }),

  user: {
    additionalFields: {
      role: {
        defaultValue: "user", 
      },
    },

  },

  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 60 * 60 * 24 * 7, // 7 দিন
    }
  },
  plugins: [
      jwt()
    ],

});