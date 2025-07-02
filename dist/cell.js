import { ctx } from "./environment.js";
import { GetBoardDimensions, getColor, isInside, PercentageToPixels } from "./util.js";
import { board, variables } from "./setting.js";
import { mouse } from "./click.js";
export class cell {
    constructor(col, row, state = 'Pen') {
        this.col = col;
        this.row = row;
        this.state = state;
        this.hidden = false;
        this.gotResized();
    }
    draw() {
        ctx.fillStyle = `oklch(0.2 0.01 277 / 100%)`;
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
    gotClicked() {
        if (isInside(this.x, this.y, this.width, this.height) && mouse.click === 1) {
            this.hidden = false;
            if (variables.tool !== this.state) {
                variables.total--;
                variables.health--;
            }
        }
    }
    gotHovered() {
        if (isInside(this.x, this.y, this.width, this.height)) {
            document.body.style.cursor = 'pointer';
        }
    }
    gotResized() {
        const { gridCellSize, x, y } = GetBoardDimensions();
        this.width = gridCellSize;
        this.height = gridCellSize;
        const gridStepSize = gridCellSize + PercentageToPixels(board.lineThickness);
        this.x = x + this.col * gridStepSize;
        this.y = y + this.row * gridStepSize;
    }
}
//# sourceMappingURL=cell.js.map