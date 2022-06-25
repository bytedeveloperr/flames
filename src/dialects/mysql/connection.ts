import { MysqlClient, MysqlClientConfig } from "../../../deps.ts"
import { FlamesConnectionOptions } from "../../types.ts"

export class MysqlConnection {
  private _client: MysqlClient
  private _options: MysqlClientConfig
  private _connected = false

  constructor(options: FlamesConnectionOptions) {
    this._options = {
      port: options.port!,
      db: options.database,
      hostname: options.host!,
      username: options.username!,
      password: options.password!,
      poolSize: options.poolSize || 2,
    }

    this._client = new MysqlClient()
  }

  public async connect() {
    if (this._connected) {
      return
    }

    await this._client.connect(this._options)
    this._connected = true
  }

  public async query(sql: string, params?: any[]) {
    const connection = this._client
    const result = await connection.query(sql, params)

    return result
  }
}
