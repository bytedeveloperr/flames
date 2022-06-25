import type { Flames } from "./flames.ts"

export type DataType = "varchar" | "text" | "integer" | "boolean" | "decimal" | "timestamp" | "uuid"

export interface ColumnAttribute {
  type: DataType
  nullable?: boolean
  unique?: boolean
  primary?: boolean
  generated?: boolean
  length?: number
  updatedAt?: boolean
  precision?: number
  scale?: number
  default?: string | number | boolean | object
}

export interface ModelOptions {
  flames: Flames
  timestamps?: true
}

export interface DefineModelConfig {
  table?: string
  columns: { [key: string]: ColumnAttribute }
}

export interface FlamesConfig {
  dialect: Dialect
  database?: string
}

export type Dialect = "postgres" | "mysql"

export interface FlamesConfig {
  dialect: Dialect
  connection: FlamesConnectionOptions
}

export interface FlamesConnectionOptions {
  database: string
  username?: string
  password?: string
  host?: string
  port?: number
  poolSize?: number
}

export interface ModelCreateOptions {
  data: Record<string, unknown>
}

export interface ModelFindOptions {
  where?: Record<string, unknown> & {
    $OR?: Record<string, unknown>
    $IN?: Record<string, unknown[]>
  }
  select?: string[]
}
