import { flames, DataTypes } from "../mod.ts"

const config = {
  dialect: "postgres",
  connection: {
    username: "postgres",
    password: "root",
    database: "norva",
    host: "localhost",
    port: 5432,
    poolSize: 2,
  },
}

await flames.connect(config)

flames.define("User", {
  table: "users",
  columns: {
    id: { type: DataTypes.INTEGER, autoIncrement: true },
    name: { type: DataTypes.STRING },
  },
})

await flames.sync()

const user = await flames.user.create({ name: "Abdulrahman" })
console.log(user)
