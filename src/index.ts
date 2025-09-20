import { canvas, ctx } from './environment';
import { ResizeCanvas, GetBoardDimensions, executeActionOnCells, PercentageToPixels, isInside, getColor, Text, Animate, type TODO } from './util';
import { board, fontSize, space, variables } from './setting';
import { mouse } from './click';
import { cell } from './cell';
import * as healthBar from './healthBar';
import * as toolBar from './toolBar';
import { Creator } from './generator/creator';

addEventListener('load', ResizeCanvas);
addEventListener('resize', ResizeCanvas);

/*==================================================
	GameLoop
==================================================*/
let animation: TODO;
export function GameLoop(): void {
	clear();

	const { height, gridCellSize, width, x, y } = GetBoardDimensions();

	healthBar.draw()

	getColor(0.5);
	ctx.fillRect(x, y, width, height);
	executeActionOnCells('draw');

	toolBar.draw();

	switch (variables.gameState) {
		case 'Menu':
			menuScreen('Phadonia Nonogram');
			break;
		case 'Running':
			const health = healthBar.current;
			executeActionOnCells('update');
			toolBar.update();
			if (health !== healthBar.current) {
				animation = new Animate(500, 'bell');
			}
			if (animation) {
				const opacity = animation.step();
				ctx.fillStyle = `oklch(0.6364 0.1717 23.32 / ${opacity})`;
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				if (animation.isComplete()) {
					animation = undefined;
				}
			}

			colText.forEach((col, i) => {
				col.forEach((text, j) => {
					const txt = new Text(text.toString(), fontSize());
					txt.horizontalAlign = 'center'
					txt.x = x + gridCellSize / 2 + (gridCellSize + PercentageToPixels(board.lineThickness)) * i;
					txt.y = y - PercentageToPixels(space.workarea.gap) - (txt.height * 1.125) * (col.length - 1 - j);
					txt.render();
				});
			});

			rowText.forEach((row, i) => {
				let width = row.reduce((accumulator, currentValue) => accumulator + fontSize() / 2 * (currentValue).toString().length + fontSize() / 2, 0);
				row.forEach((text) => {
					width -= fontSize() / 2 * (text).toString().length + fontSize() / 2;
					const txt = new Text(text.toString(), fontSize());
					txt.horizontalAlign = 'right';
					txt.verticalAlign = 'center';
					txt.x = x - PercentageToPixels(space.board.left) - width;
					txt.y = y + gridCellSize / 2 + (gridCellSize + PercentageToPixels(board.lineThickness)) * i;
					txt.render();
				});
			});

			if (healthBar.current <= 0) {
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
function clear(): void {
	// overwrites previous frame with new background
	ctx.fillStyle = 'oklch(0.2 0.01 277 / 100%)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//change mouse pointer back to default
	document.body.style.cursor = '';
}

/*==================================================
	Start/Win/Lose Screen
==================================================*/
function menuScreen(text: string): void {
	animation = undefined;

	let width: number = 0;
	let height: number = 0;
	let x: number = 0;
	let y: number = 0;

	/*==================================================
		Tint
	==================================================*/
	ctx.fillStyle = 'oklch(0.2 0.01 277 / 50%)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	/*==================================================
		Title Text
	==================================================*/
	const title = new Text(text, PercentageToPixels(5.4));
	title.horizontalAlign = 'center';
	title.verticalAlign = 'center';
	title.x = canvas.width * 0.5;
	title.y = canvas.height * 0.45;
	title.render();

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

	const btn = new Text('Start', PercentageToPixels(5.4));
	btn.horizontalAlign = 'center';
	btn.verticalAlign = 'center';
	btn.x = x + width / 2;
	btn.y = y + height / 2;
	btn.render();
}

/*==================================================
	Build Game
==================================================*/
export let gridCells: cell[] = [];
export let colText: number[][] = [];
export let rowText: number[][] = [];
function buildGame(dummy?: boolean) {
	gridCells = [];
	variables.total = 0;

	// Create puzzle using the sophisticated generator
	const creator = new Creator();
	const puzzle = creator.createRandom(board.numCells, board.numCells);

	if (!puzzle) {
		console.error('Failed to generate puzzle');
		return;
	}

	// Use the generated hints from the puzzle
	colText = puzzle.columnHints;
	rowText = puzzle.rowHints;

	// Create grid cells based on the puzzle solution
	gridCells = puzzle.cells.map((puzzleCell) => {
		if (puzzleCell.solution === 1) {
			variables.total++;
		}

		return new cell(
			puzzleCell.column,
			puzzleCell.row,
			puzzleCell.solution === 1 ? 'Pen' : 'Eraser'
		);
	});

	console.log('Generated puzzle:', puzzle);
	console.log('Creation time:', puzzle.creator?.creationTime, 'seconds');
	console.log('Solving time:', puzzle.creator?.solvingTime, 'seconds');

	if (!dummy) {
		healthBar.reset();
		toolBar.reset();
		variables.gameState = 'Running';
	}
}

buildGame(true);