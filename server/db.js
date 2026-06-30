import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
    console.error("❌ Missing DATABASE_URL environment variable. Set it in .env (local) or your Vercel project settings.");
}

const sql = neon(process.env.DATABASE_URL);

export default sql;
