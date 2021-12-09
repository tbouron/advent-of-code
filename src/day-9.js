const fs = require('fs');
const path = require('path');

const initialInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8')
    .split('\n')
    .filter(l => l.trim() !== '')
    .map(l => l
        .split('')
        .map(i => parseInt(i)));

const adjacentPoints = initialInput.reduce((lowPoints, row, rowIndex, heatmap) => {
    return lowPoints.concat(row.reduce((rowLowPoints, point, columnIndex, row) => {
        const adjacentPoints = [];
        // Calculate UP point
        if (rowIndex > 0) {
            adjacentPoints.push(heatmap[rowIndex - 1][columnIndex]);
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
        if (rowIndex < heatmap.length - 1) {
            adjacentPoints.push(heatmap[rowIndex + 1][columnIndex]);
        }

        if (adjacentPoints.every(p => point < p)) {
            rowLowPoints.push(point);
        }
        return rowLowPoints;
    }, []));
}, []);

module.exports = {
    'Part #1': adjacentPoints.reduce((sum, i) => sum + i + 1, 0)
}