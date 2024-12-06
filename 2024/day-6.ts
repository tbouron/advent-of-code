import * as fs from 'fs';
import * as path from 'path';
import {Direction, Matrix, sum} from '../util';

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

const directionMapping: {[key: string]: Direction} = {
    '^': Direction.TOP,
    'v': Direction.BOTTOM,
    '<': Direction.LEFT,
    '>': Direction.RIGHT
};

const walk = (matrix: Matrix<string>) => {
    const startPosition = matrix.searchFirstItem(Object.keys(directionMapping));

    if (!startPosition) {
        throw new Error('No starting position found!');
    }

    let row = startPosition.row;
    let col = startPosition.col;
    let direction = directionMapping[startPosition.item];
    let positions = new Set<string>();
    let positionsWithDirections = new Set<string>();
    let isLoop = false;

    debug(`Guard starts walking`);

    while(true) {
        if (positionsWithDirections.has(JSON.stringify({row, col, direction}))) {
            debug('Guard is in a infinite loop!');
            isLoop = true;
            break;
        }

        let nextRow = row;
        let nextCol = col;
        let nextDirection = direction;
        switch (direction) {
            case Direction.TOP:
                nextRow--;
                nextDirection = Direction.RIGHT;
                break;
            case Direction.BOTTOM:
                nextRow++;
                nextDirection = Direction.LEFT;
                break;
            case Direction.LEFT:
                nextCol--;
                nextDirection = Direction.TOP;
                break;
            case Direction.RIGHT:
                nextCol++;
                nextDirection = Direction.BOTTOM;
                break;
        }

        try {
            const next = matrix.getItemFor(nextRow, nextCol);
            if (next === '#') {
                direction = nextDirection;
                debug(`Hitting obstacle => turning ${direction}`);
            } else {
                debug(`Step => row ${row} | col ${col} | direction ${direction}`);
                positions.add(JSON.stringify({row, col}));
                positionsWithDirections.add(JSON.stringify({row, col, direction}));
                row = nextRow;
                col = nextCol;
            }
        } catch (e) {
            debug(`Step => row ${row} | col ${col} | direction ${direction}`);
            positions.add(JSON.stringify({row, col}));
            positionsWithDirections.add(JSON.stringify({row, col, direction}));
            debug(`Guard out of the area!`);
            break;
        }
    }

    return {positions, startPosition, isLoop};
}

const matrix = new Matrix(rawInput);
const {positions, startPosition} = walk(matrix);

export const Part1 = positions.size;
export const Part2 = sum(Array.from(positions)
    .map(p => JSON.parse(p) as {row: number, col: number})
    .map(p => {
        // Brute force approach: for each position along the guard path (except the starting position)
        // we place an obstruction and run the simulation again. If the returned flag `isLoop` = true, then we increment.
        if (p.row === startPosition.row && p.col === startPosition.col) {
            return 0;
        }
        const newMatrix = new Matrix(matrix.get());
        newMatrix.setItemFor('#', p.row, p.col);

        const {isLoop} = walk(newMatrix);

        if (isLoop) {
            debug(`Loop found at position row ${p.row} | col ${p.col}!`);
            return 1;
        }
        return 0;
    }));


