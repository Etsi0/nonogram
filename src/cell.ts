import { ctx } from "./environment.js";
import { GetBoardDimensions, getColor, isInside, PercentageToPixels } from "./util.js";
import { board, TTool, variables } from "./setting.js";
import { mouse } from "./click.js";

export class cell {
	private col: number;
	private row: number;
	private x: number;
	private y: number;
	private width: number;
	private height: number;

	private hidden: boolean;
	private state: TTool;

	constructor(col: number, row: number, state: TTool = 'Pen') {
		this.col = col;
		this.row = row;
		this.state = state;
		this.hidden = true;
		this.gotResized();
	}

	draw(): void {
		ctx.fillStyle = `oklch(0.2 0.01 277 / 100%)`

		if (!this.hidden) {
			switch (this.state) {
				case 'Pen':
					getColor(0.5);
					break;
				case 'Eraser':
					getColor(0.75);
					break;
			}
		}

		ctx.fillRect(this.x, this.y, this.width, this.height);
	}

	gotClicked(): void {
		if (isInside(this.x, this.y, this.width, this.height) && mouse.click === 1) {
			this.hidden = false;

			if (variables.tool !== this.state) {
				variables.total--;
				variables.health--;
			}
		}
	}

	gotHovered(): void {
		if (isInside(this.x, this.y, this.width, this.height)) {
			document.body.style.cursor = 'pointer';
		}
	}

	gotResized(): void {
		const { gridCellSize, x, y } = GetBoardDimensions();

		this.width = gridCellSize;
		this.height = gridCellSize;

		const gridStepSize = gridCellSize + PercentageToPixels(board.lineThickness);
		this.x = x + this.col * gridStepSize;
		this.y = y + this.row * gridStepSize;
	}
}