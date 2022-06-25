import { Model } from "./Model.ts"
import { CONFIG_FILE_PATH } from "../constants.ts"
import { DefineModelConfig, FlamesConfig } from "./types.ts"
import { PostgresConnection } from "./dialects/postgres/connection.ts"
import { MysqlConnection } from "./dialects/mysql/connection.ts"

export class Flames {
  private _config!: FlamesConfig
  private _connection!: PostgresConnection | MysqlConnection
  public config!: { dialect: string; database: string }

  public async connect() {
    try {
      const config = await this._getConfig()

      this._config = config
      this._connection = this._getConnection()
      this.config = { dialect: config.dialect, database: config.connection.database }

      await this._connection.connect()
    } catch (e) {
      console.log(e)
      Deno.exit(1)
    }
  }

  private _getConnection() {
    const { dialect, connection } = this._config

    switch (dialect) {
      case "postgres":
        return new PostgresConnection(connection)
      case "mysql":
        return new MysqlConnection(connection)
      default:
        throw new Error(`Dialect ${dialect} is not supported`)
    }
  }

  private async _getConfig(): Promise<FlamesConfig> {
    try {
      const { config }: { config: FlamesConfig } = await import(CONFIG_FILE_PATH)
      return config
    } catch (e) {
      if (e.code === "ERR_MODULE_NOT_FOUND") {
        throw new Error("Flames config file not found")
      }
      throw e
    }
  }

  public async query(sql: string, args?: any[]) {
    const result = await this._connection.query(sql, args)
    return result
  }

  public define(name: string, config: DefineModelConfig) {
    const table = config.table || name
    const model = new Model(table, config.columns, { flames: this })

    Object.defineProperty(this, name.toLowerCase(), { value: model })
  }
}

export const flames = new Flames()
