import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import dns from "node:dns";

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);
async function start() {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`[server] MATRIXZ API listening on port ${env.port} (${env.nodeEnv})`);
  });
}

start();
