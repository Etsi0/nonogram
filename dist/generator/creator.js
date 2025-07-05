import { Puzzle } from './puzzle.js';
import { PuzzleCell } from './puzzle-cell.js';
import { Solver } from './solver.js';
import { Utility } from './utility.js';
export { Creator };
/**
 * creates nonogram puzzles
 */
class Creator {
    constructor() {
        this.log = [];
        this.creationTime = 0;
        this.solvingTime = 0;
    }
    /**
     * populates the puzzles rows and columns with random, solvable values
     */
    createRandom(width, height, density) {
        const start = new Date().getTime();
        let puzzleValid = false;
        const densityValid = typeof density === 'number' && density >= 0 && density <= 1;
        let cellsFilled;
        let chanceOfCellFill;
        let solutionGrid;
        let rowArray;
        let cellValue;
        let solver;
        let i;
        let elapsed;
        this.puzzle = new Puzzle(width, height);
        this._reset();
        while (puzzleValid === false) {
            chanceOfCellFill = densityValid ? density : Utility.getRandomIntBetween(200, 800) / 1000;
            solutionGrid = [];
            rowArray = [];
            cellsFilled = 0;
            this._log('Creating random ' +
                this.puzzle.width + 'x' + this.puzzle.height +
                ' puzzle with density of ' + chanceOfCellFill + '...');
            // create puzzle grid randomly using density as a factor
            for (i = 0; i < this.puzzle.totalCells; i++) {
                cellValue = Math.random() < chanceOfCellFill ? 1 : 0;
                cellsFilled += cellValue;
                if (i % this.puzzle.width === 0 && i > 0) {
                    solutionGrid.push(rowArray);
                    rowArray = [];
                }
                rowArray.push(cellValue);
            }
            // ensure that at least one cell is filled, and that not all of them are
            if (cellsFilled === 0) {
                this._log('Generated puzzle has no cells filled.  Trying again...');
                continue;
            }
            else if (cellsFilled === this.puzzle.totalCells) {
                this._log('Generated puzzle has all cells filled.  Trying again...');
                continue;
            }
            // populate the solution grid
            solutionGrid.push(rowArray);
            // populate the grid
            this.puzzle = Creator._populatePuzzleFromGrid(this.puzzle, solutionGrid);
            // ensure that puzzle is solvable
            solver = new Solver(this.puzzle);
            if (solver.solve()) {
                puzzleValid = true;
                elapsed = (new Date().getTime() - start) / 1000;
                this._log('Puzzle is solvable - solved in ' + solver.elapsedTime + ' seconds');
                this._logLine();
                this._log('Puzzle generated in ' + elapsed + ' seconds.');
                this.creationTime = elapsed;
                this.solvingTime = solver.elapsedTime;
            }
            else {
                this._log('Puzzle cannot be solved.  Trying again...');
            }
            this._logLine();
        }
        this.puzzle.creator = this;
        return this.puzzle;
    }
    /**
     * create a puzzle using a grid
     */
    createFromGrid(grid) {
        const start = new Date().getTime();
        let width = 0;
        let height = 0;
        let puzzle;
        let solver;
        let elapsed;
        this._reset();
        this._log('creating puzzle from grid array.');
        // make sure grid is valid and get width & height
        if (!(grid instanceof Array)) {
            throw new Error('grid is not an array');
        }
        grid.forEach((row, rowKey) => {
            if (!(row instanceof Array)) {
                throw new Error('grid is not a multi-dimensional array');
            }
            if (width === 0) {
                width = row.length;
            }
            else if (row.length !== width) {
                throw new Error('row ' + rowKey + ' has an invalid length (' + row.length + ') - expecting ' + width);
            }
            height++;
        });
        this._log('grid is valid');
        this._log('populating ' + width + 'x' + height + ' puzzle');
        puzzle = new Puzzle(width, height);
        this.puzzle = Creator._populatePuzzleFromGrid(puzzle, grid);
        this.puzzle.creator = this;
        // ensure that puzzle is solvable
        solver = new Solver(this.puzzle);
        if (solver.solve()) {
            this._log('Puzzle is solvable.');
            this._logLine();
        }
        else {
            this._log('Puzzle cannot be solved.');
            this._logLine();
            return false;
        }
        elapsed = (new Date().getTime() - start) / 1000;
        this._log('Puzzle built and solved in ' + elapsed + ' seconds.');
        this._logLine();
        return this.puzzle;
    }
    /**
     * create a puzzle from a hint object
     */
    createFromHints(hints) {
        const start = new Date().getTime();
        let width;
        let height;
        let puzzle;
        let solver;
        let elapsed;
        this._reset();
        this._log('creating puzzle from hints');
        // make sure row & column properties exist
        if (typeof hints !== 'object' || !hints.row || !hints.column) {
            throw new Error('parameter passed to createFromHints() must be an object containing "row" and "column" properties');
        }
        else if (!(hints.row instanceof Array) || !(hints.column instanceof Array)) {
            throw new Error('hints.row or hints.column must be an array.');
        }
        this._log('found row and column hints');
        width = hints.column.length;
        height = hints.row.length;
        puzzle = new Puzzle(width, height);
        puzzle.rowHints = hints.row;
        puzzle.columnHints = hints.column;
        puzzle.creator = this;
        this._log('populating ' + width + 'x' + height + ' puzzle');
        // populate cells array
        puzzle.grid.forEach((row, rowKey) => {
            row.forEach((column, columnKey) => {
                puzzle.cells.push(new PuzzleCell({
                    index: (rowKey * puzzle.width) + columnKey,
                    column: columnKey,
                    row: rowKey
                }));
            });
        });
        this.puzzle = puzzle;
        // ensure that puzzle is solvable
        solver = new Solver(this.puzzle);
        if (solver.solve()) {
            this._log('Puzzle is solvable.');
            this._logLine();
        }
        else {
            this._log('Puzzle cannot be solved.');
            this._logLine();
            return false;
        }
        // set solution on puzzle cells
        solver.puzzle.cells.forEach((solvedCell, cellIndex) => {
            const puzzleCell = this.puzzle.getCellByIndex(cellIndex);
            if (puzzleCell) {
                puzzleCell.aiSolution = solvedCell.aiSolution;
                puzzleCell.solution = solvedCell.aiSolution;
            }
        });
        elapsed = (new Date().getTime() - start) / 1000;
        this._log('Puzzle built and solved in ' + elapsed + ' seconds.');
        this._logLine();
        return this.puzzle;
    }
    static _populatePuzzleFromGrid(puzzle, grid) {
        let columnHints;
        let rowKey;
        let currentRow;
        let columnKey;
        let column;
        let cell;
        let currentVal;
        let lastVal;
        let rowHints;
        let hintKey;
        let hint;
        let rowIndex;
        puzzle.reset();
        puzzle.grid = grid;
        for (rowKey = 0; rowKey < puzzle.grid.length; rowKey++) {
            currentRow = puzzle.grid[rowKey];
            rowHints = [];
            puzzle.rowHints[rowKey] = [];
            for (columnKey = 0; columnKey < currentRow.length; columnKey++) {
                column = currentRow[columnKey];
                currentVal = column;
                lastVal = columnKey > 0 ? puzzle.grid[rowKey][columnKey - 1] : 0;
                // populate cells
                puzzle.cells.push(new PuzzleCell({
                    index: (rowKey * puzzle.width) + columnKey,
                    column: columnKey,
                    row: rowKey,
                    solution: column
                }));
                // populate row hints
                if (currentVal === 1 && lastVal === 0) {
                    rowHints.push(1);
                }
                else if (currentVal === 0 && lastVal === 1) {
                    rowHints.push(0);
                }
                else if (currentVal === 1 && lastVal === 1) {
                    rowHints[rowHints.length - 1]++;
                }
            }
            // clean up row hints
            for (hintKey = 0; hintKey < rowHints.length; hintKey++) {
                hint = rowHints[hintKey];
                if (hint > 0) {
                    puzzle.rowHints[rowKey].push(hint);
                }
            }
        }
        // populate column hints
        for (columnKey = 0; columnKey < puzzle.width; columnKey++) {
            puzzle.columnHints[columnKey] = [];
            columnHints = [];
            for (cell = columnKey; cell < puzzle.totalCells; cell += puzzle.width) {
                rowIndex = Math.floor(cell / puzzle.width);
                currentVal = puzzle.grid[rowIndex][columnKey];
                lastVal = rowIndex > 0 ? puzzle.grid[rowIndex - 1][columnKey] : 0;
                if (currentVal === 1 && lastVal === 0) {
                    columnHints.push(1);
                }
                else if (currentVal === 0 && lastVal === 1) {
                    columnHints.push(0);
                }
                else if (currentVal === 1 && lastVal === 1) {
                    columnHints[columnHints.length - 1]++;
                }
            }
            // clean up column hints
            for (hintKey = 0; hintKey < columnHints.length; hintKey++) {
                hint = columnHints[hintKey];
                if (hint > 0) {
                    puzzle.columnHints[columnKey].push(hint);
                }
            }
        }
        return puzzle;
    }
    _log(msg) {
        this.log.push(msg);
    }
    _logLine() {
        this.log.push('-----------------------------------');
    }
    _reset() {
        this.log = [];
        this.creationTime = 0;
        this.solvingTime = 0;
    }
}
//# sourceMappingURL=creator.js.map