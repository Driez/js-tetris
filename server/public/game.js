
//1.) html display 10x20

class TetrisGame {
	constructor() {
		Object.assign(this, createConstants([
			"BTN_LEFT",
			"BTN_UP",
			"BTN_RIGHT",
			"BTN_DOWN"
		]));

		this.timeout = 5000;
		this.username = "Player";
		this.score = 0;
		this.gameOver = false;
		this.map = new Map(10, 20);
		this.currentBlock = this.generateBlock();
		this.nextBlock = this.generateBlock();
		this.setDropTimeout();
		this.setIo();
	}

	setIo(io) {
		this.io = io;
	}

	scoreFixatedBlocks(n = 1) {
		for(let i = 0; i < n; i++) this.score += Math.floor(10 * Math.pow(1.5, this.level));
	}

	scoreLine(n = 1) {
		for(let i = 0; i < n; i++) this.score += Math.floor(100 * Math.pow(1.5, this.level));
	}

	get level() {
		const levels = [0, 1000, 2500, 4000, 7000, 10000, 20000];
		for(let i = levels.length - 1; i >= 0; i--) {
			if(this.score >= levels[i]) return i;
		}
	}

	handleButton(virtualButton) {
		if(this.gameOver) return;

		switch(virtualButton) {
			case this.BTN_LEFT:
			case this.BTN_RIGHT:
				this.moveBlock(virtualButton);
				break;
			case this.BTN_UP:
				this.rotateBlock();
				break;
			case this.BTN_DOWN:
				this.dropBlock();
				break;
			default:
				throw new Error(`Invalid virtual button ${virtualButton}!`);
		}
		this.io.update();
	}

	moveBlock(button){
		switch(button){
			case this.BTN_LEFT:{
				this.tryMove(() => this.currentBlock.move(-1, 0));
				break;
			}
			case this.BTN_RIGHT:{
				this.tryMove(() => this.currentBlock.move(1, 0));
				break;
			}
		}
	}

	tryMove(moveCallback) {
		const prevStatus = this.currentBlock.getStatus();
		moveCallback();
		if(this.map.checkCollision(this.currentBlock)) {
			this.currentBlock.setStatus(prevStatus);
			return false;
		} else {
			return true;
		}
	}

	generateBlock(){
		const block = new Block(this.getRandomPixels());
		block.coordinates = {
			x: Math.floor((this.map.size.width - block.size.width) / 2),
			y: -block.getFirstNonemptyRow()
		};
		return block;
	}

	getRandomPixels(){
		return BLOCKS[Math.floor(Math.random() * BLOCKS.length)];
	}

	rotateBlock(){
		this.tryMove(() => this.currentBlock.rotate());

	}

	dropBlock(){
		while (this.dropBlockByOne());
	}

	clearDropTimeout() {
		if(this.dropTimeoutId) clearTimeout(this.dropTimeoutId);
		this.dropTimeoutId = null;
	}

	setDropTimeout() {
		this.clearDropTimeout();
		const timeout = 1000 * Math.pow(0.8, this.level);
		this.dropTimeoutId = setTimeout(() => {
			this.dropBlockByOne();
			this.io.update();
		}, timeout);
	}

	dropBlockByOne(){
		this.setDropTimeout();
		if(!this.tryMove(() => this.currentBlock.move(0, 1))) {
			this.fixateBlock();
		}
	}

	fixateBlock() {
		this.io.beep();
		this.scoreFixatedBlocks();

		this.map = this.map.overlay(this.currentBlock);

		const fullRows = this.map.getFullRows();
		this.scoreLine(fullRows.length);

		this.map.deleteRows(fullRows);

		this.currentBlock = this.nextBlock;
		this.nextBlock = this.generateBlock();
		if(this.map.checkCollision(this.currentBlock)) this.triggerGameOver();
	}

	triggerGameOver (){
		this.gameOver = true;
		this.clearDropTimeout();
		this.setName();
		this.getAndSetScore();
	}

	getAndSetScore(){
		new Promise((resolve, reject)=>{
			resolve(this.uploadScore());
		}).then(result =>{
			return this.getHighscores();
		}).then(result=>{
			return this.io.displayHighscores(result);
		}).catch((err)=>{
			console.log(err);
		});
	}

	setName(){
		this.username = window.prompt("Please enter your Name", "Player");
	}

	uploadScore(){
		$.post("http://localhost:8080/scores", {username: this.username , score: this.score});
	}

	getHighscores(){
		return $.get("http://localhost:8080/scores", data =>{
			//console.log(data);
			return data;
		});
	}

}

const BLOCKS = [
	[ 
		[
			[1,1],
			[1,1]
		]
	],
	[
		[
			[0,0,0],
			[2,2,2],
			[2,0,0]
		],
		[
			[2,2,0],
			[0,2,0],
			[0,2,0]
		],
		[
			[0,0,2],
			[2,2,2],
			[0,0,0]
		],
		[
			[0,2,0],
			[0,2,0],
			[0,2,2]
		]
	],
	[
		[
			[0,3,0,0],
			[0,3,0,0],
			[0,3,0,0],
			[0,3,0,0]
		],
		[
			[0,0,0,0],
			[3,3,3,3],
			[0,0,0,0],
			[0,0,0,0]
		]
	],
	[
		[
			[4,4,4],
			[0,4,0],
			[0,0,0]
		],
		[
			[0,0,4],
			[0,4,4],
			[0,0,4]
		],
		[
			[0,0,0],
			[0,4,0],
			[4,4,4]
		],
		[
			[4,0,0],
			[4,4,0],
			[4,0,0]
		]
	],
	[
		[
			[0,5,0],
			[0,5,5],
			[0,0,5]
		],
		[
			[0,5,5],
			[5,5,0],
			[0,0,0]
		]
	],
	[
		[
			[0,6,0],
			[6,6,0],
			[6,0,0]
		],
		[
			[6,6,0],
			[0,6,6],
			[0,0,0]
		]
	]
];










//const game = new TetrisGame();

/*const test = [
	[0, 1, 2, 3, 4, 5],
	[0, 0, 0, 0, 0, 0],
	[0, 2, 0, 0, 2, 0],
	[0, 0, 2, 2, 0, 0],
	[0, 2, 0, 0, 2, 0]
];

const table = new MatrixDisplay(6, 5);

$('body').append(table.$table);

table.draw(test);
*/