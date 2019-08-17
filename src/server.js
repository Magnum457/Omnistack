const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const routes = require('./routes')

// servidor
const httpServer = express()
const server = require('http').Server(httpServer)
const io = require('socket.io')(server)

const connectedUser = {}

io.on('connection', socket => {
    const { user } = socket.handshake.query

    console.log(user, socket.id)

    connectedUser[user] = socket.id
})

// conexao com o banco de dados
mongoose.connect('mongodb+srv://Magnum2:123bcw@cluster0-ftmkt.mongodb.net/omnistack8?retryWrites=true&w=majority', {
    useNewUrlParser: true
})

// middleware para passagem de parametros
httpServer.use((req, res, next) => {
    req.io = io
    req.connectedUser = connectedUser

    return next()
})


// chamada das rotas(json)
httpServer.use(cors())
httpServer.use(express.json())
httpServer.use(routes)

// chamada na porta: 
server.listen(3333)