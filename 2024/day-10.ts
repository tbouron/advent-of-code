import * as fs from 'fs';
import * as path from 'path';
import {Direction, Matrix, Position, sum} from "../util";

const debug = require('debug')(path.basename(__filename));

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(l => l.split(''));
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.5.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(l => l.split(''));

const directionsToSearch = [
    Direction.TOP,
    Direction.RIGHT,
    Direction.BOTTOM,
    Direction.LEFT
];

const getDistinctHikingPathTargets = (matrix: Matrix<string>, position: Position): Position[] => {
    const currentLevel = parseInt(matrix.getItemFor(position));

    if (currentLevel === 9) {
        return [position];
    }

    return matrix.getAdjacentItemsOf(position, directionsToSearch)
        .filter(i => parseInt(i.value) - currentLevel === 1)
        .flatMap(item => {
            debug(`[${position.row}, ${position.col}] => [${item.position.row}, ${item.position.col}]`);
            return getDistinctHikingPathTargets(matrix, item.position);
        });
}

const countHikingPaths = (matrix: Matrix<string>, position: Position): number => {
    const currentLevel = parseInt(matrix.getItemFor(position));

    if (currentLevel === 9) {
        return 1;
    }

    return sum(matrix.getAdjacentItemsOf(position, directionsToSearch)
        .filter(i => parseInt(i.value) - currentLevel === 1)
        .flatMap(item => {
            debug(`[${position.row}, ${position.col}] => [${item.position.row}, ${item.position.col}]`);
            return countHikingPaths(matrix, item.position);
        }));
}

const matrix = new Matrix(rawInput);
const trailheads = matrix.search('0');

const scores = trailheads['0']?.flatMap(startPosition => {
    const trailheadDistinctTargets = new Set(getDistinctHikingPathTargets(matrix, startPosition).map(p => JSON.stringify(p))).size;
    debug(`Trailhead starting at row ${startPosition.row} | col ${startPosition.col} has ${trailheadDistinctTargets} distinct targets`);
    return trailheadDistinctTargets;
});
export const Part1 = sum(scores);

const hikingPaths = trailheads['0']?.flatMap(startPosition => {
    const trailheadHikingPaths = countHikingPaths(matrix, startPosition);
    debug(`Trailhead starting at row ${startPosition.row} | col ${startPosition.col} has ${trailheadHikingPaths} hiking paths`);
    return trailheadHikingPaths;
});
export const Part2 = sum(hikingPaths);
