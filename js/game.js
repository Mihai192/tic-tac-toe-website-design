let game = (
	function() {
		const root = document.getElementById('root');

		const gameStates = {
			"GAME_MENU" : 
				`
				<div class="menu">
					<h1> Tic Tac toe </h1> 
					<ul> 
						<li> <button onclick=game.play()> Play </button> </li>
						<li> <button onclick=game.scoreboard()> Score Board </button> </li> 
						<li> <a href="index.html"><button> Return To Main Website </button> </a> </li> 
					</ul>
				</div>
				`,
			"GAME_PLAY" : 
				`
				<div class="game">
					<h1> Tic Tac Toe </h1>

					<div class="score">
						<div> 
							<p>You</p>
							<span class="player-score">0</span>
						</div>
						<div> 
							<p>Computer</p>
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
				`
		};
		
		function Canvas()
		{

		}

		Canvas.prototype.draw = function(root, gameState, state) {
			root.innerHTML = gameState[state];
		}
	
		function Game(root, gameStates, startingState)
		{
			this.root = root;
			this.gameStates = gameStates;

			this.gameOver   = undefined;
			
			this.state = startingState;
			
			this.canvas = new Canvas();

			

			changeTitle(this.state);
			this.draw();
		}
		
		function checkLine(squares, l)
		{
			if (squares[l].innerHTML == squares[l + 1].innerHTML
				&& squares[l + 1].innerHTML == squares[l + 2].innerHTML
				&& squares[l].innerHTML != '')
				return true;
			
			return false;
		}

		function checkColumn(square, c)
		{
			if (square[c].innerHTML == square[c + 3].innerHTML
				&& square[c + 3].innerHTML == square[c + 6].innerHTML
				&& square[c].innerHTML != '')
			return true;
			
			return false;		
		}

		function checkWin(squares)
		{
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

		function placeO(squares)
		{
			let placed = false;

			squares.forEach((square) => {
				if (square.innerHTML == '' && !placed)
				{
					square.innerHTML = 'O';
					placed = true;
				}
			});

			squares.forEach((square) => {
				square.style.pointerEvents = "auto";
			});
		}

		function clearBoard(squares) {
			squares.forEach((square) => {
				square.innerHTML = '';
			});
		}
		
		function updateScore(score)
		{
			score.innerHTML = parseInt(score.innerHTML) + 1; 
		}

		function checkFullBoard(squares)
		{
			let fullBoard = true;
			squares.forEach((square) => {
				if (square.innerHTML == '')
					fullBoard = false;
			});

			return fullBoard;
		}

		function changeTitle(state)
		{
			switch(state)
			{
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

		Game.prototype.changeState = function(newState) {
			this.state = newState;
			this.draw();

			changeTitle(this.state);
		}	

		Game.prototype.draw = function() {
			this.canvas.draw(this.root, this.gameStates, this.state);
		}

		Game.prototype.menu = function() {
			this.changeState("GAME_MENU");
		}

		Game.prototype.scoreboard = function() {
			this.changeState("SCORE_BOARD");
			const scoreboard = document.querySelector('.score-board');

			console.log(scoreboard);
			console.log(localStorage.getItem('count') );

			if (localStorage.getItem('count') == "0")
			{
				const li = document.createElement('li');
				li.innerHTML = "Hi... seems like there are no matches here ¯\\_(ツ)_/¯. Come back later after you have played some games.";
				
				console.log('hi');
				scoreboard.appendChild(li);
			}
			else
			{
				const count = localStorage.getItem('count');
				const li = document.createElement('li');
				for (let i = 1; i <= count; ++ i)
				{
					const liCopy = li.cloneNode();
					const obj    = JSON.parse(localStorage.getItem(i));
					liCopy.innerHTML += obj.status ? "Win" : "Lose";
					liCopy.innerHTML += `: You(${obj.playerScore}) - `;
					liCopy.innerHTML += `Computer(${obj.computerScore})`;

					scoreboard.appendChild(liCopy);
				}
			}
		}

		Game.prototype.play = function(event) {
			this.changeState("GAME_PLAY");
		}

		Game.prototype.addValue = function(event) {
			if (event.target.innerHTML == '')
			{
				event.target.innerHTML = 'X';
				
				const squares = [...document.getElementsByClassName('item')];

				squares.forEach((square) => {
					square.style.pointerEvents = "none";
				});

				if ( checkWin(squares) )
				{
					const playerScore = document.querySelector('.player-score');
										
					updateScore(playerScore);

					if (parseInt(playerScore.innerHTML) == 5)
					{
						const computerScore = document.querySelector('.computer-score');

						const obj = {
							status : 1,
							playerScore : parseInt(playerScore.innerHTML),
							computerScore : parseInt(computerScore.innerHTML)
						};


						console.log(localStorage.getItem('count'));

						localStorage.setItem('count', ( parseInt(localStorage.getItem('count')) + 1 ).toString() );
						localStorage.setItem(localStorage.getItem('count'),  JSON.stringify(obj));

						this.changeState("GAME_WON");
						return;
					}

					clearBoard(squares);
	
					squares.forEach((square) => {
						square.style.pointerEvents = "auto";
					});

					return;
				}

				if (checkFullBoard(squares))
				{
					clearBoard(squares);

				
					squares.forEach((square) => {
						square.style.pointerEvents = "auto";
					});

					return;
				}

				placeO(squares);

				if ( checkWin(squares) )
				{
					const computerScore = document.querySelector('.computer-score');
					
					updateScore(computerScore);

					if (parseInt(computerScore.innerHTML) == 5)
					{
						const playerScore = document.querySelector('.player-score');

						const obj = {
							status : 0,
							playerScore : parseInt(playerScore.innerHTML),
							computerScore : parseInt(computerScore.innerHTML)
						};

						localStorage.setItem('count', ( parseInt(localStorage.getItem('count')) + 1 ).toString() );
						localStorage.setItem(localStorage.getItem('count'),  JSON.stringify(obj));

						this.changeState("GAME_LOST");
						return;
					}

					clearBoard(squares);
				}
			}
		}

		return new Game(root, gameStates, "GAME_MENU");
	}
)();


