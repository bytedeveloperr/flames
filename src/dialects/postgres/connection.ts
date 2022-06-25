import { PostgresClientOptions, PostgresPool } from "../../../deps.ts"
import { FlamesConnectionOptions } from "../../types.ts"

export class PostgresConnection {
  private _client: PostgresPool
  private _options: PostgresClientOptions

  constructor(options: FlamesConnectionOptions) {
    this._options = {
      port: options.port!,
      user: options.username!,
      hostname: options.host!,
      database: options.database!,
      password: options.password!,
      tls: { enabled: false },
    }

    this._client = new PostgresPool(this._options, options.poolSize || 20)
  }

  public async connect() {
    return await this._client.connect()
  }

  public async query(sql: string, params?: any[]) {
    const connection = await this.connect()
    const result = await connection.queryObject(sql, params)

    connection.release()
    return result
  }
}
