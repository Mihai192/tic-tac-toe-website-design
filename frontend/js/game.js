function checkLine(squares, l) {
	if (squares[l].innerHTML == squares[l + 1].innerHTML
		&& squares[l + 1].innerHTML == squares[l + 2].innerHTML
		&& squares[l].innerHTML != '')
		return true;

	return false;
}

function checkColumn(square, c) {
	if (square[c].innerHTML == square[c + 3].innerHTML
		&& square[c + 3].innerHTML == square[c + 6].innerHTML
		&& square[c].innerHTML != '')
		return true;

	return false;
}

function checkWin(squares) {
	if (squares[0].innerHTML == squares[4].innerHTML
		&& squares[4].innerHTML == squares[8].innerHTML && squares[0].innerHTML != '')
		return true;

	if (squares[2].innerHTML == squares[4].innerHTML
		&& squares[4].innerHTML == squares[6].innerHTML && squares[2].innerHTML != '')
		return true;



	if (checkLine(squares, 0) || checkLine(squares, 3) || checkLine(squares, 6))
		return true;

	if (checkColumn(squares, 0) || checkColumn(squares, 1) || checkColumn(squares, 2))
		return true;

	return false;
}


function updateScore(score) {
	score.innerHTML = parseInt(score.innerHTML) + 1;
}

function checkFullBoard(squares) {
	let fullBoard = true;
	squares.forEach((square) => {
		if (square.innerHTML == '')
			fullBoard = false;
	});

	return fullBoard;
}

function changeTitle(state) {
	switch (state) {
		case 'GAME_MENU':
			{
				document.title = "Tic Tac Toe - Gamemenu";
				break;
			}
		case 'GAME_PLAY':
			{
				document.title = "Tic Tac Toe - Game";
				break;
			}
		case 'GAME_WON':
			{
				document.title = "Tic Tac Toe - Win";
				break;
			}
		case 'GAME_LOSE':
			{
				document.title = "Tic Tac Toe - Lose";
				break;
			}
		case 'SCORE_BOARD':
			{
				document.title = "Tic Tac Toe - Scoreboard";
				break;
			}
	}
}
function clearBoard(squares) {
	squares.forEach((square) => {
		square.innerHTML = '';
	});
}


let game = (
	function () {
		const root = document.getElementById('root');

		const gameStates = {
			"GAME_MENU":
				`
				<div class="menu">
					<h1> Tic Tac toe </h1> 
					<ul> 
						<li> <button onclick=game.join()> Play </button> </li>
						<li> <button onclick=game.scoreboard()> Score Board </button> </li> 
						<li> <a class="btn" href="index.html">Return To Main Website</a> </li> 
					</ul>
				</div>
				`,
			"GAME_PLAY":
				`
				<div class="game">
					<h1> Tic Tac Toe </h1>

					<div class="score">
						<div> 
							<p>$you</p>
							<span class="player-score">0</span>
						</div>
						<div> 
							<p>$adversary</p>
							<span class="computer-score">0</span>
						</div>
					</div>

					
					<div class="grid">
						<div class="item" onclick="game.addValue(event)"></div>
						<div class="item" onclick="game.addValue(event)"></div>
						<div class="item" onclick="game.addValue(event)"></div>

						<div class="item" onclick="game.addValue(event)"></div>
						<div class="item" onclick="game.addValue(event)"></div>
						<div class="item" onclick="game.addValue(event)"></div>

						<div class="item" onclick="game.addValue(event)"></div>
						<div class="item" onclick="game.addValue(event)"></div>
						<div class="item" onclick="game.addValue(event)"></div>
					</div>
					
				</div>
				`,
			"GAME_WON":
				`
					<div class="game-end">
						<h1>You won!</h1>
						<ul>
							<li><button onclick="game.play()"> Play again ? </button></li>
							<li><button onclick="game.menu()"> Return to main menu </button></li>
						</ul>
					</div>
				`,
			"GAME_LOST":
				`
				<div class="game-end">
					<h1>You lost!</h1>
					<ul>
						<li><button onclick="game.play()"> Play again ? </button></li>
						<li><button onclick="game.menu()"> Return to main menu </button></li>
					</ul>
				</div>
				`,
			"SCORE_BOARD":
				`
				<div class="score-board-wrapper">
					<h1>Score Board</h1>
					<ul class="score-board"></ul>
					<div>
						<button onclick="game.menu()"> Return to main menu </button>
					</div>
				</div>
				`,
			"GAME_JOIN":
				`
				<div>
					<div>
						<h1> Choose Name: </h1>
						<div style="display:flex;flex-direction:column;">
							<input class="name" type="text" style="padding:10px">
							<button onclick="createPlayer()">Join</button>
						</div>
					</div>
				</div>
				`,
			"GAME_WAITING":
				`<div>
					<h1>Waiting for a player...It may take a while</h1>
				</div>
				`
		};

		function Canvas() {

		}

		Canvas.prototype.draw = function (root, gameState, state) {
			root.innerHTML = gameState[state];
		}

		function Game(root, gameStates, startingState) {
			this.root = root;
			this.gameStates = gameStates;

			this.gameOver = undefined;

			this.state = startingState;
			this.round = 1;

			this.canvas = new Canvas();



			changeTitle(this.state);
			this.draw();
		}



		function placeOpponent(squares) {
			let placed = false;



			squares.forEach((square) => {
				if (square.innerHTML == '' && !placed) {
					square.innerHTML = 'O';
					placed = true;
				}
			});

			squares.forEach((square) => {
				square.style.pointerEvents = "auto";
			});
		}



		Game.prototype.changeState = function (newState) {
			this.state = newState;
			this.draw();

			changeTitle(this.state);
		}

		Game.prototype.draw = function () {
			this.canvas.draw(this.root, this.gameStates, this.state);
		}

		Game.prototype.join = function () {
			this.changeState("GAME_JOIN");
		}

		Game.prototype.menu = function () {
			this.playName = "";
			this.adversaryName = "";
			this.changeState("GAME_MENU");
		}

		Game.prototype.sendCode = function (socket, code) {
			socket.emit("generate code", code);
		}

		Game.prototype.generateCode = function () {
			let result = '';
			let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			let charactersLength = characters.length;
			for (let i = 0; i < 30; i++)
				result += characters.charAt(Math.floor(Math.random() * charactersLength));

			document.querySelector('.code-section').innerHTML = result;


		}

		Game.prototype.scoreboard = function () {
			this.changeState("SCORE_BOARD");
			const scoreboard = document.querySelector('.score-board');

			console.log(scoreboard);
			console.log(localStorage.getItem('count'));

			if (localStorage.getItem('count') == "0") {
				const li = document.createElement('li');
				li.innerHTML = "Hi... seems like there are no matches here ¯\\_(ツ)_/¯. Come back later after you have played some games.";

				console.log('hi');
				scoreboard.appendChild(li);
			}
			else {
				const count = localStorage.getItem('count');
				const li = document.createElement('li');
				for (let i = 1; i <= count; ++i) {
					const liCopy = li.cloneNode();
					const obj = JSON.parse(localStorage.getItem(i));
					console.log(obj);
					liCopy.innerHTML += obj.status ? "Win" : "Lose";

					let keys = Object.keys(obj);

					if (obj[keys[1]] == 5) {
						liCopy.innerHTML += `: ${keys[1]}(${obj[keys[1]]}) - `;
						liCopy.innerHTML += `${keys[2]}(${obj[keys[2]]})`;
					}
					else {
						liCopy.innerHTML += `: ${keys[2]}(${obj[keys[2]]}) - `;
						liCopy.innerHTML += `${keys[1]}(${obj[keys[1]]})`;
					}

					scoreboard.appendChild(liCopy);
				}
			}
		}

		Game.prototype.play = function (name1, name2) {
			this.gameStates["GAME_PLAY"] = this.gameStates["GAME_PLAY"].replace('$you', name1);
			this.gameStates["GAME_PLAY"] = this.gameStates["GAME_PLAY"].replace('$adversary', name2);

			this.changeState("GAME_PLAY");
		}


		Game.prototype.addValue = function (event) {
			if (event.target.innerHTML === "") // first
			{

				console.log(this.turn, this.symbol);

				if (this.turn && this.symbol === "X") {
					const squares = [...document.getElementsByClassName('item')];

					let choiceIndex;

					squares.forEach((square, index) => {
						if (square === event.target)
							choiceIndex = index;
					});


					event.target.innerHTML = "X";

					this.turn = false;

					this.socket.emit('move', {
						choiceIndex: choiceIndex,
						turn: false
					});

					let win = false;

					if (checkWin(squares)) {
						const playerScore = document.querySelector('.player-score');


						win = true;
						updateScore(playerScore);



						if (parseInt(playerScore.innerHTML) == 5) {
							const computerScore = document.querySelector('.computer-score');

							// const obj = {
							// 	status : 1,
							// 	playerScore : parseInt(playerScore.innerHTML),
							// 	computerScore : parseInt(computerScore.innerHTML)
							// };
							let obj = new Object();

							obj["status"] = 1;
							obj[this.playerName] = parseInt(playerScore.innerHTML);
							obj[this.adversaryName] = parseInt(computerScore.innerHTML);


							localStorage.setItem('count', (parseInt(localStorage.getItem('count')) + 1).toString());
							localStorage.setItem(parseInt(localStorage.getItem('count')), JSON.stringify(obj));


							this.changeState("GAME_WON");

						}
						this.socket.emit('win', 1);

						clearBoard(squares);
					}

					if (!win && checkFullBoard(squares)) {
						this.socket.emit('tie', 0);

						clearBoard(squares);

					}


				}
				else if (!this.turn && this.symbol === "O") {
					const squares = [...document.getElementsByClassName('item')];

					let choiceIndex;

					squares.forEach((square, index) => {
						if (square === event.target)
							choiceIndex = index;
					});

					this.turn = true;
					this.socket.emit('move', {
						choiceIndex: choiceIndex,
						turn: true
					});

					if (this.symbol == "O")
						event.target.innerHTML = "O";


					let win = false;

					if (checkWin(squares)) {
						const playerScore = document.querySelector('.player-score');


						updateScore(playerScore);

						win = true;



						if (parseInt(playerScore.innerHTML) == 5) {
							const computerScore = document.querySelector('.computer-score');

							// const obj = {
							// 	status : 1,
							// 	playerScore : parseInt(playerScore.innerHTML),
							// 	computerScore : parseInt(computerScore.innerHTML)
							// };
							let obj = new Object();

							obj["status"] = 1;
							obj[this.playerName] = parseInt(playerScore.innerHTML);
							obj[this.adversaryName] = parseInt(computerScore.innerHTML);


							localStorage.setItem('count', (parseInt(localStorage.getItem('count')) + 1).toString());
							localStorage.setItem(parseInt(localStorage.getItem('count')), JSON.stringify(obj));


							this.changeState("GAME_WON");
						}

						clearBoard(squares);

						this.socket.emit('win', 0);
					}

					if (!win && checkFullBoard(squares)) {
						this.socket.emit('tie', 0);

						clearBoard(squares);

					}




				}
			}
		}

		return new Game(root, gameStates, "GAME_MENU");
	}
)();


