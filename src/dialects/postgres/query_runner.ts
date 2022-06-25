import type { Flames } from "../../flames.ts"

export class PostgresQueryRunner {
  public flames: Flames

  constructor(flames: Flames) {
    this.flames = flames
  }

  async runQuery(query: string | { params: any[]; sql: string }) {
    let result
    if (typeof query === "string") {
      result = await this.flames.query(query)
    } else {
      result = await this.flames.query(query.sql, query.params)
    }

    if (result.command === "SELECT" || result.command === "INSERT") {
      return result.rows
    }

    return result
  }
}
