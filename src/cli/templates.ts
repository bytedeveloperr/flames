import { Dialect } from "../types.ts"
import { BASE_URL, VERSION } from "../../constants.ts"

function getConfigTemplate(dialect: Dialect) {
  return `import { FlamesConfig } from "${BASE_URL}@${VERSION}/mod.ts"

export const config: FlamesConfig = {
  dialect: "${dialect}",
  connection: {
    username: "dbuser",
    password: "dbpass",
    database: "dbname",
    host: "localhost",
    port: 5432,
    poolSize: 2,
  },
}
`
}

export const templates = { getConfigTemplate }
