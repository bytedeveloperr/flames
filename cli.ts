import { Command } from "./deps.ts"
import { NAME, VERSION } from "./constants.ts"
import { initAction } from "./src/cli/actions/init.ts"

await new Command()
  .name(NAME)
  .version(VERSION)
  .description("A Deno ORM for SQL databases")

  .command("init", "Generates a flames configuration file if it does not exist")
  .option("-d --dialect <dialect:string>", "Database dialect")
  .action(initAction)

  .parse(Deno.args)
