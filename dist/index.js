import { canvas, ctx } from './environment.js';
import { ResizeCanvas, GetBoardDimensions, executeActionOnCells, PercentageToPixels, isInside, styledText, getColor, Text, GetWorkareaDimensions } from './util.js';
import { board, variables } from './setting.js';
import { mouse } from './click.js';
import { cell } from './cell.js';
addEventListener('load', ResizeCanvas);
addEventListener('resize', ResizeCanvas);
/*==================================================
    GameLoop
==================================================*/
export function GameLoop() {
    clear();
    const workarea = GetWorkareaDimensions();
    const { height, gridCellSize, width, x, y } = GetBoardDimensions();
    getColor(0.62);
    ctx.fillRect(x, y, width, height);
    executeActionOnCells(['draw']);
    switch (variables.gameState) {
        case 'Menu':
            menuScreen('Phadonia Nanogram');
            break;
        case 'Running':
            executeActionOnCells(['gotClicked', 'gotHovered']);
            const fontSize = PercentageToPixels(16 / 8);
            colText.forEach((col, i) => {
                col.forEach((text, j) => {
                    const txt = new Text(text.toString(), fontSize);
                    txt.x = workarea.x + gridCellSize / 2 + PercentageToPixels(16) + (gridCellSize + PercentageToPixels(board.lineThickness)) * i;
                    txt.y = workarea.y + PercentageToPixels(16) - gridCellSize / 2 - (txt.height + fontSize / 2) * (col.length - j);
                    txt.render();
                });
            });
            rowText.forEach((row, i) => {
                row.forEach((text, j) => {
                    const txt = new Text(text.toString(), fontSize);
                    const centerTextOnLine = txt.height + (gridCellSize - txt.height) / 2;
                    txt.x = workarea.x + PercentageToPixels(16) - gridCellSize / 2 - fontSize / 2 - (fontSize / 2 * text.toString().length + fontSize / 2) * (row.length - j);
                    txt.y = workarea.y + centerTextOnLine + PercentageToPixels(16) + (gridCellSize + PercentageToPixels(board.lineThickness)) * i;
                    txt.render();
                });
            });
            if (variables.health <= 0) {
                variables.gameState = 'Lose';
            }
            if (variables.total <= 0) {
                variables.gameState = 'Win';
            }
            break;
        case 'Win':
            menuScreen('Win');
            break;
        case 'Lose':
            menuScreen('Lose');
            break;
    }
    mouse.click = 0;
    requestAnimationFrame(GameLoop);
}
/*==================================================
    Clear
==================================================*/
function clear() {
    // overwrites previous frame with new background
    ctx.fillStyle = 'oklch(0.2 0.01 277 / 100%)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //change mouse pointer back to default
    document.body.style.cursor = '';
}
/*==================================================
    Start/Win/Lose Screen
==================================================*/
function menuScreen(text) {
    let width = 0;
    let height = 0;
    let x = 0;
    let y = 0;
    /*==================================================
        Tint
    ==================================================*/
    ctx.fillStyle = 'oklch(0.2 0.01 277 / 50%)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    /*==================================================
        Title Text
    ==================================================*/
    x = canvas.width * 0.5;
    y = canvas.height * 0.45;
    styledText(text, x, y, true);
    /*==================================================
        Start Button
    ==================================================*/
    getColor(0.5);
    ctx.beginPath();
    width = PercentageToPixels(30);
    height = PercentageToPixels(10);
    x = (canvas.width - width) * 0.5;
    y = (canvas.height - height) * 0.55;
    ctx.roundRect(x, y, width, height, PercentageToPixels(1.5));
    ctx.fill();
    if (isInside(x, y, width, height)) {
        document.body.style.cursor = 'pointer';
        if (mouse.click === 1) {
            buildGame();
        }
    }
    styledText('Start', x + width / 2, y + height / 2, true);
}
/*==================================================
    Build Game
==================================================*/
export let gridCells = [];
export let colText = [];
export let rowText = [];
function buildGame(dummy) {
    gridCells = [];
    variables.total = 0;
    colText = Array.from({ length: board.numCells }, () => []);
    rowText = Array.from({ length: board.numCells }, () => []);
    gridCells = Array.from({ length: board.numCells ** 2 }, (_, i) => {
        const randomInt = Math.floor(Math.random() * 2);
        const col = i % board.numCells;
        const row = Math.floor(i / board.numCells);
        if ((!randomInt && colText[col][colText[col].length - 1] !== 0) || !colText[col].length) {
            colText[col].push(0);
        }
        if ((!randomInt && rowText[row][rowText[row].length - 1] !== 0) || !rowText[row].length) {
            rowText[row].push(0);
        }
        if (randomInt) {
            variables.total++;
            colText[col][colText[col].length - 1]++;
            rowText[row][rowText[row].length - 1]++;
        }
        return new cell(col, row, randomInt ? 'Pen' : 'Eraser');
    });
    colText = colText.map((array) => filter(array));
    rowText = rowText.map((array) => filter(array));
    function filter(array) {
        if (!array[array.length - 1]) {
            array.pop();
        }
        return array;
    }
    if (!dummy) {
        variables.health = 3;
        variables.tool = 'Pen';
        variables.gameState = 'Running';
    }
}
buildGame(true);
//# sourceMappingURL=index.js.map