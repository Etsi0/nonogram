import { ctx } from "./environment.js";
import { GetBoardDimensions, getColor, isInside, PercentageToPixels } from "./util.js";
import { board, variables } from "./setting.js";
import { mouse } from "./click.js";
import * as healthBar from './healthBar.js';
import * as toolBar from './toolBar.js';
export class cell {
    constructor(col, row, state = 'Pen') {
        this.col = col;
        this.row = row;
        this.state = state;
        this.hidden = true;
        this.resize();
    }
    draw() {
        ctx.fillStyle = `oklch(0.2 0.01 277 / 100%)`;
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
    update() {
        if (isInside(this.x, this.y, this.width, this.height) && this.hidden) {
            document.body.style.cursor = 'pointer';
            if (mouse.click === 1) {
                this.hidden = false;
                variables.total--;
                if (toolBar.current !== this.state) {
                    healthBar.decrease();
                }
            }
        }
    }
    resize() {
        const { gridCellSize, x, y } = GetBoardDimensions();
        this.width = gridCellSize;
        this.height = gridCellSize;
        const gridStepSize = gridCellSize + PercentageToPixels(board.lineThickness);
        this.x = x + this.col * gridStepSize;
        this.y = y + this.row * gridStepSize;
    }
}
//# sourceMappingURL=cell.js.map