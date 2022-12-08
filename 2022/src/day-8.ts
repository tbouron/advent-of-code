import * as fs from "fs";
import * as path from "path";
import {Direction, Matrix} from "../util";

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n')
    .map(line => line.split('').map(digit => parseInt(digit)));
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.txt`), 'utf8')
    .trim()
    .split('\n')
    .map(line => line.split('').map(digit => parseInt(digit)));


const matrix = new Matrix(rawInput);

let totalVisibleTrees = matrix.get().reduce((totalVisible, line, rowIndex, rows) => {
    // Top & Bottom row are edges, so trees are always visible
    if (rowIndex === 0 || rowIndex === rows.length - 1) {
        return totalVisible + line.length;
    }

    const visibleTreesInRow = line.reduce((visibleTrees, column, columnIndex, columns) => {
        if (columnIndex === 0 || columnIndex === columns.length - 1) {
            return visibleTrees++;
        }

        const neighbours = [
            matrix.getItemsFrom(rowIndex, columnIndex, Direction.TOP),
            matrix.getItemsFrom(rowIndex, columnIndex, Direction.LEFT),
            matrix.getItemsFrom(rowIndex, columnIndex, Direction.BOTTOM),
            matrix.getItemsFrom(rowIndex, columnIndex, Direction.RIGHT),
        ];
        if (neighbours.some(neighbour => neighbour.every(tree => tree < column))) {
            visibleTrees++;
        }

        return visibleTrees;
    }, 0);

    // +2 for the 2 edged trees
    return totalVisible + visibleTreesInRow + 2;
}, 0);

const highestScenicScore = matrix.get().reduce((scenicScore, line, rowIndex, rows) => {
    let highestScenicScoreForRow = 0;
    // Ignore first and last row, as there is no trees in either top or bottom direction
    if (rowIndex === 0 || rowIndex === rows.length - 1) {
        return scenicScore;
    }

    highestScenicScoreForRow = line.reduce((scenicScore, column, columnIndex, columns) => {
        // Ignore first and last column, as there is no trees in either left or right direction
        if (columnIndex === 0 || columnIndex === columns.length - 1) {
            return scenicScore;
        }

        const topTrees = matrix.getItemsFrom(rowIndex, columnIndex, Direction.TOP)
        const leftTrees = matrix.getItemsFrom(rowIndex, columnIndex, Direction.LEFT);
        const bottomTrees = matrix.getItemsFrom(rowIndex, columnIndex, Direction.BOTTOM);
        const rightTrees = matrix.getItemsFrom(rowIndex, columnIndex, Direction.RIGHT);

        const topNonBlockingTrees = topTrees.findIndex(v => v >= column) > -1
            ? topTrees.findIndex(v => v >= column) + 1
            : topTrees.length;
        const leftNonBlockingTrees = leftTrees.findIndex(v => v >= column) > -1
            ? leftTrees.findIndex(v => v >= column) + 1
            : leftTrees.length;
        const bottomNonBlockingTrees = bottomTrees.findIndex(v => v >= column) > -1
            ? bottomTrees.findIndex(v => v >= column) + 1
            : bottomTrees.length;
        const rightNonBlockingTrees = rightTrees.findIndex(v => v >= column) > -1
            ? rightTrees.findIndex(v => v >= column) + 1
            : rightTrees.length;

        const currentScenicScore = topNonBlockingTrees * leftNonBlockingTrees * bottomNonBlockingTrees * rightNonBlockingTrees;

        return currentScenicScore > scenicScore ? currentScenicScore : scenicScore;
    }, 0);

    return highestScenicScoreForRow > scenicScore ? highestScenicScoreForRow : scenicScore;
}, 0);

export const Part1 = totalVisibleTrees;
export const Part2 = highestScenicScore;