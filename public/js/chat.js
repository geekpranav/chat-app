const socket = io()
const $msg = document.querySelector('#msg')
const $msginput = $msg.querySelector('input')
const $msgbutton = $msg.querySelector('button')
const $location = document.querySelector('#location')
const $messages = document.querySelector('#messages')

const messagetemplate = document.querySelector('#message-template').innerHTML
const locationtemplate = document.querySelector("#location-template").innerHTML
const sidebartemplate = document.querySelector('#sidebar-template').innerHTML

const {username,room } = Qs.parse(location.search,{ ignoreQueryPrefix : true}) 

const autoscroll = ()=>{
    const $latestmessage = $messages.lastElementChild
    
    const latestmessagestyles = getComputedStyle($latestmessage)
    const latestmessagemargin = parseInt(latestmessagestyles.marginBottom)
    const latestmessagehieght=$latestmessage.offsetHeight + latestmessagemargin

    const visiblehieght = $messages.offsetHeight

    const containerhieght = $messages.scrollHeight

    const scrolloffset = $messages.scrollTop + visiblehieght

    if(containerhieght-latestmessagehieght <= scrolloffset){
        $messages.scrollTop = $messages.scrollHeight

    }

}





socket.on('message',(welcome)=>{
    console.log(welcome)
    const html = Mustache.render(messagetemplate,{
        message:welcome.text,
        username:welcome.username,
        createdAt:moment(welcome.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()

})

socket.on('locationmessage', (message)=>{
    console.log(message)
    const html = Mustache.render(locationtemplate,{
        url:message.url,
        username:message.username,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()

})

socket.on('userdata',({users,room})=>{
    const hype = Mustache.render(sidebartemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=hype
})







$msg.addEventListener('submit', (e)=>{
    e.preventDefault()

    $msgbutton.setAttribute('disabled','disabled')

    const value = e.target.elements.message.value

    socket.emit('sendmessage',value,(error)=>{
        $msgbutton.removeAttribute('disabled')
        $msginput.value=''
        $msginput.focus()
        if(error){
            return console.log(error)
        }



        console.log('data transfer sucessfull')
    })
})

$location.addEventListener('click', ()=>{
    if(!navigator.geolocation){
        return alert('your browser does not support this feature!')
    }

    $location.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        
        socket.emit('sendlocation', {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude

        },()=>{
            $location.removeAttribute('disabled')
            console.log('location info passed sucessfully !')
        })

    })

    
})

socket.emit('join',{username,room}, (error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }

})
