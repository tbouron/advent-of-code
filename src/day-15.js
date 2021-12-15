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

    const vertices = grid.flatMap(row => row.filter(col => col.visited === true));

    if (row === 0 && col === 0) {
        vertices.push(currentNode);
    }

    // console.log(`=> Go to [${row}] [${col}] | Risk ${currentNode.risk} | Distance ${currentNode.distance} | Vertices`, vertices.length);

    // This is for test on the actual input. I can manage to go up to the center point of the graph, but no further :(
    // if (row === 45 && col === 45) {
    if (row === grid.length - 1 && col === grid[row].length - 1) {
        return currentNode
    }

    const neighbours = vertices.flatMap(vertex => {
        const ns = [];
        // UP
        if (vertex.row > 0 && !vertices.includes(grid[vertex.row - 1][vertex.col])) {
            ns.push(grid[vertex.row - 1][vertex.col]);
        }
        // LEFT
        if (vertex.col > 0 && !vertices.includes(grid[vertex.row][vertex.col - 1])) {
            ns.push(grid[vertex.row][vertex.col - 1]);
        }
        // RIGHT
        if (vertex.col < grid[vertex.row].length - 1 && !vertices.includes(grid[vertex.row][vertex.col + 1])) {
            ns.push(grid[vertex.row][vertex.col + 1]);
        }
        // DOWN
        if (vertex.row < grid.length - 1 && !vertices.includes(grid[vertex.row + 1][vertex.col])) {
            ns.push(grid[vertex.row + 1][vertex.col]);
        }
        return ns;
    });

    const sortedNeighbours = neighbours
        .map(n => {
            if (n.distance === 0 || n.distance > n.risk + currentNode.distance) {
                n.distance = n.risk + currentNode.distance;
            }
            return n;
        })
        .sort((a, b) => a.distance - b.distance);

    let nextNode;
    for (nextNode of sortedNeighbours) {
        if (!vertices.includes(nextNode)) {
            break;
        }
    }

    if (!nextNode) {
        throw new Error('Fail to get the next node');
    }

    return dijkstra(grid, nextNode.row, nextNode.col);
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

const endNode = dijkstra(initialInput);

module.exports = {
    'Part #1': endNode.distance
};