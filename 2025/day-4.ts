import * as fs from 'fs';
import * as path from 'path';
import {ALL_DIRECTIONS, Matrix, sum} from "../util";

const debug = require('debug')(path.basename(__filename));

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => line.split(''));
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.1.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => line.split(''));

const getMovableRolls = (input: string[][], keepRemoving = false): number => {
    const matrix = new Matrix(input);
    const updatedMatrix = new Matrix(matrix.get());

    const movableRolls = sum(matrix.get().map((items, row) => {
        return items.reduce((rowSum, item, col) => {
            if (item !== '@') {
                return rowSum;
            }
            const adjacentRolls = matrix.getAdjacentItemsOf({
                row,
                col
            }, ALL_DIRECTIONS).filter(({value}) => value === '@');
            if (adjacentRolls.length < 4) {
                updatedMatrix.setItemFor({row, col}, '.');
                debug(`[${row}][${col}] Roll can be removed! Adjacent rolls => ${adjacentRolls.length}`);
            }
            return rowSum + (adjacentRolls.length < 4 ? 1 : 0);
        }, 0);
    }));

    if (!keepRemoving) {
        return movableRolls;
    }

    if (movableRolls === 0) {
        return movableRolls
    } else {
        return movableRolls + getMovableRolls(updatedMatrix.get(), keepRemoving);
    }
}

export const Part1 = getMovableRolls(rawInput, false);
export const Part2 = getMovableRolls(rawInput, true);
