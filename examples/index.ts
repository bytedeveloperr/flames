import { flames } from "../mod.ts"

await flames.connect()

flames.define("User", {
  table: "users",
  columns: {
    id: { type: "integer", generated: true },
    name: { type: "varchar" },
  },
})

// const user = await flames.user.create({ name: "Abdulrahman" })
// console.log(user)

const users = await flames.user.find({ where: { name: "Abdulrahman" } })
console.log(users)

// twitter: undefined,
//     face: "Book",
//     $IN: { name: ["Baah", "Huuba", "Liii"], email: ["w@kl.d", "dje.d@el.e"] },
//     $OR: { name: "AB", id: 5, c: "lll" },
