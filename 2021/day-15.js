const fs = require('fs');
const path = require('path');
const debug = require('debug')(path.basename(__filename));

function aStar(grid, startNode, endNode, h) {
    let openSet = new Set();
    openSet.add(startNode);
    let cameFrom = {};

    let gScore = new Map();
    gScore.set(startNode, 0);

    let fScore = new Map();
    fScore.set(startNode, h(grid, startNode))

    while (openSet.size > 0) {
        const current = Array.from(openSet).reduce((current, node) => {
            if (current === null) {
                current = node;
            }
            if (fScore.has(node) && fScore.has(current) && fScore.get(node) < fScore.get(current)) {
                current = node;
            }
            return current;
        }, null);

        debug(`=> Go to [${current.row}] [${current.col}] | Risk ${current.risk} | Score ${gScore.get(current)}`);

        if (current === endNode) {
            return gScore.get(current);
        }

        openSet.delete(current);

        const ns = [];
        // UP
        if (current.row > 0) {
            ns.push(grid[current.row - 1][current.col]);
        }
        // LEFT
        if (current.col > 0) {
            ns.push(grid[current.row][current.col - 1]);
        }
        // RIGHT
        if (current.col < grid[current.row].length - 1) {
            ns.push(grid[current.row][current.col + 1]);
        }
        // DOWN
        if (current.row < grid.length - 1) {
            ns.push(grid[current.row + 1][current.col]);
        }

        ns.filter(n => n.visited === false).forEach(n => {
            const tentativeScore = gScore.get(current) + n.risk;
            if (tentativeScore < gScore.get(n) || Infinity) {
                n.visited = true;
                cameFrom[n] = current;
                gScore.set(n, tentativeScore);
                fScore.set(n, tentativeScore + h(grid, n));
                openSet.add(n);
            }
        });
    }

    throw new Error('Goal not reached');
}

function hEuclidean(grid, n) {
    return Math.sqrt((n.row - grid.length - 1) ** 2 + (n.col - grid[n.row].length - 1) ** 2);
}
function hManhattan(grid, n) {
    return (grid.length - 1 - n.row) + (grid[n.row].length - 1 - n.col);
}

function prepInput(input) {
    return input.map((row, rowIndex) => row.map((item, colIndex) => {
        return {
            risk: parseInt(item),
            visited: false,
            row: rowIndex,
            col: colIndex
        }
    }));
}

function shift(input, n) {
    return input.map(i => {
        return (i + n) < 10 ? i + n : (i + n) % 9;
    });
}

const initialInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8')
    .split('\n')
    .filter(l => l.trim() !== '')
    .map(l => l.split('').map(Number));

const inputPart1 = prepInput(initialInput);
const inputPart2 = prepInput(Array(5).fill(initialInput).reduce((acc, grid, rowIndex) => {
    return acc.concat(grid.map(row => shift(Array(5).fill(row).flatMap((input, colIndex) => {
        return shift(input, colIndex);
    }), rowIndex)));
}, []));

const maxRowPart1 = inputPart1.length - 1;
const maxColPart1 = inputPart1[inputPart1.length - 1].length - 1;
const maxRowPart2 = inputPart2.length - 1;
const maxColPart2 = inputPart2[inputPart2.length - 1].length - 1;

module.exports = {
    'Part #1': aStar(inputPart1, inputPart1[0][0], inputPart1[maxRowPart1][maxColPart1], hEuclidean),
    'Part #2': aStar(inputPart2, inputPart2[0][0], inputPart2[maxRowPart2][maxColPart2], hEuclidean),
};