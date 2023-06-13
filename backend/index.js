const express = require('express');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const { Player }  = require('./classes/player');
const app = express();
const server = app.listen(3000);
const io = new Server(server, { cors: { origin: '*' } });

let playersNotPaired = [];
// const jsonParser = bodyParser.json()
app.use(bodyParser.urlencoded({ extended: true })); 

app.post("/post", (req, res) => {
	console.log(req.body);
});

io.on('connection', (socket) => {
	socket.on('add player', (playerName) => {
		playersNotPaired.push(new Player(playerName, socket));

		
		
		if (playersNotPaired.length == 2)
		{
			
			socket.adversaryPlayer = playersNotPaired[0];
			socket.player          = playersNotPaired[1];
			
			playersNotPaired[0].socket.player = playersNotPaired[0];
			playersNotPaired[0].socket.adversaryPlayer = playersNotPaired[1];
			
			playersNotPaired = playersNotPaired.splice(1, 0);
			playersNotPaired = playersNotPaired.splice(1, 0);

			
			
			socket.adversaryPlayer.socket.emit('player joined', { 
				name : socket.player.name,
				turn : true
			});

			socket.emit('player joined', {
				name : socket.adversaryPlayer.name, 
				turn : false 
			});
		}
	});

	socket.on('move', (data) => {
		
		socket.adversaryPlayer.socket.emit('move', data);
	});

	socket.on("round", (round) => {
		socket.adversaryPlayer.socket.emit("round", round);
	})

	socket.on('win', (d) => {
		socket.adversaryPlayer.socket.emit("win", 1);
	});

	socket.on("tie", () => {
		socket.adversaryPlayer.socket.emit("tie", 1);
	})
});
