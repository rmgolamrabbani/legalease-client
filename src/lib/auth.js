import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.AUTH_BD_NAME || "legal_ease_auth");

export const auth = betterAuth({
  emailAndPassword: { 
    enabled: true, 
  },

  database: mongodbAdapter(db, {
    client
  }),

  user: {
    additionalFields: {
      role: {
        type: "string",        // ⚡ 'String' পরিবর্তন করে '"string"' করা হয়েছে
        defaultValue: "user",   // ⚡ 'default' পরিবর্তন করে 'defaultValue' করা হয়েছে
      },
    },
  }
});