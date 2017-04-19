class MatrixDisplay {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.$table = $('<div class="matrix-table">');
        this.$cells = [];

        for(let y = 0; y < height; y++) {
            const $row = $('<div class="matrix-row">').appendTo(this.$table);
            this.$cells[y] = [];

            for(let x = 0; x < width; x++) {
                this.$cells[y][x] = $('<div class="matrix-cell" data-color="0">').appendTo($row);
            }
        }
    }

    draw(colors) {
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                this.$cells[y][x].attr('data-color', (colors[y] || [])[x] || 0);
            }
        }
    }
}

