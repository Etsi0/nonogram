import { PuzzleCell } from './puzzle-cell.js';

export { PuzzleLine };

interface PuzzleLineSection {
	index: number;
	length: number;
	possibleStartIndexes: number[];
	knownIndexes: number[];
	solved: boolean;
}

interface PuzzleLineParams {
	type?: string;
	index?: number;
	length?: number;
	minimumSectionLength?: number;
	sections?: PuzzleLineSection[];
	cells?: PuzzleCell[];
	solved?: boolean;
}

/**
 * a container representing a complete row or column of grid cells
 */
class PuzzleLine {
	public type: string = '';
	public index: number = -1;
	public length: number = 0;
	public minimumSectionLength: number = 0;
	public sections: PuzzleLineSection[] = [];
	public cells: PuzzleCell[] = [];
	public solved: boolean = false;

	constructor(params?: PuzzleLineParams) {
		if (params) {
			Object.assign(this, params);
		}
	}
}