// server.js
const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const app = express();


// Create HTTP server
const server = http.createServer(app);

// Set up Socket.IO
const io = new Server(server);
app.use(express.static(path.resolve("")));
 
app.get("/",(req,res)=>{
    return res.sendFile("index.html");
})
let arr=[];
let playarr = [];
let ropeWidth1 = 50;
let ropeWidth2 = 50;
io.on('connection', (socket) => {
  console.log('New client connected');



  // Listen for game updates and broadcast to both teams
  socket.on("enter", (data) => {
    if(data.teamname != null){
        arr.push(data.teamname);
        if(arr.length >= 2){
            let p1obj = {
                p1name: arr[0],
                p1value: 50,
            }
            let p2obj = {
                p2name: arr[1],
                p2value: 50,
            }
            let obj = {
                p1: p1obj,
                p2: p2obj
            }
            playarr.push(obj);
            arr.splice(0, 2);
            io.emit("enter", { allplayers: playarr });
        }
    }
});


socket.on("buttonClicked", (data) => {
    if (data.team === playarr[0].p1.p1name) {
        console.log("I am from team 1");
        
        playarr[0].p1.p1value += 10;
        playarr[0].p2.p2value -= 10;
        if (playarr[0].p1.p1value > 100) playarr[0].p1.p1value = 100;
        if (playarr[0].p2.p2value < 0) playarr[0].p2.p2value = 0;
    } else if (data.team === playarr[0].p2.p2name) {
        playarr[0].p1.p1value -= 10;
        playarr[0].p2.p2value += 10;
        if (playarr[0].p2.p2value > 100) playarr[0].p2.p2value = 100;
        if (playarr[0].p1.p1value < 0) playarr[0].p1.p1value = 0;
    }

    // Broadcast updated widths to all connected clients
    io.emit("updateRope", { allplayers: playarr});
});
});



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})