# Flames

> :warning: This project is still at the early development stage. DO NOT USE !!!

Flames is a Deno ORM for SQL database. built to make database interactions super easy.

### Getting started

To get started, First ensure that you have Deno installed on your machine.

Import the flames module from deno.land

```js
import { flames, DataTypes } from "https://deno.land/x/flames/mod.ts"
```

You can now create a connection to your databases

> NOTE: Only PostgreSQL is supported at the moment

```js
const config = {
  dialect: "postgres",
  connection: {
    username: "username",
    password: "password",
    database: "dbname",
    host: "localhost",
    port: 5432,
    poolSize: 2,
  },
}

await flames.connect(config)
```

Now, you can define your database model

```js
flames.define("User", {
  table: "users",
  columns: {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
})
```

After defining your models, you can now sync them with your database

```js
await flames.sync()
```

Add some data to your database table :grin:

```js
const user = await flames.user.create({ name: "Abdulrahman" })
console.log(user) // { id: 1, name: "Abdulrahman" }
```
