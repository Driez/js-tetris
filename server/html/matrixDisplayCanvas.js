class MatrixDisplay{
	constructor(width, height){
		this.width = width;
		this.height = height;
		this.matrixCell = {x: 25, y: 25};
		this.$table = $('<canvas class="table" width="' + (this.width * this.matrixCell.x) + 
						'px" height="' + (this.height * this.matrixCell.y) + 'px">Your browser does not show canvas elements</canvas>');
	}

	draw(colors){ 
		const canvasElement = this.$table[0];

		if(canvasElement.getContext){
			const canvas = canvasElement.getContext('2d');
			this.clearCanvas(canvas);
			for(let y = 0; y < colors.length; y++){
				for(let x = 0; x < colors[y].length; x++){
					if(colors[y][x]){
						canvas.fillStyle = this.differentColors(colors[y][x]);
						canvas.fillRect(x * this.matrixCell.x, y * this.matrixCell.y, this.matrixCell.x, this.matrixCell.y);
						canvas.strokeRect(x * this.matrixCell.x, y * this.matrixCell.y, this.matrixCell.x, this.matrixCell.y);
					}
				}
			}
		}
	}
	clearCanvas(canvas){
		canvas.clearRect(0, 0, this.width * this.matrixCell.x, this.height * this.matrixCell.y);
	}

	differentColors(cell){
		switch(cell){
			case 1: return "black";
			case 2: return "red";
			case 3: return "orange";
			case 4: return "green";
			case 5: return "blue";
			case 6: return "mediumaquamarine";
		}
	}
}
