const fs = require('fs');
const path = require('path');

function dijkstra(grid, row = 0, col = 0, vertices = []) {
    if (row >= grid.length) {
        throw new Error(`The row index [${row}] is out of bound`);
    }
    if (col >= grid[row].length) {
        throw new Error(`The row index [${col}] is out of bound`);
    }

    const currentNode = grid[row][col];

    // console.log(`=> Go to [${row}] [${col}] | Risk ${currentNode.risk} | Distance ${currentNode.distance}`);

    if (row === grid.length - 1 && col === grid[row].length - 1) {
        return currentNode
    }

    if (row === 0 && col === 0) {
        vertices.push({
            node: currentNode,
            row,
            col
        });
    }

    const neighbours = vertices.flatMap(vertex => {
        const ns = [];
        // UP
        if (vertex.row > 0) {
            ns.push({
                node: grid[vertex.row - 1][vertex.col],
                row: vertex.row - 1,
                col: vertex.col
            });
        }
        // LEFT
        if (vertex.col > 0) {
            ns.push({
                node: grid[vertex.row][vertex.col - 1],
                row: vertex.row,
                col: vertex.col - 1
            });
        }
        // RIGHT
        if (vertex.col < grid[vertex.row].length - 1) {
            ns.push({
                node: grid[vertex.row][vertex.col + 1],
                row: vertex.row,
                col: vertex.col + 1
            });
        }
        // DOWN
        if (vertex.row < grid.length - 1) {
            ns.push({
                node: grid[vertex.row + 1][vertex.col],
                row: vertex.row + 1,
                col: vertex.col
            });
        }
        return ns;
    });

    const sortedNeighbours = neighbours
        .filter(ns => !vertices.some(v => ns.row === v.row && ns.col === v.col))
        .map(n => {
            if (n.node.distance === 0 || n.node.distance > n.node.risk + currentNode.distance) {
                n.node.distance = n.node.risk + currentNode.distance;
            }
            return n;
        })
        .sort((a, b) => a.node.distance - b.node.distance);

    let nextNode;
    for (nextNode of sortedNeighbours) {
        if (!vertices.includes(nextNode)) {
            vertices.push(nextNode);
            break;
        }
    }

    return dijkstra(grid, nextNode.row, nextNode.col, vertices);
}


const initialInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8')
    .split('\n')
    .filter(l => l.trim() !== '')
    .map(l => l.split('').map(item => {
        return {
            risk: parseInt(item),
            distance: 0
        }
    }));

const endNode = dijkstra(initialInput);

module.exports = {
    'Part #1': endNode.distance
};