// Usage: node scripts/hash-password.mjs "yourpassword"
// Prints a bcrypt hash for ADMIN_PASSWORD_HASH in .env.local.
// Next.js expands "$" in env files, so each "$" in the hash must be escaped as "\$".
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-password.mjs "yourpassword"');
  process.exit(1);
}
if (password.length < 8) {
  console.error("Please use a password of at least 8 characters.");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log("Bcrypt hash:\n" + hash);
console.log("\nPaste this line into admin/.env.local (the \\$ escapes are required):");
console.log(`ADMIN_PASSWORD_HASH=${hash.replaceAll("$", "\\$")}`);
