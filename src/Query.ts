import { PostgresQueryGenerator } from "./dialects/postgres/query_generator.ts"
import { PostgresQueryRunner } from "./dialects/postgres/query_runner.ts"
import { Flames } from "./flames.ts"

export class Query {
  public flames: Flames
  public runner: PostgresQueryRunner
  public generator: PostgresQueryGenerator

  constructor(flames: Flames) {
    this.flames = flames

    this.runner = this.getQueryRunner()
    this.generator = this.getQueryGenerator()
  }

  public getQueryRunner() {
    switch (this.flames.config.dialect) {
      case "postgres":
        return new PostgresQueryRunner(this.flames)
      default:
        throw new Error(`Dialect ${this.flames.config.dialect} is not yet supported`)
    }
  }

  public getQueryGenerator() {
    switch (this.flames.config.dialect) {
      case "postgres":
        return new PostgresQueryGenerator(this.flames)
      default:
        throw new Error(`Dialect ${this.flames.config.dialect} is not yet supported`)
    }
  }
}
