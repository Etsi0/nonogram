import { PuzzleLine } from './puzzle-line.js';
import { PuzzleCell } from './puzzle-cell.js';
import { Puzzle } from './puzzle.js';
import { Utility } from './utility.js';

export { Solver };

interface SolutionLogEntry {
	html: string;
	cssClass: string;
}

interface PuzzleLineSection {
	index: number;
	length: number;
	possibleStartIndexes: number[];
	knownIndexes: number[];
	solved: boolean;
}

/**
 * a class that solves nonogram puzzles using logical techniques a human might use
 */
class Solver {
	public puzzle: Puzzle;
	public elapsedTime: number = 0;
	public isReset: boolean = true;
	public lines: PuzzleLine[] = [];
	public solutionLog: SolutionLogEntry[] = [];

	constructor(puzzle: Puzzle) {
		this.puzzle = puzzle;
		this._reset();
	}

	solve(): boolean {
		const start = new Date().getTime();
		let lastProgress = -1;
		let pass = 1;
		let solved: boolean;
		let passStart: number;
		let passEnd: number;
		let end: number;
		let passElapsedTime: number;
		let totalElapsedTime: number;
		let lineKey: number;
		let line: PuzzleLine;

		if (!this.isReset) {
			this._reset();
		}

		this.isReset = false;
		this._log('Starting solve algorithm', 'info');

		while (this._getProgress() > lastProgress && this._getTotalSolved() < this.puzzle.cells.length) {
			passStart = new Date().getTime();
			lastProgress = this._getProgress();

			for (lineKey = 0; lineKey < this.lines.length; lineKey++) {
				line = this.lines[lineKey];

				if (!line.solved) {
					this.eliminateImpossibleFits(line);
				}
				if (!line.solved) {
					this.findKnownPositivesAndNegatives(line);
				}
				if (!line.solved) {
					this.findSectionDefiningChains(line);
				}
				if (!line.solved) {
					this.findAnchoredSections(line);
				}
				if (!line.solved) {
					this.findCompletedSections(line);
				}
				if (!line.solved) {
					this.findCompletedLines(line);
				}
			}

			passEnd = new Date().getTime();
			passElapsedTime = (passEnd - passStart) / 1000;

			this._log('Pass ' + pass + ' completed in ' + passElapsedTime + ' seconds :: '
				+ this._getTotalSolved() + '/' + this.puzzle.cells.length + ' cells solved', 'info'
			);
			pass++;
		}

		solved = this._getTotalSolved() === this.puzzle.cells.length;
		end = new Date().getTime();
		totalElapsedTime = (end - start) / 1000;

		this._log('Solve algorithm finished in ' + totalElapsedTime + ' seconds.', 'info');

		if (solved) {
			this._log('Solution Found.', 'success');
		} else {
			this._log('Could not find solution.', 'failure');
		}

		this.elapsedTime = totalElapsedTime;
		return solved;
	}

	eliminateImpossibleFits(line: PuzzleLine): void {
		let minimumStartIndex = 0;
		let maximumStartIndex = line.length - line.minimumSectionLength;
		let i: number;
		let section: PuzzleLineSection;
		let possibleStartIndex: number;
		let newPossibleStartIndexes: number[];
		let lineSectionKey: number;
		let startIndexKey: number;
		let testCell: PuzzleCell;
		let end: number;
		let lineCellKey: number;
		let lineKey: number;

		// no sections
		if (line.sections.length === 0) {
			for (lineCellKey = 0; lineCellKey < line.cells.length; lineCellKey++) {
				this._setCellSolution(line.cells[lineCellKey], 0);
			}
		}

		// tighten range if one or more known negative cells start the line
		for (lineKey = 0; lineKey < line.length; lineKey++) {
			if (line.cells[lineKey].aiSolution === 0) {
				minimumStartIndex++;
			} else {
				break;
			}
		}

		// tighten range if one or more known negative cells end the line
		for (lineKey = line.length - 1; lineKey >= 0; lineKey--) {
			if (line.cells[lineKey].aiSolution === 0) {
				maximumStartIndex--;
			} else {
				break;
			}
		}

		for (lineSectionKey = 0; lineSectionKey < line.sections.length; lineSectionKey++) {
			section = line.sections[lineSectionKey];
			newPossibleStartIndexes = Utility.cloneArray(section.possibleStartIndexes);

			// eliminate places where section does not fit
			for (startIndexKey = 0; startIndexKey < section.possibleStartIndexes.length; startIndexKey++) {
				possibleStartIndex = section.possibleStartIndexes[startIndexKey];
				testCell = line.cells[possibleStartIndex + section.length];

				// the total length of all sections including minimum gap(s) of one cell does not allow this section to fit:
				if (possibleStartIndex < minimumStartIndex || possibleStartIndex > maximumStartIndex) {
					newPossibleStartIndexes = Utility.removeFromArray(newPossibleStartIndexes, possibleStartIndex);
				}

				// there is a known positive cell immediately following the possible section placement, so section cannot start here
				if (testCell && testCell.aiSolution === 1) {
					newPossibleStartIndexes = Utility.removeFromArray(newPossibleStartIndexes, possibleStartIndex);
				}

				// there is a known impossible cell in this range, so section cannot fit here:
				end = possibleStartIndex + section.length - 1;
				end = (end > line.length - 1) ? line.length - 1 : end;

				for (i = possibleStartIndex; i <= end; i++) {
					if (i > line.length - 1 || line.cells[i].aiSolution === 0) {
						newPossibleStartIndexes = Utility.removeFromArray(newPossibleStartIndexes, possibleStartIndex);
					}
				}
			}

			minimumStartIndex += section.length + 1;
			maximumStartIndex += section.length + 1;
			section.possibleStartIndexes = newPossibleStartIndexes;
		}
	}

	findKnownPositivesAndNegatives(line: PuzzleLine): void {
		const totalCellCounts = Utility.getZeroFilledArray(line.length);
		let sectionKey: number;
		let section: PuzzleLineSection;
		let cellCounts: number[];
		let startIndexKey: number;
		let possibleStartIndex: number;
		let start: number;
		let end: number;
		let i: number;
		let cellCountKey: number;
		let cellCount: number;
		let cell: PuzzleCell;

		for (sectionKey = 0; sectionKey < line.sections.length; sectionKey++) {
			section = line.sections[sectionKey];
			cellCounts = Utility.getZeroFilledArray(line.length);

			// keep two counts: 1) all common cells for this section, and 2) cells where no section can be
			for (startIndexKey = 0; startIndexKey < section.possibleStartIndexes.length; startIndexKey++) {
				possibleStartIndex = section.possibleStartIndexes[startIndexKey];
				start = possibleStartIndex;
				end = start + section.length - 1;

				for (i = start; i <= end; i++) {
					cellCounts[i]++;
					totalCellCounts[i]++;
				}
			}

			// common to all possibilities, solve as positive
			for (cellCountKey = 0; cellCountKey < cellCounts.length; cellCountKey++) {
				cellCount = cellCounts[cellCountKey];
				cell = line.cells[cellCountKey];

				if (cell && cell.aiSolution === null && cellCount === section.possibleStartIndexes.length) {
					this._setCellSolution(cell, 1);
				}
			}
		}

		// no possible cells, remove as a possibility
		for (cellCountKey = 0; cellCountKey < totalCellCounts.length; cellCountKey++) {
			cellCount = totalCellCounts[cellCountKey];
			cell = line.cells[cellCountKey];

			if (cell && cell.aiSolution === null && cellCount === 0) {
				this._setCellSolution(cell, 0);
			}
		}
	}

	findAnchoredSections(line: PuzzleLine): void {
		let i: number;
		let fillRange: [number, number] | null;
		let firstSection: PuzzleLineSection;
		let lastSection: PuzzleLineSection;

		if (line.sections.length > 0) {
			firstSection = line.sections[0];
			lastSection = line.sections[line.sections.length - 1];

			// find sections anchored to start of line
			fillRange = null;

			for (i = 0; i < line.cells.length; i++) {
				if (line.cells[i].aiSolution === null) {
					break;
				} else if (line.cells[i].aiSolution === 1) {
					fillRange = [i, i + firstSection.length - 1];
					break;
				}
			}

			if (fillRange !== null) {
				for (i = fillRange[0]; i <= fillRange[1]; i++) {
					if (line.cells[i]) {
						this._setCellSolution(line.cells[i], 1);
					}
				}
				if (line.cells[i]) {
					this._setCellSolution(line.cells[i], 0);
				}
			}

			// find sections anchored to end of line
			fillRange = null;

			for (i = line.cells.length - 1; i >= 0; i--) {
				if (line.cells[i].aiSolution === null) {
					break;
				} else if (line.cells[i].aiSolution === 1) {
					fillRange = [i - lastSection.length + 1, i];
					break;
				}
			}

			if (fillRange !== null) {
				for (i = fillRange[0]; i <= fillRange[1]; i++) {
					if (line.cells[i]) {
						this._setCellSolution(line.cells[i], 1);
					}
				}
				if (line.cells[fillRange[0] - 1]) {
					this._setCellSolution(line.cells[fillRange[0] - 1], 0);
				}
			}
		}
	}

	findSectionDefiningChains(line: PuzzleLine): void {
		interface Chain {
			start: number;
			length: number;
		}

		let chains: Chain[] = [];
		let lastValue = 0;
		let cellKey: number;
		let cell: PuzzleCell;
		let chain: Chain | undefined;
		let chainKey: number;
		let sectionsSorted: PuzzleLineSection[];
		let firstSortedSection: PuzzleLineSection;

		// sort sections by highest length to lowest
		sectionsSorted = Utility.cloneArray(line.sections).sort(function (a: PuzzleLineSection, b: PuzzleLineSection) {
			return a.length > b.length ? -1 : 1;
		});
		firstSortedSection = sectionsSorted[0];

		// loop through all cells, creating array of connectors
		for (cellKey = 0; cellKey < line.cells.length; cellKey++) {
			cell = line.cells[cellKey];

			if (cell.aiSolution === 1) {
				if (lastValue !== 1) {
					chain = {
						start: cellKey,
						length: 1
					};
					chains.push(chain);
				} else if (chain) {
					chain.length++;
				}
			}

			lastValue = cell.aiSolution || 0;
		}

		// if a connector is found with the first section's length, place negatives around it and mark the section as complete & continue
		for (chainKey = 0; chainKey < chains.length; chainKey++) {
			chain = chains[chainKey];

			if (chain.length === firstSortedSection.length) {
				if (line.cells[chain.start - 1]) {
					this._setCellSolution(line.cells[chain.start - 1], 0);
				}

				if (line.cells[chain.start + firstSortedSection.length]) {
					this._setCellSolution(line.cells[chain.start + firstSortedSection.length], 0);
				}

				firstSortedSection.solved = true;
			}
		}
	}

	findCompletedSections(line: PuzzleLine): void {
		let sectionKey: number;
		let section: PuzzleLineSection;
		let firstNegative: number;
		let lastNegative: number;

		// complete lines where all sections have been found
		for (sectionKey = 0; sectionKey < line.sections.length; sectionKey++) {
			section = line.sections[sectionKey];

			// only one possible place...
			if (!section.solved && section.possibleStartIndexes.length === 1) {
				// make sure there is a negative cell on either side of the section
				firstNegative = section.possibleStartIndexes[0] - 1;
				lastNegative = section.possibleStartIndexes[0] + section.length;

				if (line.cells[firstNegative] && line.cells[firstNegative].aiSolution === null) {
					this._setCellSolution(line.cells[firstNegative], 0);
				}
				if (line.cells[lastNegative] && line.cells[lastNegative].aiSolution === null) {
					this._setCellSolution(line.cells[lastNegative], 0);
				}

				section.solved = true;
			}
		}
	}

	findCompletedLines(line: PuzzleLine): void {
		let totalSectionLength = 0;
		let totalPositiveSolved = 0;
		let sectionKey: number;
		let section: PuzzleLineSection;
		let cellKey: number;
		let cell: PuzzleCell;

		// complete lines where all sections have been found
		for (sectionKey = 0; sectionKey < line.sections.length; sectionKey++) {
			section = line.sections[sectionKey];
			totalSectionLength += section.length;
		}

		for (cellKey = 0; cellKey < line.cells.length; cellKey++) {
			cell = line.cells[cellKey];
			totalPositiveSolved += cell.aiSolution === 1 ? 1 : 0;
		}

		if (totalSectionLength === totalPositiveSolved) {
			for (cellKey = 0; cellKey < line.cells.length; cellKey++) {
				cell = line.cells[cellKey];

				if (cell.aiSolution === null) {
					this._setCellSolution(cell, 0);
				}
			}
		}
	}

	private _reset(): void {
		const possibleRowIndexes: number[] = [];
		const possibleColumnIndexes: number[] = [];
		let i: number;
		let cellKey: number;
		let rowNumber: number;
		let rowHints: number[];
		let rowCells: PuzzleCell[] | false;
		let line: PuzzleLine;
		let index: number;
		let len: number;
		let columnKey: number;
		let columnHint: number[];

		this.isReset = true;
		this.elapsedTime = 0;
		this.solutionLog = [];
		this.lines = [];

		this._log('Resetting variables', 'info');

		// reset cell.aiSolution
		for (cellKey = 0; cellKey < this.puzzle.cells.length; cellKey++) {
			this.puzzle.cells[cellKey].aiSolution = null;
		}

		// reset possibleRowIndexes
		for (i = 0; i < this.puzzle.width; i++) {
			possibleRowIndexes.push(i);
		}

		// reset possibleColumnIndexes
		for (i = 0; i < this.puzzle.height; i++) {
			possibleColumnIndexes.push(i);
		}

		// reset rowHints
		for (rowNumber = 0; rowNumber < this.puzzle.rowHints.length; rowNumber++) {
			rowHints = this.puzzle.rowHints[rowNumber];
			rowCells = this.puzzle.getRowCells(rowNumber);

			if (rowCells) {
				line = new PuzzleLine({
					type: 'row',
					index: rowNumber,
					length: this.puzzle.width,
					cells: rowCells
				});

				for (index = 0; index < rowHints.length; index++) {
					len = rowHints[index];
					line.sections.push({
						index: index,
						length: len,
						possibleStartIndexes: [...possibleRowIndexes],
						knownIndexes: [],
						solved: false
					});

					line.minimumSectionLength += len + 1;
				}

				line.minimumSectionLength--;
				this.lines.push(line);
			}
		}

		// reset columnHints
		for (columnKey = 0; columnKey < this.puzzle.columnHints.length; columnKey++) {
			columnHint = this.puzzle.columnHints[columnKey];
			const columnCells = this.puzzle.getColumnCells(columnKey);

			if (columnCells) {
				line = new PuzzleLine({
					type: 'column',
					index: columnKey,
					length: this.puzzle.height,
					cells: columnCells,
				});

				for (index = 0; index < columnHint.length; index++) {
					len = columnHint[index];
					line.sections.push({
						index: index,
						length: len,
						possibleStartIndexes: [...possibleColumnIndexes],
						knownIndexes: [],
						solved: false
					});

					line.minimumSectionLength += len + 1;
				}

				line.minimumSectionLength--;
				this.lines.push(line);
			}
		}
	}

	private _setCellSolution(puzzleCell: PuzzleCell, value: number): void {
		let lineKey: number;
		let line: PuzzleLine;
		let isRow: boolean;
		let isCol: boolean;
		let cellsSolved: number;
		let cellKey: number;
		let cell: PuzzleCell;

		if (puzzleCell.aiSolution !== null) {
			return;
		}

		for (lineKey = 0; lineKey < this.lines.length; lineKey++) {
			line = this.lines[lineKey];
			isRow = line.type === 'row' && line.index === puzzleCell.row;
			isCol = line.type === 'column' && line.index === puzzleCell.column;
			cellsSolved = 0;

			if (isRow || isCol) {
				for (cellKey = 0; cellKey < line.cells.length; cellKey++) {
					cell = line.cells[cellKey];

					if (cell.index === puzzleCell.index) {
						cell.aiSolution = value;
						cellsSolved++;
					} else if (cell.aiSolution !== null) {
						cellsSolved++;
					}
				}

				if (cellsSolved === line.length) {
					line.solved = true;
				}
			}
		}
	}

	private _log(html: string, cssClass?: string): void {
		this.solutionLog.push({
			html: html,
			cssClass: cssClass || 'info'
		});
	}

	private _getTotalSolved(): number {
		let total = 0;

		for (let cellKey = 0; cellKey < this.puzzle.cells.length; cellKey++) {
			total += this.puzzle.cells[cellKey].aiSolution !== null ? 1 : 0;
		}

		return total;
	}

	/**
	 * calculate the maximum # of possible permutations, depending on the current state of the solving process.
	 */
	private _getProgress(): number {
		let maxPossibilities = 0;
		let totalPossibilities = 0;
		let lineKey: number;
		let line: PuzzleLine;
		let sectionKey: number;

		for (lineKey = 0; lineKey < this.lines.length; lineKey++) {
			line = this.lines[lineKey];
			maxPossibilities += line.sections.length * (line.type === 'row' ? this.puzzle.width : this.puzzle.height);

			for (sectionKey = 0; sectionKey < line.sections.length; sectionKey++) {
				totalPossibilities += line.sections[sectionKey].possibleStartIndexes.length;
			}
		}

		return maxPossibilities - totalPossibilities;
	}
}