import { Utility } from './utility.js';
export { Puzzle };
/**
 * the main puzzle class containing the grid of cells, row/column hints, etc.
 */
class Puzzle {
    /**
     * @param width - an integer >= 1 specifying the number of rows
     * @param height - an integer >= 1 specifying the number of columns
     */
    constructor(width, height) {
        this.cells = [];
        this.rowHints = [];
        this.columnHints = [];
        this.creator = null;
        this.grid = [];
        if (typeof width === 'undefined' || typeof height === 'undefined') {
            throw new Error('width and height are required constructor parameters.');
        }
        else if ((width <= 0 || height <= 0) || (width === 1 && height === 1)) {
            throw new Error('invalid dimensions: ' + width.toString() + ' x ' + height.toString());
        }
        this.width = typeof width === 'number' ? width : parseInt(width, 10);
        this.height = typeof height === 'number' ? height : parseInt(height, 10);
        this.totalCells = this.width * this.height;
        this.reset();
    }
    /**
     * empty all arrays and create zero-filled multidimensional grid array
     */
    reset() {
        const zeroFill = Utility.getZeroFilledArray;
        this.creator = null;
        this.cells = [];
        this.rowHints = [];
        this.columnHints = [];
        this.grid = zeroFill(this.height).map(() => {
            return zeroFill(this.width);
        });
    }
    checkUserSolution() {
        return this.cells.every((cell) => {
            // cell.solution will be 0 or 1, but cell.userSolution might be null, 0 or 1
            const userValue = cell.userSolution === 1 ? 1 : 0;
            return cell.solution === userValue;
        });
    }
    getRowCells(row) {
        const cells = [];
        const start = row * this.width;
        const end = start + this.width;
        for (let i = start; i < end; i++) {
            cells.push(this.cells[i]);
        }
        return cells.length > 0 ? cells : false;
    }
    getColumnCells(column) {
        const cells = [];
        for (let i = column; i < this.cells.length; i += this.width) {
            cells.push(this.cells[i]);
        }
        return cells.length > 0 ? cells : false;
    }
    getCellByIndex(index) {
        const indexInt = typeof index !== 'number' ? parseInt(index, 10) : index;
        return this.cells[indexInt] ? this.cells[indexInt] : false;
    }
}
//# sourceMappingURL=puzzle.js.map