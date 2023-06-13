class Player 
{
	constructor(name, socket)
	{
		this.name = name;
		this.socket = socket;
		this.opponentSocket = null;
		this.secondPlayer = false;
	}
}


module.exports = { Player };