let playerName;

function createPlayer() {
	playerName = "player";
	if (document.querySelector(".name").value !== "")
		playerName = document.querySelector(".name").value;

	socket.emit("add player", playerName);

	game.changeState("GAME_WAITING");
}

socket.on("player joined", ({ name, turn }) => {
	game.turn = true;
	game.save = turn;
	
	if (turn) game.symbol = "X";
	else game.symbol = "O";

	game.socket = socket;

	game.playerName = playerName;
	game.adversaryName = name;

	game.play(playerName, name);

	if (game.symbol == "O") {
		game.socket.on("tie", (d) => {
			const squares = [
				...document.getElementsByClassName("item"),
			];
			game.turn = game.save;

			clearBoard(squares);
		});

		game.socket.on("win", (d) => {
			const squares = [
				...document.getElementsByClassName("item"),
			];

			const computerScore =
				document.querySelector(".computer-score");

			game.turn = game.save;

			if (checkWin(squares)) {
				const computerScore =
					document.querySelector(".computer-score");

				updateScore(computerScore);

				if (parseInt(computerScore.innerHTML) == 5) {
					const playerScore =
						document.querySelector(".player-score");

					let obj = new Object();

					obj["status"] = 0;

					obj[game.playerName] = parseInt(
						playerScore.innerHTML
					);

					obj[game.adversaryName] = 5;

					localStorage.setItem(
						"count",
						(
							parseInt(
								localStorage.getItem("count")
							) + 1
						).toString()
					);
					localStorage.setItem(
						localStorage.getItem("count"),
						JSON.stringify(obj)
					);

					
					game.changeState("GAME_LOST");
				}
				clearBoard(squares);
			}
		});

		game.socket.on("move", (data) => {
			const squares = [
				...document.getElementsByClassName("item"),
			];

			squares.forEach((square, index) => {
				if (index === data.choiceIndex)
					square.innerHTML = "X";
			});

			game.turn = data.turn;
		});
	} else {
		game.socket.on("tie", (d) => {
			const squares = [
				...document.getElementsByClassName("item"),
			];
			game.turn = game.save;
			clearBoard(squares);
		});

		game.socket.on("win", (d) => {
			const squares = [
				...document.getElementsByClassName("item"),
			];

			game.turn = game.save;
			const computerScore =
				document.querySelector(".computer-score");

			if (checkWin(squares)) {
				updateScore(computerScore);

				if (parseInt(computerScore.innerHTML) == 5) {
					const playerScore =
						document.querySelector(".player-score");

					let obj = new Object();

					obj["status"] = 0;
					obj[game.playerName] = parseInt(
						playerScore.innerHTML
					);

					obj[game.adversaryName] = 5;

					localStorage.setItem(
						"count",
						(
							parseInt(
								localStorage.getItem("count")
							) + 1
						).toString()
					);
					localStorage.setItem(
						localStorage.getItem("count"),
						JSON.stringify(obj)
					);

					game.changeState("GAME_LOST");
				}
				clearBoard(squares);
			}
		});

		game.socket.on("move", (data) => {
			const squares = [
				...document.getElementsByClassName("item"),
			];

			squares.forEach((square, index) => {
				if (index === data.choiceIndex)
					square.innerHTML = "O";
			});

			game.turn = data.turn;
		});
	}
});