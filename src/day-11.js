const fs = require('fs');
const path = require('path');

const initialInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8')
    .split('\n')
    .filter(l => l.trim() !== '')
    .map(l => l
        .split('')
        .map(item => {
            return {
                energy: parseInt(item),
                flashed: 0
            }
        }));

function ripple(grid) {
    let rippleAgain = false;

    grid.forEach((row, rowIndex) => row.forEach((octopus, colIndex) => {
        if (octopus.energy <= 9) {
            return;
        }

        octopus.energy = 0;
        octopus.flashed++;

        const adjacentCoordinates = [
            [rowIndex - 1, colIndex - 1],
            [rowIndex - 1, colIndex],
            [rowIndex - 1, colIndex + 1],
            [rowIndex, colIndex - 1],
            [rowIndex, colIndex + 1],
            [rowIndex + 1, colIndex - 1],
            [rowIndex + 1, colIndex],
            [rowIndex + 1, colIndex + 1],
        ];

        adjacentCoordinates
            .filter(([peekRowIndex, peekColIndex]) => peekRowIndex >= 0
                && peekRowIndex < grid.length
                && peekColIndex >= 0
                && peekColIndex < grid[peekRowIndex].length)
            .forEach(([peekRowIndex, peekColIndex]) => {
                const adjacentOctopus = grid[peekRowIndex][peekColIndex];
                if (adjacentOctopus.energy > 0 && adjacentOctopus.energy <= 9) {
                    adjacentOctopus.energy++;
                }
                if (adjacentOctopus.energy > 9) {
                    rippleAgain = true;
                }
            });
    }));

    if (rippleAgain) {
        ripple(grid);
    }
}

let grid = initialInput;
Array(100).fill(0).forEach(() => {
    grid.forEach(row => row.forEach(octopus => {
        octopus.energy++;
    }));
    ripple(grid);
})

module.exports = {
    'Part #1': grid.reduce((sum, row) => sum + row.reduce((sum, octopus) => sum + octopus.flashed, 0), 0)
};