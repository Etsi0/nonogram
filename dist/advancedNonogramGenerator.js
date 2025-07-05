import { NonogramGenerator } from "./nonogramGenerator.js";
// Optional: Add difficulty levels to your NonogramGenerator
export class AdvancedNonogramGenerator extends NonogramGenerator {
    /**
     * Generate nonogram with specific difficulty
     */
    generateWithDifficulty(difficulty) {
        let attempts = 0;
        let result;
        do {
            result = this.generateLogicalNonogram();
            attempts++;
        } while (!this.matchesDifficulty(result, difficulty) && attempts < 10);
        return result;
    }
    /**
     * Check if generated puzzle matches desired difficulty
     */
    matchesDifficulty(puzzle, difficulty) {
        const complexity = this.calculateComplexity(puzzle);
        switch (difficulty) {
            case 'easy':
                return complexity < 0.3;
            case 'medium':
                return complexity >= 0.3 && complexity < 0.7;
            case 'hard':
                return complexity >= 0.7;
            default:
                return true;
        }
    }
    /**
     * Calculate puzzle complexity based on clue patterns
     */
    calculateComplexity(puzzle) {
        let complexity = 0;
        const allClues = [...puzzle.colText, ...puzzle.rowText];
        for (const clueSet of allClues) {
            // More numbers = more complex
            complexity += clueSet.length * 0.1;
            // Large numbers = easier (continuous blocks)
            const maxClue = Math.max(...clueSet);
            complexity -= maxClue * 0.05;
            // Multiple small numbers = harder
            const smallClues = clueSet.filter(c => c > 0 && c <= 2).length;
            complexity += smallClues * 0.15;
        }
        return Math.max(0, Math.min(1, complexity));
    }
    /**
     * Validate that puzzle is actually solvable using logic
     * (Basic implementation - could be expanded)
     */
    validateSolvability(puzzle) {
        // This is a simplified check - you could implement a full solver
        // For now, we check that clues are consistent with grid constraints
        for (let i = 0; i < puzzle.colText.length; i++) {
            const colClues = puzzle.colText[i];
            const minSpaceNeeded = colClues.reduce((sum, clue) => sum + clue, 0) + Math.max(0, colClues.length - 1);
            if (minSpaceNeeded > this.size) {
                return false; // Impossible to fit clues in column
            }
        }
        for (let i = 0; i < puzzle.rowText.length; i++) {
            const rowClues = puzzle.rowText[i];
            const minSpaceNeeded = rowClues.reduce((sum, clue) => sum + clue, 0) + Math.max(0, rowClues.length - 1);
            if (minSpaceNeeded > this.size) {
                return false; // Impossible to fit clues in row
            }
        }
        return true;
    }
}
//# sourceMappingURL=advancedNonogramGenerator.js.map