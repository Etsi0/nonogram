import { settings, history, checkArray } from './setting.js';
/**
 * Prepares the game board history for the win condition check.
 * Sorts history for the given piece and looks if the topmost coordinate has at least one coordinate that is 0.
 * @param piece - which piece it is.
 * @returns `true` if the specified player has won, otherwise `false`.
 * @example
 * console.log(WinConPrep('PLAYER')) // Returns `true` if PLAYER has won
 */
export function WinConPrep(piece) {
    // Sorts the array so we only need to take the element that is the farthest up and look down from there.
    const sortedHistory = structuredClone(history[piece].coords).sort((a, b) => {
        return a.y === b.y ? a.x - b.x : a.y - b.y;
    });
    // X or/and Y must be 0 to make a line, so this if statement makes it so the code doesn't need to check the rest unnecessarily
    if (!sortedHistory[0] || (sortedHistory[0].x !== 0 && sortedHistory[0].y !== 0)) {
        return false;
    }
    return WinCon(piece, sortedHistory[0], { x: 0, y: 0 }, settings.numCells - 1);
}
/**
 * Recursively checks if there are enough pieces in a row to declare a win.
 * The function starts without a specified direction and establishes one if possible. Once a direction is found, it follows that direction
 * checking for more pieces.
 * @param { keyof typeof history } piece - Which piece it is.
 * @param { coords } currentValue - The previous squares coordinates.
 * @param { coords } direction - What direction it should more from the `currentValue`.
 * @param { number } count - A decrementing count that should start with the number that represents the number of pieces that is required to make a line.
 * @returns { boolean } `true` if someone has won, otherwise `false`.
 */
function WinCon(piece, currentValue, direction, count) {
    const newCount = count - 1;
    if (direction.x === 0 && direction.y === 0) {
        // Initial call, no direction set
        for (const dir in checkArray) {
            const nextValue = {
                x: currentValue.x + checkArray[dir].x,
                y: currentValue.y + checkArray[dir].y,
            };
            if (IsMatchingPiece(piece, nextValue)) {
                return WinCon(piece, nextValue, checkArray[dir], newCount);
            }
        }
    }
    else {
        // Direction already set, follow it
        const nextValue = {
            x: currentValue.x + direction.x,
            y: currentValue.y + direction.y,
        };
        if (IsMatchingPiece(piece, nextValue)) {
            if (newCount === 0) {
                return true;
            }
            return WinCon(piece, nextValue, direction, newCount);
        }
    }
    return false;
}
/**
 * Checks if there is a piece at the given coordinates.
 * @param { keyof typeof history } piece - Which piece it is.
 * @param { coords } coordinate - The coordinates to check.
 * @returns { boolean } `true` if there type of piece exist on that square, otherwise `false`.
 */
function IsMatchingPiece(piece, coordinate) {
    return history[piece].coords.some((item) => coordinate.x === item.x && coordinate.y === item.y);
}
//# sourceMappingURL=won.js.map