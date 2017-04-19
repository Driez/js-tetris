class CollisionError extends Error {}

class Map {
	constructor(width, height) {
		this.size = {width, height};
		this.pixels = [];
		for(let i = 0; i < this.size.height; i++) this.pixels.push(this.createEmptyRow());
	}

	clone() {
		const newMap = new Map(this.size.width, this.size.height);
		newMap.pixels = this.pixels.map(row => [...row]);
		return newMap;
	}

	getPixels() {
		return this.pixels;
	}

	createEmptyRow() {
		const row = [];
		for(let i = 0; i < this.size.width; i++) row.push(0);
		return row;
	}

	overlay(block, failSilently = false) {
		let newMap = this.clone(),
			newPixels = newMap.getPixels(),
			blockPos = block.coordinates,
			blockPixels = block.getPixels();

		for(let y = 0; y < block.size.height; y++) {
			for(let x = 0; x < block.size.width; x++) {
				// If block pixel is not empty and map pixel is also not empty (can be out of range),
				// it's a collision, otherwise copy the block pixel to the map.
				if(blockPixels[y][x]) {
					if((newPixels[blockPos.y + y] || [])[blockPos.x + x] !== 0) {
						if(!failSilently) throw new CollisionError(`Collision at ${blockPos.x + x}/${blockPos.y + y}`);
					} else {
						newPixels[blockPos.y + y][blockPos.x + x] = blockPixels[y][x];
					}
				}
			}
		}
		return newMap;
	}

	checkCollision(block) {
		try {
			this.overlay(block);
			return false;
		} catch(e) {
			if(e instanceof CollisionError) {
				return true;
			} else {
				throw e;
			}
		}
	}

	getFullRows(){
		let fullRows = [];
		for(let y = 0; y < this.pixels.length; y++){ 
			if(this.pixels[y].every(x => x > 0)){
				fullRows.push(y);
			}
		}
		return fullRows;
	}

	deleteRows(rows){
		for(let i = 0; i < rows.length; i++) {
			this.pixels.splice(rows[i], 1);
			this.pixels.unshift(this.createEmptyRow());
		}
	}
}
