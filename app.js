const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
require('dotenv').config()

var io = require('socket.io')(server)

app.use(express.static("App"))

app.get("/",(req,res) => {
    res.sendFile(__dirname + "/App/index.html")
})

io.on('connect', socket => {
    console.log('Client connected');
    socket.on('comment', (data) => {
      socket.broadcast.emit('remoteComment', data);
    });
  });
  
const PORT = process.env.PORT

server.listen(PORT, 
  console.log(`Server Runnig at PORT: ${PORT}`)
)


