const fs = require('fs');
const path = require('path');

function doOrigami(points, folds) {
    // Do fold
    let newPoints = points.map(p => Array.from(p));
    folds.forEach(([axe, coord]) => {
        newPoints = newPoints.map(([x, y]) => {
            if (axe === 'x' && x > coord) {
                return [coord - (x - coord), y];
            }
            if (axe === 'y' && y > coord) {
                return [x, coord - (y - coord)];
            }
            return [x, y];
        })
    });

    const maxX = Math.max(...newPoints.map(([x, y]) => x));
    const maxY = Math.max(...newPoints.map(([x, y]) => y));

    const grid = Array(maxX + 1).fill(0).map(() => Array(maxY + 1).fill(0));

    newPoints.forEach(([x, y]) => {
        grid[x][y] += 1;
    });

    return grid;
}

function visualiseOrigami(grid) {
    const maxX = grid.length;
    const maxY = grid[0].length;

    const text = [];
    for (let y = 0; y < maxY; y++) {
        const line = [];
        for (let x = 0; x < maxX; x++) {
            line.push(grid[x][y] > 0 ? '##' : '  ');
        }
        text.push(line.join(''));
    }

    return text.join('\n');
}

const initialInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8')
    .split('\n\n')
    .filter(l => l.trim() !== '');

const points = initialInput[0]
    .split('\n')
    .map(l => l
        .split(',')
        .map(item => parseInt(item.trim())));

const folds = initialInput[1]
    .split('\n')
    .map(l => l
        .replace('fold along', '')
        .trim()
        .split('=')
        .map((v, index) => index === 1 ? parseInt(v) : v));

module.exports = {
    'Part #1': doOrigami(points, folds.slice(0, 1))
        .reduce((total, col) => total + col.filter(p => p > 0).length, 0),
    'Part #2': '\n' + visualiseOrigami(doOrigami(points, folds))
}