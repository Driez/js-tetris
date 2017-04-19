class Block {
	constructor(pixels) { // gets random BLOCKS array
		this.pixels = pixels; // [rotationPosition][y][x]
		this.coordinates = {x: 0, y: 0};
		this.rotationPosition = 0;
		this.size = {
			width: this.pixels[0][0].length,
			height: this.pixels[0].length
		};
	}

	get rotations() {
		return this.pixels.length;
	}

	getPixels() {
		return this.pixels[this.rotationPosition];
	}

	rotate() {
		this.rotationPosition = (this.rotationPosition + 1) % this.rotations;
	}

	move(x, y) {
		this.coordinates.x += x;
		this.coordinates.y += y;
	}

	getStatus() {
		return {
			coordinates: Object.assign({}, this.coordinates),
			rotationPosition: this.rotationPosition
		};
	}

	setStatus(status) {
		this.coordinates = Object.assign({}, status.coordinates);
		this.rotationPosition = status.rotationPosition;
	}

	
	getFirstNonemptyRow(){
		const index = this.getPixels().findIndex(row => row.some(x => x > 0));
		return index == -1 ? this.size.height : index;
	}
}

/*
HtmlIo
 - constructor(game)
 - Variables:
   - game
   - $container
   - mainMatrixDisplay: MatrixDisplay
   - sideMatrixDisplay: MatrixDisplay
   - $scoreField
   - $levelField
   - $infoField
 - Properties:
   - ($container)
 - Methods:
   - update(game)*/
