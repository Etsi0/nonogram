export { PuzzleCell };
/**
 * a container representing a single cell in the puzzle grid
 */
class PuzzleCell {
    constructor(params) {
        this.index = -1;
        this.column = -1;
        this.row = -1;
        this.solution = null;
        this.userSolution = null;
        this.aiSolution = null;
        if (params) {
            Object.assign(this, params);
        }
    }
}
//# sourceMappingURL=puzzle-cell.js.map