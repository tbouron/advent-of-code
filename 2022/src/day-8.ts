import * as fs from "fs";
import * as path from "path";
import {Direction, Matrix} from "../../util";

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
    // Ignore first and last row, as there is no trees in either top or bottom direction
    if (rowIndex === 0 || rowIndex === rows.length - 1) {
        return scenicScore;
    }

    const highestScenicScoreForRow = line.reduce((scenicScore, column, columnIndex, columns) => {
        // Ignore first and last column, as there is no trees in either left or right direction
        if (columnIndex === 0 || columnIndex === columns.length - 1) {
            return scenicScore;
        }

        const currentScenicScore = [
            Direction.TOP,
            Direction.LEFT,
            Direction.BOTTOM,
            Direction.RIGHT
        ].map(direction => {
            const treesForDirection = matrix.getItemsFrom(rowIndex, columnIndex, direction);
            return treesForDirection.findIndex(v => v >= column) > -1
                ? treesForDirection.findIndex(v => v >= column) + 1
                : treesForDirection.length;
        }).reduce((acc, blockingTrees) => acc * blockingTrees, 1);

        return currentScenicScore > scenicScore ? currentScenicScore : scenicScore;
    }, 0);

    return highestScenicScoreForRow > scenicScore ? highestScenicScoreForRow : scenicScore;
}, 0);

export const Part1 = totalVisibleTrees;
export const Part2 = highestScenicScore;