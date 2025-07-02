import { Preload } from './util.js';

/*==================================================
	Types
==================================================*/
type TBoard = {
	paddingLeft: number;
	paddingTop: number;
	paddingRight: number;
	paddingBottom: number;
	lineThickness: number;
	numCells: number;
};

export type TTool = 'Pen' | 'Eraser' | 'Hint';
type TState = 'Menu' | 'Running' | 'Win' | 'Lose';
type TVariables = {
	gameState: TState
	tool: TTool
	total: number
	health: number
}

/*==================================================
	Settings
==================================================*/
export const board: TBoard = Object.freeze({
	paddingLeft: 5,
	paddingTop: 5,
	paddingRight: 5,
	paddingBottom: 5,
	lineThickness: 0.5, // How thick the lines should be in percent
	numCells: 15, // How many cells it should be per row and column | smallest working size is 3
});

/*==================================================
	Image preloader
==================================================*/
const imagePaths: Readonly<string[][]> = Object.freeze([
	['Logo', 'Phadonia.svg']
]);
export const images: { [x: string]: HTMLImageElement } = Preload('./assets/img/', imagePaths);

/*==================================================
	Variables the game need to run
	//! Do not touch these, okay. thanks
==================================================*/
export const variables: TVariables = {
	gameState: 'Menu',
	tool: 'Pen',
	total: 0,
	health: 3
};