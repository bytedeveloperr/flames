import { PostgresClientOptions, PostgresPool, PostgresPoolClient } from "../../../deps.ts"
import { FlamesConnectionOptions } from "../../types.ts"

export class PostgresConnection {
  private _client: PostgresPool
  private _config: PostgresClientOptions

  constructor(connection: FlamesConnectionOptions["connection"]) {
    this._config = {
      port: connection.port!,
      user: connection.username!,
      hostname: connection.host!,
      database: connection.database!,
      password: connection.password!,
      tls: { enabled: false },
    }

    this._client = new PostgresPool(this._config, connection.poolSize || 20)
  }

  public async connect() {
    return await this._client.connect()
  }

  public async getConnection() {
    return await this.connect()
  }

  public async releaseConnection(client: PostgresPoolClient) {
    await client.release()
  }
}
