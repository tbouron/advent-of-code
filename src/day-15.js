const fs = require('fs');
const path = require('path');

function dijkstra(grid, row = 0, col = 0) {
    if (row >= grid.length) {
        throw new Error(`The row index [${row}] is out of bound`);
    }
    if (col >= grid[row].length) {
        throw new Error(`The row index [${col}] is out of bound`);
    }

    const currentNode = grid[row][col];
    currentNode.visited = true;

    // const vertices = grid.flatMap(row => row.filter(col => col.visited === true));

    // if (row === 0 && col === 0) {
    //     vertices.push(currentNode);
    // }

    console.log(`=> Go to [${row}] [${col}] | Risk ${currentNode.risk} | Distance ${currentNode.distance} | Vertices`);

    // This is for test on the actual input. I can manage to go up to the center point of the graph, but no further :(
    // if (row === 60 && col === 60) {
    if (row === grid.length - 1 && col === grid[row].length - 1) {
        return currentNode
    }

    const neighbours = grid.flatMap(row => row.filter(col => col.visited === true)).flatMap(vertex => {
        const ns = [];
        // UP
        if (vertex.row > 0 && !grid[vertex.row - 1][vertex.col].visited) {
            ns.push(grid[vertex.row - 1][vertex.col]);
        }
        // LEFT
        if (vertex.col > 0 && !grid[vertex.row][vertex.col - 1].visited) {
            ns.push(grid[vertex.row][vertex.col - 1]);
        }
        // RIGHT
        if (vertex.col < grid[vertex.row].length - 1 && !grid[vertex.row][vertex.col + 1].visited) {
            ns.push(grid[vertex.row][vertex.col + 1]);
        }
        // DOWN
        if (vertex.row < grid.length - 1 && !grid[vertex.row + 1][vertex.col].visited) {
            ns.push(grid[vertex.row + 1][vertex.col]);
        }
        return ns;
    }).map(n => {
        if (n.distance === 0 || n.distance > n.risk + currentNode.distance + h(grid, n)) {
            n.distance = n.risk + currentNode.distance
        }
        return n;
    })

    const nextNode = neighbours.reduce((nextNode, n) => {
        if (n.distance < nextNode.distance) {
            nextNode = n;
        }
        return nextNode;
    }, neighbours[0]);

    if (!nextNode) {
        throw new Error('Fail to get the next node');
    }

    // vertices = vertices.concat(nextNode);

    return dijkstra(grid, nextNode.row, nextNode.col);
}

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

        current.visited = true;

        // console.log(`=> Go to [${current.row}] [${current.col}] | Risk ${current.risk} | Score ${gScore.get(current)}`);

        if (current === endNode) {
            return gScore.get(current);
        }

        openSet.delete(current);

        const ns = [];
        // UP
        if (current.row > 0 && !openSet.has(grid[current.row - 1][current.col])) {
            ns.push(grid[current.row - 1][current.col]);
        }
        // LEFT
        if (current.col > 0 && !openSet.has(grid[current.row][current.col - 1])) {
            ns.push(grid[current.row][current.col - 1]);
        }
        // RIGHT
        if (current.col < grid[current.row].length - 1 && !openSet.has(grid[current.row][current.col + 1])) {
            ns.push(grid[current.row][current.col + 1]);
        }
        // DOWN
        if (current.row < grid.length - 1 && !openSet.has(grid[current.row + 1][current.col])) {
            ns.push(grid[current.row + 1][current.col]);
        }

        ns.forEach(n => {
            const tentativeScore = gScore.get(current) + n.risk;
            if (tentativeScore < gScore.get(n) || Infinity) {
                cameFrom[n] = current;
                gScore.set(n, tentativeScore);
                fScore.set(n, tentativeScore + h(grid, n));
                // if (!openSet.has(n)) {
                    openSet.add(n);
                // }
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
            distance: 0,
            row: rowIndex,
            col: colIndex
        }
    }));

// const endNode = dijkstra(initialInput);

const maxRow = initialInput.length - 1;
const maxCol = initialInput[initialInput.length - 1].length - 1;

module.exports = {
    'Part #1': aStar(initialInput, initialInput[0][0], initialInput[maxRow][maxCol], hEuclidean)
};