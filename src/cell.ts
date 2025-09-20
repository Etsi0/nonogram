import { ctx } from "./environment";
import { GetBoardDimensions, getColor, isInside, PercentageToPixels } from "./util";
import { board, TTool, variables } from "./setting";
import { mouse } from "./click";
import * as healthBar from './healthBar';
import * as toolBar from './toolBar';

export class cell {
	private col: number;
	private row: number;
	private x: number = 0;
	private y: number = 0;
	private width: number = 0;
	private height: number = 0;

	private hidden: boolean;
	private state: TTool;

	constructor(col: number, row: number, state: TTool = 'Pen') {
		this.col = col;
		this.row = row;
		this.state = "Eraser";
		this.hidden = true;
		this.resize();
	}

	draw(): void {
		ctx.fillStyle = `oklch(0.2 0.01 277 / 100%)`

		if (!this.hidden) {
			switch (this.state) {
				case 'Pen':
					getColor(0.625);
					break;
				case 'Eraser':
					getColor(0.375);
					break;
			}
		}

		ctx.fillRect(this.x, this.y, this.width, this.height);
	}

	update(): void {
		if (isInside(this.x, this.y, this.width, this.height) && this.hidden) {
			document.body.style.cursor = 'pointer';

			if (mouse.click === 1) {
				this.hidden = false;

				if (this.state === 'Pen') {
					variables.total--;
				}

				if (toolBar.current !== this.state) {
					healthBar.decrease();
				}
			}
		}
	}

	resize(): void {
		const { gridCellSize, x, y } = GetBoardDimensions();

		this.width = gridCellSize;
		this.height = gridCellSize;

		const gridStepSize = gridCellSize + PercentageToPixels(board.lineThickness);
		this.x = x + this.col * gridStepSize;
		this.y = y + this.row * gridStepSize;
	}
}