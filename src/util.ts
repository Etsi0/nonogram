import { canvas, ctx } from './environment.js';
import { board, size, space } from './setting.js';
import { mouse } from './click.js';
import { GameLoop, gridCells } from './index.js';

type TImageObj = {
	[x: string]: HTMLImageElement;
};
export type coords = { x: number; y: number };

/**
 * Loads images from specified paths and returns a map of `img` elements indexed by name.
 * Images are loaded asynchronously.
 * @param { Readonly<string> | string } basePath - The base path to the images.
 * @param { Readonly<string[][]> | string[][] } images - An array of `[imageName, imagePath]` pairs.
 * @param { Function } [callback] - Optional callback that gets executed when all images are loaded.
 * @returns { TImageObj } An object mapping each `imageName` to its corresponding loaded `HTMLImageElement`.
 * @throws { Error } Logs an error to the console if an image fails to load.
 * @example
 * const images = Preload('./path/to/', [['imageName', 'image.extension']], () => {
 *     console.log(images) // Outputs all the images that got loaded
 * });
 */
export function Preload(
	basePath: Readonly<string> | string,
	images: Readonly<string[][]> | string[][],
	callback?: () => void
): TImageObj {
	return [...images].reduce((accumulator: TImageObj, [name, path]: string[]) => {
		// Creates new element
		const img = new Image();
		img.src = basePath + path;

		// Checks if the image got loaded or not
		img.onload = () => {
			accumulator[name] = img;
			if (Object.keys(accumulator).length === images.length) {
				GameLoop();
				callback?.();
			}
		};
		img.onerror = () => {
			console.error(`Failed to load image: ${img.src}`);
		};

		return accumulator;
	}, {});
}

/**
 * Resizes the canvas to fill the current window size.
 * Adjusts square positions based on the new dimensions.
 * Adjusts icons position and size based on the new dimensions.
 * This function should be called on window `load` and window `resize` to ensure the canvas always uses all the available space.
 * @example
 * addEventListener('load', ResizeCanvas);
 * addEventListener('resize', ResizeCanvas);
 */
export function ResizeCanvas(): void {
	const dpr = window.devicePixelRatio;
	const wW = window.innerWidth;
	const wH = window.innerHeight;

	canvas.style.width = wW + 'px';
	canvas.style.height = wH + 'px';

	canvas.width = wW * dpr;
	canvas.height = wH * dpr;

	executeActionOnCells('resize');
}

export function GetWorkareaDimensions(): { height: number, width: number, x: number, y: number } {
	let width = Math.min(canvas.width, canvas.height);
	width = width - width * (space.workarea.left / 100 + space.workarea.right / 100);

	let height = canvas.height;
	height = height - height * (space.workarea.top / 100 + space.workarea.bottom / 100);

	const x = (canvas.width - width) * (space.workarea.left / (space.workarea.left + space.workarea.right));
	const y = (canvas.height - height) * (space.workarea.top / (space.workarea.top + space.workarea.bottom));

	return {
		height,
		width,
		x,
		y
	};
}

/**
 * Calculates the size of the board and the padding needed to center it within a canvas.
 * This function depends on the global variables `canvas` (with width and height properties) and `pEdge` (percentage for edge padding).
 * @returns { Object } An object containing properties for board size, horizontal padding, and vertical padding.
 * @example
 * const dimensions = getBoardDimensions();
 * console.log(`Board size: ${dimensions.boardSize}px`);
 */
export function GetBoardDimensions(): { [x: string]: number } {
	const workarea = GetWorkareaDimensions();
	const boardSize = Math.min(
		workarea.width - PercentageToPixels(16 + space.board.left),
		workarea.height - PercentageToPixels(size.healthBar + space.workarea.gap + 21.5 + space.board.top + space.board.bottom + space.workarea.gap + size.toolBar)
	);

	const gridCellSize = (boardSize - PercentageToPixels(board.lineThickness) * (board.numCells - 1)) / board.numCells;

	const x = Math.max(workarea.x + PercentageToPixels(16 + space.board.left), workarea.x + (workarea.width - boardSize) / 2);
	const y = Math.max(workarea.y + PercentageToPixels(size.healthBar + space.workarea.gap + 21.5 + space.board.top), workarea.y + (workarea.height - boardSize) / 2);

	return {
		height: boardSize,
		gridCellSize,
		width: boardSize,
		x,
		y,
	};
}

/**
 * Converts a percentage-based size into pixels, based on the board size.
 * If no board size is provided, the current board dimensions are used.
 * @param { number } n - The size of the object in percent
 * @returns { number } The size of the object in pixels
 * @example
 * const size = PercentageToPixels(10); // Converts 10% of the board size to pixels.
 * console.log(size) // Outputs the size in pixels.
 */
export function PercentageToPixels(n: number): number {
	return Math.min(canvas.width, canvas.height) * (n / 100);
}

export function executeActionOnCells(action: 'draw' | 'update' | 'resize'): void {
	gridCells.forEach((cell) => {
		cell[action].call(cell);
	});
}

export function isInside(x: number, y: number, width: number, height: number): boolean {
	return (
		mouse.x >= x &&
		mouse.x <= x + width &&
		mouse.y >= y &&
		mouse.y <= y + height
	);
}

export function getColor(lightness: number): void {
	const chroma = lightness <= 0.5 ? 0.4 * lightness : 0.4 - 0.4 * lightness;
	ctx.fillStyle = `oklch(${lightness} ${chroma} 277 / 100%)`;
}

export class Text {
	private text: string;
	public height: number;
	public horizontalAlign: 'left' | 'center' | 'right' = 'left';
	public verticalAlign: 'top' | 'center' | 'bottom' = 'top';
	public width: number;
	public x: number;
	public y: number;

	constructor(text: string, fontSize: number) {
		ctx.font = `${fontSize}px Inter`;
		ctx.fillStyle = 'white';
		ctx.textBaseline = 'ideographic';

		this.text = text;

		const metrics = ctx.measureText(this.text);
		this.height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent + PercentageToPixels(1);
		this.width = fontSize / 2 * text.length;
	}

	render() {
		ctx.textAlign = this.horizontalAlign;

		switch (this.verticalAlign) {
			case 'center':
				this.y += this.height / 2;
				break;
			case 'bottom':
				this.y += this.height;
				break;
		}

		ctx.fillText(this.text, this.x, this.y);
	}
}