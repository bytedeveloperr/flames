import { Query } from "./Query.ts"
import type { Flames } from "./flames.ts"
import { ColumnAttribute, ModelOptions } from "./types.ts"

export class Model {
  private _query: Query
  private _table: string
  private _flames: Flames
  private _queryRunner!: any
  private _queryGenerator!: any
  private _columns: { [key: string]: ColumnAttribute } = {}

  constructor(table: string, columns: { [key: string]: ColumnAttribute }, options: ModelOptions) {
    this._table = table
    this._columns = columns
    this._flames = options.flames
    this._query = new Query(this._flames)
  }

  public async initialize() {
    this._queryGenerator = await this._query.getQueryGenerator()
    this._queryRunner = await this._query.getQueryRunner()

    await this._sync()
  }

  private async _sync() {
    const tableExistsQuery = this._queryGenerator.tableExistsQuery(this._table)
    const [exists] = await this._queryRunner.runQuery(tableExistsQuery)

    if (!exists) {
      const createTableQuery = this._queryGenerator.createTableQuery(this._table, this._columns)
      await this._queryRunner.runQuery(createTableQuery)
    }
  }

  public async create(data: any) {
    const insertQuery = this._queryGenerator.insertQuery(this._table, data, this._columns)
    const [inserted] = await this._queryRunner.runQuery(insertQuery)

    return this.build(inserted)
  }

  public async build(data: any) {
    const result: any = {}

    for (const key in this._columns) {
      result[key] = data[key]
    }

    return result
  }
}
