class Qb {
  private _table = ""
  private _selects = []
  private _where = ""

  public table(name: string) {
    this._table = name
    return this
  }

  public select() {
    return this
  }

  public where(column: string, value: any) {
    this._where += `${column} = ${value}`
    return this
  }

  // public addWhere()
}

const qb = new Qb()

const query = qb.table("users").select().where("user", "ll")
