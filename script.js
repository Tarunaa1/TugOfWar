document.querySelector(".rope-container").style.display="none";
document.getElementById("finding").style.display="none";
const socket = io();
let teamname;
document.getElementById("enter").addEventListener("click",function(){
    teamname = document.getElementById("name").value;
    document.getElementById("team1").innerText = teamname;

    if(teamname == null || teamname ==""){
        alert("Please enter a name");

    }
    else{
        socket.emit("enter",{teamname:teamname})
        document.getElementById("finding").style.display="block";
        document.getElementById("enter").disabled=true;
    }
})


socket.on('enter', (e) => {
    let allplayers = e.allplayers;
    console.log("html", allplayers);
    if (teamname !== '') {
        document.getElementById("finding").style.display = "none";
        document.querySelector(".rope-container").style.display = "flex";
    }
    
    let team2;
    const foundObj = allplayers.find(obj => obj.p1.p1name === teamname || obj.p2.p2name === teamname);
    
    if (foundObj) {
        foundObj.p1.p1name === teamname ? team2 = foundObj.p2.p2name : team2 = foundObj.p1.p1name;
        document.getElementById("team2").innerText = team2;
    } else {
        alert("No matching team found.");
    }
});



document.querySelector(".g").addEventListener("click", () => {
        socket.emit("buttonClicked", { team: teamname }); 
});

socket.on("updateRope", (data) => {
    let playerdata = data.allplayers;
    console.log(playerdata);
    if(playerdata[0].p1.p1name == teamname){
        document.getElementById("rope1").style.width = `${playerdata[0].p1.p1value}%`;
    document.getElementById("rope2").style.width = `${playerdata[0].p2.p2value}%`;
    }
    else{
        document.getElementById("rope2").style.width = `${playerdata[0].p1.p1value}%`;
    document.getElementById("rope1").style.width = `${playerdata[0].p2.p2value}%`;
    }
    
    
});


























