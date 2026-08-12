/**
 * Creates (or updates) the first MATRIXZ admin account.
 * Usage: ts-node scripts/seedAdmin.ts admin@matrixz.club "Admin Name" "StrongPassword123"
 */
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { env } from "../src/config/env";
import { Admin } from "../src/models/Admin";

async function run() {
  const [email, name, password] = process.argv.slice(2);
  if (!email || !name || !password) {
    console.error('Usage: ts-node scripts/seedAdmin.ts <email> "<name>" "<password>"');
    process.exit(1);
  }

  await mongoose.connect(env.mongodbUri);

  let admin = await Admin.findOne({ email });
  if (admin) {
    admin.name = name;
    admin.password = password;
    admin.role = "superadmin";
    await admin.save();
    console.log(`Updated existing admin: ${email}`);
  } else {
    admin = await Admin.create({ name, email, password, role: "superadmin" });
    console.log(`Created new admin: ${email}`);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
