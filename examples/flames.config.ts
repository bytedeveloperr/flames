import { FlamesConfig } from "https://deno.land/x/flames@v0.1.1/mod.ts"

export const config: FlamesConfig = {
  dialect: "postgres",
  connection: {
    username: "postgres",
    password: "root",
    database: "norva",
    host: "localhost",
    port: 5432,
    poolSize: 2,
  },
}
