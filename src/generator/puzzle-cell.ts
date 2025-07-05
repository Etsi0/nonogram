export { PuzzleCell };

interface PuzzleCellParams {
	index?: number;
	column?: number;
	row?: number;
	solution?: number | null;
	userSolution?: number | null;
	aiSolution?: number | null;
}

/**
 * a container representing a single cell in the puzzle grid
 */
class PuzzleCell {
	public index: number = -1;
	public column: number = -1;
	public row: number = -1;
	public solution: number | null = null;
	public userSolution: number | null = null;
	public aiSolution: number | null = null;

	constructor(params?: PuzzleCellParams) {
		if (params) {
			Object.assign(this, params);
		}
	}
}