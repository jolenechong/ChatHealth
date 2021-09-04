const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

//get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  

const socket = io();

//join chatroom
socket.emit('joinRoom', {username, room})

// get room and users
socket.on('roomUsers',({room, users}) => {
    outputRoomName(room);
    outputUsers(users)
})

// message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message)

  //scoll down when theres a new message
  chatMessages.scrollTop = chatMessages.scrollHeight
});


// message submit
chatForm.addEventListener('submit', (e) => {
    //prevent default behaviour which is to send a file
    e.preventDefault();

    // get message 
    const msg = e.target.elements.msg.value

    //emit message to server
    socket.emit('chatMessage', msg)

    //clear input after submitting message to server
    e.target.elements.msg.value = ""
    e.target.msg.focus()

})

//output message to DOM
function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class='meta'>${message.username} <span>${message.time}</span></p><p class='text'>${message.text}</p>`
    document.querySelector('.chat-messages').appendChild(div)
}

//  adding room name to DOM
function outputRoomName(room) {
    roomName.innerText = room
}

// add users to DOM
function outputUsers(users) {
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join("")}`
}





// Open and close menu
function openMenu() {
    const menuBtn = document.querySelector('#mainMenu')
    const menuContainer = document.querySelector('#menuContainer')

    menuBtn.classList.toggle('fa-ellipsis-v')
    menuBtn.classList.toggle('fa-times')
    menuContainer.classList.toggle('show')
}