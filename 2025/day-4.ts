import * as fs from 'fs';
import * as path from 'path';
import {ALL_DIRECTIONS, Matrix, sum} from "../util";

type Item = '.' | '@';

const debug = require('debug')(path.basename(__filename));

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => line.split('') as Item[]);
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.1.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => line.split('') as Item[]);

const getMovableRolls = (matrix: Matrix<Item>, keepRemoving = false): number => {
    const updatedMatrix = new Matrix(matrix.get());

    let movableRolls = sum(matrix.get().map((items, row) => {
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

    if (keepRemoving && movableRolls > 0) {
        movableRolls += getMovableRolls(updatedMatrix, keepRemoving);
    }

    return movableRolls;
}

export const Part1 = getMovableRolls(new Matrix<Item>(rawInput), false);
export const Part2 = getMovableRolls(new Matrix<Item>(rawInput), true);
