import { Flames } from "./flames.ts"

export class Query {
  public flames: Flames

  constructor(flames: Flames) {
    this.flames = flames
  }

  public async getQueryRunner() {
    switch (this.flames.config.dialect) {
      case "postgres": {
        const { QueryRunner } = await import("./dialects/postgres/query_runner.ts")
        return new QueryRunner(this.flames)
      }
    }
  }

  public async getQueryGenerator() {
    switch (this.flames.config.dialect) {
      case "postgres": {
        const { QueryGenerator } = await import("./dialects/postgres/query_generator.ts")
        return new QueryGenerator(this.flames)
      }
    }
  }
}
