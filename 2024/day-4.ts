import * as fs from 'fs';
import * as path from 'path';
import {Direction, Matrix, sum} from '../util';

const debug = require('debug')(path.basename(__filename));

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => line.split(''));
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => line.split(''));

// console.log(rawTestInput);

const matrix = new Matrix<string>(rawInput);
const part1Search = 'XMAS';

export const Part1 = matrix.searchWord(part1Search).length;

const search = matrix.search('A');
export const Part2 = search['A']?.filter(position => {
    const xLetters = matrix.getAdjacentItemsOf(position, [
        Direction.TOP_LEFT,
        Direction.TOP_RIGHT,
        Direction.BOTTOM_RIGHT,
        Direction.BOTTOM_LEFT
    ]).map(item => item.value);

    const containsRightLetters = xLetters.filter(l => l === 'M').length === 2 && xLetters.filter(l => l === 'S').length === 2;
    const formX = xLetters.reduce((isX, letter, index, xLetters) => {
        return index > 0
            ? isX || xLetters[index - 1] === letter
            : isX
    }, false);

    if (containsRightLetters && formX) {
        debug(`Found an X-MAS at row ${position.row} | col ${position.col}`);
        return true;
    } else {
        debug(`Could not get the all letters to form an X at row ${position.row} | col ${position.col} => Skipping`);
        return false;
    }
}).length;
