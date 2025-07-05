export { PuzzleLine };
/**
 * a container representing a complete row or column of grid cells
 */
class PuzzleLine {
    constructor(params) {
        this.type = '';
        this.index = -1;
        this.length = 0;
        this.minimumSectionLength = 0;
        this.sections = [];
        this.cells = [];
        this.solved = false;
        if (params) {
            Object.assign(this, params);
        }
    }
}
//# sourceMappingURL=puzzle-line.js.map