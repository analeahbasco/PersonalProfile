// Run with: npm run hash-password -- "yourRealPassword"
// (or:      node server/hashPassword.js "yourRealPassword")
// Paste the printed hash into sql/schema.sql before running it in Neon.
import bcrypt from "bcrypt";

async function hashMyPassword() {
    const plainTextPassword = process.argv[2] || "admin123";
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

    console.log("-------------------------------------------------");
    console.log("Plain text password:", plainTextPassword);
    console.log("Bcrypt hash:        ", hashedPassword);
    console.log("-------------------------------------------------");
    console.log("Paste the hash above into sql/schema.sql, then run that file in the Neon SQL Editor.");
}

hashMyPassword();
