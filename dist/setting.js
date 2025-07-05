import { PercentageToPixels, Preload } from './util.js';
/*==================================================
    Settings
==================================================*/
export const board = Object.freeze({
    lineThickness: 0.5, // How thick the lines should be in percent
    numCells: 15, // How many cells it should be per row and column | smallest working size is 3
});
export const fontSize = () => PercentageToPixels(16 / Math.ceil(board.numCells / 2));
export const size = Object.freeze({
    healthBar: 12,
    toolBar: 12,
});
export const space = Object.freeze({
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
const imagePaths = Object.freeze([
    ['Logo', 'Phadonia.svg'],
    ['Heart_filled', 'Heart_filled.svg'],
    ['Heart_empty', 'Heart_empty.svg'],
    ['X', 'x.svg'],
    ['Pen', 'pen.svg']
]);
export const images = Preload('./assets/img/', imagePaths);
/*==================================================
    Variables the game need to run
    //! Do not touch these, okay. thanks
==================================================*/
export const variables = {
    gameState: 'Menu',
    total: 0
};
//# sourceMappingURL=setting.js.map