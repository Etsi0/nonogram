import { canvas, ctx } from './environment.js';
import { board } from './setting.js';
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
	canvas.style.width = window.innerWidth + 'px';
	canvas.style.height = window.innerHeight + 'px';

	const DRP = window.devicePixelRatio || 1;
	canvas.width = window.innerWidth * DRP;
	canvas.height = window.innerHeight * DRP;
	ctx.scale(DRP, DRP);

	executeActionOnCells(['gotResized']);
}

export function GetWorkareaDimensions(): { [x: string]: number } {
	const smallestSide = Math.min(canvas.width, canvas.height);
	const biggestPadding = Math.max(board.paddingLeft / 100 + board.paddingRight / 100, board.paddingTop / 100 + board.paddingBottom / 100);
	const size = smallestSide - smallestSide * biggestPadding;

	const x = (canvas.width - size) * (board.paddingLeft / (board.paddingLeft + board.paddingRight));
	const y = (canvas.height - size) * (board.paddingTop / (board.paddingTop + board.paddingBottom));

	return {
		size,
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
	const boardSize = workarea.size - PercentageToPixels(16);

	const gridCellSize = (boardSize - PercentageToPixels(board.lineThickness) * (board.numCells - 1)) / board.numCells;

	const x = workarea.x + PercentageToPixels(16);
	const y = workarea.y + PercentageToPixels(16);

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

export function executeActionOnCells(actions: ('draw' | 'gotClicked' | 'gotHovered' | 'gotResized')[]): void {
	if (!gridCells.length) {
		return;
	}

	gridCells.forEach((cell) => {
		actions.forEach((action) => {
			cell[action]();
		});
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
	private verticalAlign: boolean;
	public height: number;
	public width: number;
	public x: number;
	public y: number;

	constructor(text: string, fontSize: number, verticalAlign?: boolean) {
		ctx.font = `${fontSize}px Inter`;
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';

		this.text = text;
		this.verticalAlign = verticalAlign;

		const metrics = ctx.measureText(this.text);
		this.height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent + PercentageToPixels(1);
		this.width = metrics.width;
	}

	render() {
		ctx.fillText(this.text, this.x, this.y + (this.verticalAlign ? this.height / 2 : 0));
	}
}
export function styledText(text: string, x: number, y: number, verticalAlign?: boolean): number {
	const fontSize = PercentageToPixels(5.4);
	ctx.font = `${fontSize}px Inter`;
	ctx.fillStyle = 'white';
	ctx.textAlign = 'center';
	if (verticalAlign) {
		ctx.textBaseline = 'ideographic';
		y += fontSize / 2;
	}
	const width = ctx.measureText(text).width;
	ctx.fillText(text, x, y);
	return width;
}