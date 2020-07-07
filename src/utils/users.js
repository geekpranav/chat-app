const users = []

const addUser = ({id,username,room})=>{
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
    if(!username||!room){
        return {
            error:'you must provide a username anda room id'
        }
    }
    const existingusers = users.find((user)=>{
        return  user.room===room && user.username===username  
    })
    if(existingusers){
        return {
            error:'username already exists'
        }
    }
    const user = {id,username,room}
    users.push(user)
    return {user}
}

const removeuser = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id === id

    })
    if(index!== -1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id) => {
    return users.find((user)=> user.id===id

    )

}

const getusersinroom = (room)=>{
    return users.filter((user)=> user.room === room)
}

module.exports={
    addUser,
    getUser,
    getusersinroom,
    removeuser
}








