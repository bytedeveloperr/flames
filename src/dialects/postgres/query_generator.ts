import type { Flames } from "../../flames.ts"
import { DataTypes, ColumnAttribute } from "../../types.ts"

export class QueryGenerator {
  public flames: Flames

  constructor(flames: Flames) {
    this.flames = flames
  }

  tableExistsQuery(table: string) {
    const schema = "public"
    return `SELECT * FROM information_schema.tables WHERE table_schema = '${schema}' AND table_name = '${table}';`
  }

  public createTableQuery(table: string, columns: any) {
    const arr: string[] = []
    let prep = ``

    for (const name in columns) {
      const column = columns[name]

      arr.push(this.makeColumnQueryLine(name, column))

      if (column.type === DataTypes.UUID) {
        const query = this._createExtensionQuery(DataTypes.UUID)

        if (!prep.includes(query)) {
          prep += `${query}`
        }
      }
    }

    return `${prep}CREATE TABLE ${table} (${arr.join(",").trim()});`
  }

  public insertQuery(table: string, values: any, columns: { [key: string]: ColumnAttribute }) {
    const output: {
      args: string[]
      columns: string[]
      placeholders: string[]
    } = {
      args: [],
      columns: [],
      placeholders: [],
    }

    let index = 1
    for (const key in columns) {
      const column = columns[key]

      if (!column.autoIncrement) {
        output.columns.push(key)
        output.args.push(values[key])
        output.placeholders.push(`$${index++}`)
      }
    }

    return {
      args: output.args,
      query: `INSERT INTO ${table} (${output.columns.join(",")}) VALUES (${output.placeholders.join(
        ","
      )}) RETURNING *;`,
    }
  }

  public makeColumnQueryLine(name: string, column: ColumnAttribute) {
    const _null = !column.nullable ? "NOT NULL" : undefined
    const _unique = column.unique ? "UNIQUE" : undefined
    const _primaryKey = column.primaryKey ? "PRIMARY KEY" : undefined
    const _autoIncrement = column.autoIncrement ? "SERIAL" : undefined
    const _default = column.default ? this._genDefault(column.default) : undefined

    let line = ` ${name}`

    switch (column.type) {
      case DataTypes.STRING:
        line += ` VARCHAR(${column.length || 255})`
        break
      case DataTypes.UUID:
        line += ` UUID`
        break
      case DataTypes.BOOLEAN:
        line += ` BOOLEAN`
        break
      case DataTypes.INTEGER:
        line += ` ${_autoIncrement || "INTEGER"}`
        break
      case DataTypes.TEXT:
        line += ` TEXT${column.length ? `(${column.length})` : ""}`
        break
      case DataTypes.DECIMAL:
        line = ` DECIMAL(${column.precision}, ${column.scale})`
        break
      case DataTypes.TIMESTAMP:
        line = ` TIMESTAMP`
        break
      default:
        throw new Error("Data type is not supported")
    }

    if (_primaryKey) line += ` ${_primaryKey}`
    if (_default) line += ` DEFAULT ${_default}`
    if (_unique) line += ` ${_unique}`
    if (_null) line += ` ${_null}`

    return line
  }

  private _genDefault(value: string | number | boolean | object) {
    if (value instanceof Date) {
      return `'${value.toISOString()}'`
    }

    switch (typeof value) {
      case "string":
        return `'${value}'`
      case "boolean":
        return `'${value ? 1 : 0}'`
      case "number":
        return `'${value}'`
      case "object":
        return `'${JSON.stringify(value)}'`
      default:
        return ""
    }
  }

  private _createExtensionQuery(extension: string) {
    switch (extension) {
      case "UUID":
        return `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; \n`
      default:
        throw new Error(`Extension for ${extension} not supported`)
    }
  }
}
