const fs = require('fs');
const path = require('path');

function getStrictlyUpwardFlowPoints(row, col, heightMap) {
    const height = heightMap[row][col];
    if (height === 9) {
        return [];
    }

    // Serialize each point as JSON for Set to be able dedupe them (Set does not dedupe complex object)
    const points = [JSON.stringify({
        row,
        col,
        height
    })];

    // Calculate UP
    if (row > 0 && heightMap[row - 1][col] > height) {
        points.push(...getStrictlyUpwardFlowPoints(row - 1, col, heightMap));
    }
    // Calculate LEFT
    if (col > 0 && heightMap[row][col - 1] > height) {
        points.push(...getStrictlyUpwardFlowPoints(row, col - 1, heightMap));
    }
    // Calculate RIGHT
    if (col < heightMap[row].length - 1 && heightMap[row][col + 1] > height) {
        points.push(...getStrictlyUpwardFlowPoints(row, col + 1, heightMap));
    }
    // Calculate DOWN
    if (row < heightMap.length - 1 && heightMap[row + 1][col] > height) {
        points.push(...getStrictlyUpwardFlowPoints(row + 1, col, heightMap));
    }

    return points;
}

const initialInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8')
    .split('\n')
    .filter(l => l.trim() !== '')
    .map(l => l
        .split('')
        .map(i => parseInt(i)));

const lowestPoints = initialInput.reduce((lowPoints, row, rowIndex, heightMap) => {
    return lowPoints.concat(row.reduce((rowLowPoints, height, columnIndex, row) => {
        const adjacentPoints = [];
        // Calculate UP point
        if (rowIndex > 0) {
            adjacentPoints.push(heightMap[rowIndex - 1][columnIndex]);
        }
        // Calculate LEFT point
        if (columnIndex > 0) {
            adjacentPoints.push(row[columnIndex - 1]);
        }
        // Calculate RIGHT point
        if (columnIndex < row.length - 1) {
            adjacentPoints.push(row[columnIndex + 1]);
        }
        // Calculate DOWN point
        if (rowIndex < heightMap.length - 1) {
            adjacentPoints.push(heightMap[rowIndex + 1][columnIndex]);
        }

        if (adjacentPoints.every(p => height < p)) {
            rowLowPoints.push({
                row: rowIndex,
                col: columnIndex,
                height: height
            });
        }
        return rowLowPoints;
    }, []));
}, []);

const basins = lowestPoints.map(p => new Set(getStrictlyUpwardFlowPoints(p.row, p.col, initialInput)));

module.exports = {
    'Part #1': lowestPoints.reduce((sum, p) => sum + p.height + 1, 0),
    'Part #2': basins
        .sort((a, b) => b.size - a.size)
        .slice(0, 3)
        .reduce((sum, s) => sum * s.size, 1)
}