import { Pool, ClientOptions, PoolClient } from "https://deno.land/x/postgres@v0.16.1/mod.ts"
import { FlamesConnectionOptions } from "../../types.ts"

export class PostgresConnection {
  private _client: Pool
  private _config: ClientOptions

  constructor(connection: FlamesConnectionOptions["connection"]) {
    this._config = {
      port: connection.port!,
      user: connection.username!,
      hostname: connection.host!,
      database: connection.database!,
      password: connection.password!,
      tls: { enabled: false },
    }

    this._client = new Pool(this._config, connection.poolSize || 20)
  }

  public async connect() {
    return await this._client.connect()
  }

  public async getConnection() {
    return await this.connect()
  }

  public async releaseConnection(client: PoolClient) {
    await client.release()
  }
}
