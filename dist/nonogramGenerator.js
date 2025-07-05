import { variables } from './setting.js';
import { cell } from './cell.js';
// Pattern generators for logical nonograms
export class NonogramGenerator {
    constructor(size) {
        this.size = size;
        this.grid = Array(size).fill(null).map(() => Array(size).fill(false));
    }
    /**
     * Generate a logical nonogram using various pattern strategies
     */
    generateLogicalNonogram() {
        // Choose a pattern generation strategy
        const strategies = [
            () => this.generateSymmetricPattern(),
            () => this.generateShapePattern(),
            () => this.generateRandomConnectedPattern(),
            () => this.generateBandPattern()
        ];
        const strategy = strategies[Math.floor(Math.random() * strategies.length)];
        strategy();
        // Validate the pattern has reasonable density
        while (!this.isValidPattern()) {
            this.clearGrid();
            strategy();
        }
        return this.convertToGameObjects();
    }
    /**
     * Generate symmetric patterns (easier to solve logically)
     */
    generateSymmetricPattern() {
        const center = Math.floor(this.size / 2);
        // Generate one quadrant and mirror it
        for (let row = 0; row <= center; row++) {
            for (let col = 0; col <= center; col++) {
                if (Math.random() > 0.6) {
                    this.grid[row][col] = true;
                    this.grid[row][this.size - 1 - col] = true;
                    this.grid[this.size - 1 - row][col] = true;
                    this.grid[this.size - 1 - row][this.size - 1 - col] = true;
                }
            }
        }
    }
    /**
     * Generate simple geometric shapes
     */
    generateShapePattern() {
        const shapes = [
            () => this.drawCircle(),
            () => this.drawDiamond(),
            () => this.drawCross(),
            () => this.drawFrame()
        ];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        shape();
    }
    /**
     * Generate random but connected patterns (avoids scattered pixels)
     */
    generateRandomConnectedPattern() {
        const numSeeds = Math.floor(this.size * 0.3);
        const seeds = [];
        // Plant seeds
        for (let i = 0; i < numSeeds; i++) {
            const row = Math.floor(Math.random() * this.size);
            const col = Math.floor(Math.random() * this.size);
            seeds.push({ row, col });
            this.grid[row][col] = true;
        }
        // Grow from seeds
        seeds.forEach(seed => {
            this.growFromSeed(seed.row, seed.col, 0.7);
        });
    }
    /**
     * Generate horizontal/vertical band patterns
     */
    generateBandPattern() {
        const numBands = Math.floor(Math.random() * 3) + 2;
        const isHorizontal = Math.random() > 0.5;
        for (let i = 0; i < numBands; i++) {
            const bandWidth = Math.floor(Math.random() * 3) + 1;
            const bandStart = Math.floor(Math.random() * (this.size - bandWidth));
            if (isHorizontal) {
                for (let row = bandStart; row < bandStart + bandWidth; row++) {
                    for (let col = 0; col < this.size; col++) {
                        if (Math.random() > 0.3) {
                            this.grid[row][col] = true;
                        }
                    }
                }
            }
            else {
                for (let col = bandStart; col < bandStart + bandWidth; col++) {
                    for (let row = 0; row < this.size; row++) {
                        if (Math.random() > 0.3) {
                            this.grid[row][col] = true;
                        }
                    }
                }
            }
        }
    }
    /**
     * Shape drawing methods
     */
    drawCircle() {
        const center = this.size / 2;
        const radius = Math.floor(this.size * 0.3);
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const distance = Math.sqrt(Math.pow(row - center, 2) + Math.pow(col - center, 2));
                if (distance <= radius) {
                    this.grid[row][col] = true;
                }
            }
        }
    }
    drawDiamond() {
        const center = Math.floor(this.size / 2);
        const radius = Math.floor(this.size * 0.3);
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const distance = Math.abs(row - center) + Math.abs(col - center);
                if (distance <= radius) {
                    this.grid[row][col] = true;
                }
            }
        }
    }
    drawCross() {
        const center = Math.floor(this.size / 2);
        const thickness = Math.floor(this.size * 0.2);
        // Horizontal bar
        for (let row = center - thickness; row <= center + thickness; row++) {
            for (let col = 0; col < this.size; col++) {
                if (row >= 0 && row < this.size) {
                    this.grid[row][col] = true;
                }
            }
        }
        // Vertical bar
        for (let col = center - thickness; col <= center + thickness; col++) {
            for (let row = 0; row < this.size; row++) {
                if (col >= 0 && col < this.size) {
                    this.grid[row][col] = true;
                }
            }
        }
    }
    drawFrame() {
        const borderWidth = Math.floor(this.size * 0.15);
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (row < borderWidth || row >= this.size - borderWidth ||
                    col < borderWidth || col >= this.size - borderWidth) {
                    this.grid[row][col] = true;
                }
            }
        }
    }
    /**
     * Grow pattern from a seed point
     */
    growFromSeed(startRow, startCol, probability) {
        const stack = [{ row: startRow, col: startCol }];
        const visited = new Set();
        while (stack.length > 0) {
            const { row, col } = stack.pop();
            const key = `${row},${col}`;
            if (visited.has(key) || Math.random() > probability) {
                continue;
            }
            visited.add(key);
            this.grid[row][col] = true;
            // Add neighbors
            const neighbors = [
                { row: row - 1, col },
                { row: row + 1, col },
                { row, col: col - 1 },
                { row, col: col + 1 }
            ];
            neighbors.forEach(neighbor => {
                if (this.isValidPosition(neighbor.row, neighbor.col) &&
                    !visited.has(`${neighbor.row},${neighbor.col}`)) {
                    stack.push(neighbor);
                }
            });
        }
    }
    /**
     * Validate pattern quality
     */
    isValidPattern() {
        const filledCells = this.grid.flat().filter(cell => cell).length;
        const totalCells = this.size * this.size;
        const density = filledCells / totalCells;
        // Ensure reasonable density (not too sparse or too dense)
        return density >= 0.2 && density <= 0.7;
    }
    /**
     * Generate clues from the completed pattern
     */
    generateClues() {
        const colText = Array.from({ length: this.size }, () => []);
        const rowText = Array.from({ length: this.size }, () => []);
        // Generate row clues
        for (let row = 0; row < this.size; row++) {
            let currentRun = 0;
            for (let col = 0; col < this.size; col++) {
                if (this.grid[row][col]) {
                    currentRun++;
                }
                else {
                    if (currentRun > 0) {
                        rowText[row].push(currentRun);
                        currentRun = 0;
                    }
                }
            }
            if (currentRun > 0) {
                rowText[row].push(currentRun);
            }
            if (rowText[row].length === 0) {
                rowText[row].push(0);
            }
        }
        // Generate column clues
        for (let col = 0; col < this.size; col++) {
            let currentRun = 0;
            for (let row = 0; row < this.size; row++) {
                if (this.grid[row][col]) {
                    currentRun++;
                }
                else {
                    if (currentRun > 0) {
                        colText[col].push(currentRun);
                        currentRun = 0;
                    }
                }
            }
            if (currentRun > 0) {
                colText[col].push(currentRun);
            }
            if (colText[col].length === 0) {
                colText[col].push(0);
            }
        }
        return { colText, rowText };
    }
    /**
     * Convert pattern to game objects
     */
    convertToGameObjects() {
        const cells = [];
        let totalFilledCells = 0;
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const i = row * this.size + col;
                const isFilled = this.grid[row][col];
                if (isFilled) {
                    totalFilledCells++;
                }
                cells.push(new cell(col, row, isFilled ? 'Pen' : 'Eraser'));
            }
        }
        variables.total = totalFilledCells;
        const { colText, rowText } = this.generateClues();
        return { cells, colText, rowText };
    }
    /**
     * Helper methods
     */
    isValidPosition(row, col) {
        return row >= 0 && row < this.size && col >= 0 && col < this.size;
    }
    clearGrid() {
        this.grid = Array(this.size).fill(null).map(() => Array(this.size).fill(false));
    }
}
//# sourceMappingURL=nonogramGenerator.js.map