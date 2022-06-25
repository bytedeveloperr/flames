import type { Flames } from "../../flames.ts"
import { ColumnAttribute, ModelFindOptions } from "../../types.ts"

export class PostgresQueryGenerator {
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

      if (column.type === "uuid") {
        const query = this._createExtensionQuery("uuid")

        if (!prep.includes(query)) {
          prep += `${query}`
        }
      }
    }

    return `${prep}CREATE TABLE ${table} (${arr.join(",").trim()});`
  }

  public insertQuery(table: string, values: any, columns: { [key: string]: ColumnAttribute }) {
    const args: {
      params: any[]
      columns: string[]
      placeholders: string[]
    } = {
      params: [],
      columns: [],
      placeholders: [],
    }

    let index = 1
    for (const key in columns) {
      const column = columns[key]

      if (!column.generated) {
        args.columns.push(key)
        args.params.push(values[key])
        args.placeholders.push(`$${index++}`)
      }
    }

    return {
      params: args.params,
      sql: `INSERT INTO ${table} (${args.columns.join(",")}) VALUES (${args.placeholders.join(",")}) RETURNING *;`,
    }
  }

  public findQuery(table: string, data: ModelFindOptions) {
    let where = ""

    const select: string[] = Array.isArray(data.select) ? data.select : ["*"]

    if (data.where) {
      for (const key in data.where) {
        const value = data.where[key]

        if (key === "$OR" && value && typeof value === "object") {
          let or = ""
          for (const k in value) {
            or += `${!!or ? " OR" : ""} ${k} = '${value[k as keyof typeof value]}'`
          }

          where += `${!!where ? " AND" : ""} ${or}`
        } else if (key === "$IN" && value && typeof value === "object") {
          for (const k in value) {
            where += `${!!where ? " AND" : ""} ${k} IN (${(value[k as keyof typeof value] as string[]).join(", ")})`
          }
        } else if (!value) {
          where += `${!!where ? " AND" : ""} ${key} IS NULL`
        } else {
          where += `${!!where ? " AND" : ""} ${key} = '${value}'`
        }
      }
    }

    return {
      sql: `SELECT ${select.join(", ")} FROM ${table}  ${!!where ? "WHERE " + where : ""}`,
    }
  }

  public makeColumnQueryLine(name: string, column: ColumnAttribute) {
    const _null = !column.nullable ? "NOT NULL" : undefined
    const _unique = column.unique ? "UNIQUE" : undefined
    const _primaryKey = column.primary ? "PRIMARY KEY" : undefined
    const _default = column.default ? this._genDefault(column.default) : undefined

    let line = ` ${name}`

    switch (column.type) {
      case "varchar":
        line += ` VARCHAR(${column.length || 255})`
        break
      case "uuid":
        line += ` UUID`
        break
      case "boolean":
        line += ` BOOLEAN`
        break
      case "integer":
        line += ` ${column.generated ? "SERIAL" : "INTEGER"}`
        break
      case "text":
        line += ` TEXT${column.length ? `(${column.length})` : ""}`
        break
      case "decimal":
        line = ` DECIMAL(${column.precision}, ${column.scale})`
        break
      case "timestamp":
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
      case "uuid":
        return `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; \n`
      default:
        throw new Error(`Extension for ${extension} not supported`)
    }
  }
}
