import { PercentageToPixels, Preload } from './util';

/*==================================================
	Types
==================================================*/
type TBoard = {
	lineThickness: number;
	numCells: number;
};

type TSize = {
	healthBar: number,
	toolBar: number
}

type TSpacing = {
	board: {
		left: number,
		top: number,
		right: number,
		bottom: number
	},
	workarea: {
		left: number,
		top: number,
		right: number,
		bottom: number,
		gap: number
	}
}

export type TTool = 'Pen' | 'Eraser' | 'Hint';
type TState = 'Menu' | 'Running' | 'Win' | 'Lose';
type TVariables = {
	gameState: TState
	total: number
}

/*==================================================
	Settings
==================================================*/
export const board: Readonly<TBoard> = Object.freeze({
	lineThickness: 0.125, // How thick the lines should be in percent
	numCells: 15, // How many cells it should be per row and column | smallest working size is 3
});

export const fontSize = () => PercentageToPixels(16 / Math.ceil(board.numCells/2.5));

export const size: Readonly<TSize> = Object.freeze({
	healthBar: 12,
	toolBar: 12,
});

export const space: Readonly<TSpacing> = Object.freeze({
	board: {
		left: 1,
		top: 1,
		right: 0,
		bottom: 0
	},
	workarea: {
		left: 1,
		top: 5,
		right: 1,
		bottom: 5,
		gap: 1
	}
});

/*==================================================
	Image preloader
==================================================*/
// Import assets using Vite's asset handling
import LogoUrl from '../assets/img/Phadonia.svg?url';
import HeartFilledUrl from '../assets/img/Heart_filled.svg?url';
import HeartEmptyUrl from '../assets/img/Heart_empty.svg?url';
import XUrl from '../assets/img/x.svg?url';
import PenUrl from '../assets/img/pen.svg?url';

const imagePaths: Readonly<string[][]> = Object.freeze([
	['Logo', LogoUrl],
	['Heart_filled', HeartFilledUrl],
	['Heart_empty', HeartEmptyUrl],
	['X', XUrl],
	['Pen', PenUrl]
]);

export const images: { [x: string]: HTMLImageElement } = Preload('', imagePaths);

/*==================================================
	Variables the game need to run
	//! Do not touch these, okay. thanks
==================================================*/
export const variables: TVariables = {
	gameState: 'Menu',
	total: 0
};