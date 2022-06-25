import { Query } from "./Query.ts"
import type { Flames } from "./flames.ts"
import { ColumnAttribute, ModelCreateOptions, ModelFindOptions, ModelOptions } from "./types.ts"

export class Model {
  private _query: Query
  private _table: string
  private _flames: Flames
  private _columns: { [key: string]: ColumnAttribute } = {}

  constructor(table: string, columns: { [key: string]: ColumnAttribute }, options: ModelOptions) {
    this._table = table
    this._columns = columns
    this._flames = options.flames
    this._query = new Query(this._flames)
  }

  public async create(options: ModelCreateOptions) {
    const insertQuery = this._query.generator.insertQuery(this._table, options.data, this._columns)
    const [inserted] = await this._query.runner.runQuery(insertQuery)

    return this.build(inserted)
  }

  public async find(options: ModelFindOptions) {
    const findQuery = this._query.generator.findQuery(this._table, options)
    const rows = await this._query.runner.runQuery(findQuery.sql)

    return this.build(rows)
  }

  public build(data: any): any {
    if (Array.isArray(data)) {
      const result = []

      for (let i = 0; i < data.length; i++) {
        result.push(this.build(data[i]))
      }
      return result
    }

    const result: any = {}
    for (const key in this._columns) {
      result[key] = data[key]
    }
    return result
  }
}
