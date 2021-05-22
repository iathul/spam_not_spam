const express = require('express')
const app = express()
require('dotenv').config()

app.use(express.static("App"))

app.get("/",(req,res) => {
    res.sendFile(__dirname + "/App/index.html")
})

const PORT = process.env.PORT

app.listen(PORT, 
    console.log(`Server Runnig at PORT: ${PORT}`)
)


