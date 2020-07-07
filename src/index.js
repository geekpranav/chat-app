const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generatemessage } = require('./utils/messages')
const { generatelocationmessage }= require('./utils/messages')
const {  addUser,
           getUser,
           getusersinroom,
                removeuser  } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)


const port = 3000 || process.env.PORT

const publicdirname = path.join( __dirname,'../public')


app.use(express.static(publicdirname))


const welcome="welcome to your node.js based chat appliacation"

io.on('connection',(socket)=>{
    console.log('new web socket connection established sucessfully')

 

    socket.on('join',({username,room},callback)=>{

        const {error,user}=addUser({id:socket.id,username,room})
        if(error){
           return callback(error)
        }
        socket.join(user.room)

        
      socket.emit('message',generatemessage(welcome))
      socket.broadcast.to(user.room).emit('message',generatemessage(` glad to have you on our chat room ${user.username} `))
      io.to(user.room).emit('userdata',{
          room:user.room,
          users:getusersinroom(user.room)
      })

      callback()

    })



    socket.on('sendmessage', (value,callback)=>{
        const user = getUser(socket.id)

        const filter = new Filter()
        if(filter.isProfane(value)){
            return callback('profanity will not be tolerated')

        }




        io.to(user.room).emit('message',generatemessage(user.username, value))
        callback()

    })

    socket.on('sendlocation',(coords,callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationmessage',generatelocationmessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', ()=>{
        const user = removeuser(socket.id)
        if(user){
            io.to(user.room).emit('message',generatemessage( `${user.username} has left our Node based chat engine`))
            io.to(user.room).emit('userdata',{
                room:user.room,
                users:getusersinroom(user.room)
            })
        }




      
    })
})

server.listen(port,()=>{
    console.log(`the app is live and running on stark ${port} mr.jarvis `)
})
