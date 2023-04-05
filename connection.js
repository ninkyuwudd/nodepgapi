const {Client} = require('pg')

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "beginer1383",
    database: "apitestdata"
})

module.exports = client