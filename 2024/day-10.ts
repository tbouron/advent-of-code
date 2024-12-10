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
    const currentLevel = parseInt(matrix.getItemFor(position.row, position.col));

    if (currentLevel === 9) {
        return [position];
    }

    return directionsToSearch.map(directionToSearch => {
        return {
            row: position.row + (directionToSearch === Direction.TOP
                ? -1
                : directionToSearch === Direction.BOTTOM
                    ? 1
                    : 0),
            col: position.col + (directionToSearch === Direction.LEFT
                ? -1
                : directionToSearch === Direction.RIGHT
                    ? 1
                    : 0)
        };
    }).filter(p => {
        try {
            let nextLevel = parseInt(matrix.getItemFor(p.row, p.col));
            if (isNaN(nextLevel)) {
                nextLevel = -1;
            }
            return nextLevel - currentLevel === 1;
        } catch (e) {
            return false;
        }
    }).flatMap(p => {
        debug(`[${position.row}, ${position.col}] => [${p.row}, ${p.col}]`);
        return getDistinctHikingPathTargets(matrix, p);
    });
}

const countHikingPaths = (matrix: Matrix<string>, position: Position): number => {
    const currentLevel = parseInt(matrix.getItemFor(position.row, position.col));

    if (currentLevel === 9) {
        return 1;
    }

    return sum(directionsToSearch.map(directionToSearch => {
        return {
            row: position.row + (directionToSearch === Direction.TOP
                ? -1
                : directionToSearch === Direction.BOTTOM
                    ? 1
                    : 0),
            col: position.col + (directionToSearch === Direction.LEFT
                ? -1
                : directionToSearch === Direction.RIGHT
                    ? 1
                    : 0)
        };
    }).filter(p => {
        try {
            let nextLevel = parseInt(matrix.getItemFor(p.row, p.col));
            if (isNaN(nextLevel)) {
                nextLevel = -1;
            }
            return nextLevel - currentLevel === 1;
        } catch (e) {
            return false;
        }
    }).flatMap(p => {
        debug(`[${position.row}, ${position.col}] => [${p.row}, ${p.col}]`);
        return countHikingPaths(matrix, p);
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
