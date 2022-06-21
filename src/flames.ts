import { DefineModelConfig, FlamesConfig, FlamesConnectionOptions } from "./types.ts"
import { PostgresConnection } from "./dialects/postgres/connection.ts"
import { PoolClient } from "https://deno.land/x/postgres@v0.16.1/mod.ts"
import { Model } from "./Model.ts"

export class Flames {
  public config: FlamesConfig = {}
  private _connection!: PostgresConnection
  private _options!: FlamesConnectionOptions

  public async connect(options: FlamesConnectionOptions) {
    this._options = options
    this._connection = await this._initiateConnection()

    this.config = { dialect: options.dialect, database: options.connection.database }
  }

  private async _initiateConnection() {
    const { dialect, connection } = this._options

    switch (dialect) {
      case "postgres":
        return new PostgresConnection(connection)
      default:
        throw new Error(`Dialect ${dialect} is not supported`)
    }
  }

  public async connection() {
    return await this._connection.getConnection()
  }

  public async release(client: PoolClient) {
    return await this._connection.releaseConnection(client)
  }

  public define(name: string, config: DefineModelConfig) {
    const table = config.table || name
    const model = new Model(table, config.columns, { flames: this })

    Object.defineProperty(this, name.toLowerCase(), { value: model })
  }

  public async sync() {
    const props = Object.getOwnPropertyNames(this)

    for (let i = 0; i < props.length; i++) {
      const prop: any = props[i]
      const descriptor = Object.getOwnPropertyDescriptor(this, prop)
      const value = descriptor && descriptor.value

      if (value instanceof Model) {
        await value.initialize()
      }
    }
  }
}

export const flames = new Flames()
