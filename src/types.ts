import type { Flames } from "./flames.ts"

export enum DataTypes {
  TEXT = "TEXT",
  UUID = "UUID",
  STRING = "STRING",
  INTEGER = "INTEGER",
  BOOLEAN = "BOOLEAN",
  DECIMAL = "DECIMAL",
  TIMESTAMP = "TIMESTAMP",
}

export interface ColumnAttribute {
  type: string
  nullable?: boolean
  unique?: boolean
  primaryKey?: boolean
  autoIncrement?: boolean
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

export interface FlamesConnectionOptions {
  dialect: string
  connection: {
    database: string
    username?: string
    password?: string
    host?: string
    port?: number
    poolSize: number
  }
}

export interface DefineModelConfig {
  table?: string
  columns: { [key: string]: ColumnAttribute }
}

export interface FlamesConfig {
  dialect?: string
  database?: string
}
