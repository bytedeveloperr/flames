import type { Flames } from "../../flames.ts"

export class QueryRunner {
  public flames: Flames

  constructor(flames: Flames) {
    this.flames = flames
  }

  async runQuery(query: string | { args: {} | any[]; query: string }) {
    const connection = await this.flames.connection()

    let result
    if (typeof query === "string") {
      result = await connection.queryObject(query)
    } else {
      result = await connection.queryObject(query.query, query.args)
    }

    await this.flames.release(connection)

    if (result.command === "SELECT" || result.command === "INSERT") {
      return result.rows
    }

    return result
  }
}
