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

const matrix = new Matrix(rawInput);
const part1Search = 'XMAS';

export const Part1 = matrix.searchWord(part1Search).length;

let part2 = 0;
for (let row = 0; row < matrix.get().length; row++) {
    for (let col = 0; col < matrix.get()[row].length; col++) {
        if (matrix.getItemFor(row, col) !== 'A') {
            continue;
        }

        try {
            const xLetters = [
                matrix.getItemFor(row - 1, col - 1),
                matrix.getItemFor(row - 1, col + 1),
                matrix.getItemFor(row + 1, col + 1),
                matrix.getItemFor(row + 1, col - 1)
            ];

            const containsRightLetters = xLetters.filter(l => l === 'M').length === 2 && xLetters.filter(l => l === 'S').length === 2;
            const formX = xLetters.reduce((isX, letter, index, xLetters) => {
                return index > 0
                    ? isX || xLetters[index - 1] === letter
                    : isX
            }, false);

            if (containsRightLetters && formX) {
                debug(`Found an X-MAS at row ${row} | col ${col}`);
                part2++;
            }
        } catch (e) {
            debug(`Could not get the all letters to form an X at row ${row} | col ${col} => Skipping`);
        }
    }
}

export const Part2 = part2;
