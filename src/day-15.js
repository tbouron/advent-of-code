const fs = require('fs');
const path = require('path');

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

        // console.log(`=> Go to [${current.row}] [${current.col}] | Risk ${current.risk} | Score ${gScore.get(current)}`);

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

const initialInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8')
    .split('\n')
    .filter(l => l.trim() !== '')
    .map((l, rowIndex) => l.split('').map((item, colIndex) => {
        return {
            risk: parseInt(item),
            visited: false,
            row: rowIndex,
            col: colIndex
        }
    }));

const maxRow = initialInput.length - 1;
const maxCol = initialInput[initialInput.length - 1].length - 1;

module.exports = {
    'Part #1': aStar(initialInput, initialInput[0][0], initialInput[maxRow][maxCol], hEuclidean)
};