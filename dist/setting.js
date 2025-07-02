import { Preload } from './util.js';
/*==================================================
    Settings
==================================================*/
export const board = Object.freeze({
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
const imagePaths = Object.freeze([
    ['Logo', 'Phadonia.svg']
]);
export const images = Preload('./assets/img/', imagePaths);
/*==================================================
    Variables the game need to run
    //! Do not touch these, okay. thanks
==================================================*/
export const variables = {
    gameState: 'Menu',
    tool: 'Pen',
    total: 0,
    health: 3
};
//# sourceMappingURL=setting.js.map