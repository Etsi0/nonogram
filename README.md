# Phadonia Nanogram - Logic Puzzle Game

this readme is made using claude since i'm to lazy to make one myself right now

## Table Of Content

1. [TL;DR](#tldr)
1. [Compile](#compile)
1. [Introduction](#introduction)
1. [How to Play](#how-to-play)
1. [File Descriptions](#file-descriptions)
	1. [cell.ts](#cellts)
	1. [click.ts](#clickts)
	1. [environment.ts](#environmentts)
	1. [index.ts](#indexts)
	1. [setting.ts](#settingsts)
	1. [util.ts](#utilts)
1. [Challenges and Issues](#challenges-and-issues)
1. [Technology Choices](#technology-choices)
	1. [Why TypeScript](#why-typescript)
	1. [Why JS Canvas](#why-js-canvas)
	1. [Why JSDocs](#why-jsdocs)
1. [Code Structure](#code-structure)
	1. [Naming Conventions](#naming-conventions)
		1. [Functions and classes](#functions-and-classes)
		1. [Variables](#variables)
	1. [Commenting and Documentation](#commenting-and-documentation)
		1. [Comments](#comments)
		1. [Documentation](#documentation)
	1. [Code styling](#code-styling)
	1. [File and Directory Structure](#file-and-directory-structure)
	1. [Avoiding Magic Numbers and Strings](#avoiding-magic-numbers-and-strings)
	1. [Code Reusability](#code-reusability)
1. [Tools](#tools)
	1. [Necessary Tools](#necessary-tools)
	1. [Recommended Tools](#recommended-tools)

## TL;DR

Phadonia Nanogram is a logic puzzle game where players fill in cells on a grid based on numerical clues to reveal a hidden pattern. Players use pen and eraser tools to mark cells, with a health system that penalizes incorrect tool usage.

## Compile

To compile your ts code into js code you will need to run the `npm run watch` command in your terminal

## Introduction

Phadonia Nanogram is a digital implementation of the classic nonogram puzzle game. Players must logically deduce which cells to fill based on numerical clues provided for each row and column. The game combines strategic thinking with pattern recognition, offering an engaging puzzle-solving experience with a clean, responsive interface.

## How to Play

The goal is to fill in the correct cells on the grid based on the numerical clues:

-	**Numerical Clues**: Numbers on the sides of the grid indicate consecutive filled cells in that row or column
-	**Tools**: Use the Pen tool to mark cells you believe should be filled, and the Eraser tool for cells that should remain empty
-	**Health System**: You start with 3 health points. Using the wrong tool on a cell will cost you health
-	**Victory**: Reveal all the correct cells to win the puzzle
-	**Game Over**: Lose all health points and you'll need to start over

## File Descriptions

### [cell.ts](./src/cell.ts)

Defines the cell class that represents individual grid squares. Handles cell states (Pen/Eraser), visibility, click detection, hover effects, and rendering based on the current tool selection.

### [click.ts](./src/click.ts)

Handles mouse interaction events including click detection, cursor position tracking, and hover states. Manages the mouse object that other components use for user input.

### [environment.ts](./src/environment.ts)

Contains core environment variables including canvas and context references that are used throughout the project for rendering operations.

### [index.ts](./src/index.ts)

Serves as the main entry point and game loop controller. Manages game states (Menu, Running, Win, Lose), handles puzzle generation, renders numerical clues, and coordinates the overall game flow.

### [setting.ts](./src/setting.ts)

Stores game configuration including board dimensions, padding, line thickness, tool types, and game state management. Also handles image preloading for game assets.

### [util.ts](./src/util.ts)

Provides utility functions for canvas operations, text rendering, coordinate calculations, and common game mechanics used across multiple components to maintain code reusability.

## Challenges and Issues

One of the main challenges was implementing the puzzle generation algorithm to create solvable nonogram puzzles. The current implementation uses random generation which creates valid puzzles, but future iterations could benefit from more sophisticated algorithms that ensure unique solutions and varying difficulty levels. Additionally, balancing the health system to provide appropriate challenge without frustration required careful tuning.

## Technology Choices

### Why TypeScript

TypeScript was chosen for its strong typing capabilities, which enhance code reliability and maintainability. By catching potential errors at compile-time rather than at runtime, it significantly improves the development experience for a game with complex state management.

### Why JS Canvas

The JS Canvas API was chosen for rendering the game due to its performance and flexibility for 2D graphics. Canvas provides precise control over drawing operations, which is essential for rendering grid-based puzzles with clean lines and responsive interactions.

### Why JSDocs

JSDocs provides comprehensive documentation, making the codebase easier to understand and contribute to. This is particularly important for utility functions and complex game logic that may need modification or extension.

## Code Structure

### Naming Conventions

#### Functions and classes

Use `PascalCase` for both classes and functions.

#### Variables

Use `camelCase` for variables

### Commenting and Documentation

#### Comments

Use comments to explain the "why" and not the "what". Comments should be used sparingly to avoid cluttering the code, focusing on explaining complex or non-obvious parts of the implementation.

#### Documentation

Maintain up-to-date JSDocs for all functions and classes.

### Code styling

Install the Prettier extension so everyone can utilize the same code styling settings (.prettierrc). Prettier automatically formats the code according to predefined rules, ensuring that all developers follow the same style guidelines.

### File and Directory Structure

Place code in the "src" directory and place images, SVGs, and other assets in the "assets" directory. This separation ensures a well-structured project that is easy to navigate.

### Avoiding Magic Numbers and Strings

Avoid using magic numbers and strings directly in the code. Instead, define them as constants with meaningful names. This practice enhances code readability and makes it easier to update game parameters.

### Code Reusability

Strive for DRY (Don't Repeat Yourself) principles by abstracting reusable code into classes, functions, or variables. This is particularly important for grid operations and rendering functions.

## Tools

### Necessary Tools

-	[Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) - Helps in identifying and correcting spelling errors in the code.
-	[Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) - Provides a local development server with live reload capability.
-	[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Ensures consistent code formatting across the project.

### Recommended Tools

-	[Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag) - Automatically renames paired HTML tags.
-	[Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments) - Enhances comment readability with color-coded annotations.
-	[Class Collapse](https://marketplace.visualstudio.com/items?itemName=Etsi0.class-collapse) - Allows for easy navigation and collapsing of class definitions.
-	[CSS Peek](https://marketplace.visualstudio.com/items?itemName=pranaygp.vscode-css-peek) - Provides quick access to CSS definitions directly from HTML files.
-	[GitLens — Git supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) - Enhances the Git capabilities within VSCode, making it easier to manage version control.