import * as fs from "fs";
import * as path from "path";

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n')
    .map(line => line.split('').map(digit => parseInt(digit)));
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.txt`), 'utf8')
    .trim()
    .split('\n')
    .map(line => line.split('').map(digit => parseInt(digit)));

let visibleCounter = rawInput.reduce((totalSum, line, rowIndex, rows) => {
    if (rowIndex === 0 || rowIndex === rows.length - 1) {
        return totalSum + line.length;
    }

    const rowSum = line.reduce((sum, column, columnIndex, columns) => {
        if (columnIndex === 0 || columnIndex === columns.length - 1) {
            return sum++;
        }

        const neighbours = [
            // Top trees
            Array(rowIndex).fill(0).map((v, index) => rows[index][columnIndex]),
            // Left trees
            Array(columnIndex).fill(0).map((v, index) => rows[rowIndex][index]),
            // Right tress
            Array(columns.length - columnIndex - 1).fill(0).map((v, index) => rows[rowIndex][columnIndex + index + 1]),
            // Bottom trees
            Array(rows.length - rowIndex - 1).fill(0).map((v, index) => rows[rowIndex + index + 1][columnIndex]),
        ]
        if (neighbours.some(neighbour => neighbour.every(tree => tree < column))) {
            sum++;
        }

        return sum;
    }, 0);

    // +2 for the 2 edged trees
    return totalSum + rowSum + 2;
}, 0);

const highestScenicScore = rawInput.reduce((scenicScore, line, rowIndex, rows) => {
    let highestScenicScoreForRow = 0;
    if (rowIndex === 0 || rowIndex === rows.length - 1) {
        return scenicScore;
    }

    highestScenicScoreForRow = line.reduce((sc, column, columnIndex, columns) => {
        if (columnIndex === 0 || columnIndex === columns.length - 1) {
            return sc;
        }

        let topNonBlockingTrees = 0;
        let leftNonBlockingTrees = 0;
        let rightNonBlockingTrees = 0;
        let bottomNonBlockingTrees = 0;
        let ci;

        // Top trees
        ci = rowIndex - 1;
        while (ci >= 0) {
            topNonBlockingTrees++;
            if (rows[ci][columnIndex] < column) {
                ci--;
            } else {
                break;
            }
        }

        // Left trees
        ci = columnIndex - 1;
        while (ci >= 0) {
            leftNonBlockingTrees++;
            if (columns[ci] < column) {
                ci--;
            } else {
                break;
            }
        }

        // Bottom trees
        ci = rowIndex + 1;
        while (ci < rows.length) {
            bottomNonBlockingTrees++;
            // console.log(`Tree at row=${ci};col=${columnIndex} => ${rows[ci][columnIndex]} (compare to ${column})`);
            if (rows[ci][columnIndex] < column) {
                ci++;
            } else {
                break;
            }
        }

        // Right trees
        ci = columnIndex + 1;
        while (ci < columns.length) {
            rightNonBlockingTrees++;
            if (columns[ci] < column) {
                ci++;
            } else {
                break;
            }
        }

        const currentSc = topNonBlockingTrees * leftNonBlockingTrees * rightNonBlockingTrees * bottomNonBlockingTrees;

        return currentSc > sc ? currentSc : sc;
    }, 0);

    return highestScenicScoreForRow > scenicScore ? highestScenicScoreForRow : scenicScore;
}, 0);


export const Part1 = visibleCounter;
export const Part2 = highestScenicScore;