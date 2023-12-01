import * as fs from 'fs';
import * as path from 'path';
import {sum} from '../../util';

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');

const computeCalibrationNumber = (digits: number[]) => {
    switch (digits.length) {
        case 1:
            return parseInt(`${digits[0]}${digits[0]}`);
        case 0:
            throw new Error('There are not digits in this line!');
        default:
            return parseInt(`${digits.shift()}${digits.pop()}`);
    }
}

const part1 = rawInput.map(line => {
    const digits = Array.from(line.matchAll(/[0-9]/g)).map(match => parseInt(match[0]));
    return computeCalibrationNumber(digits);
});

const part2 = rawInput.map((line, index) => {
    let replacements = [
        ['one', 1],
        ['two', 2],
        ['three', 3],
        ['four', 4],
        ['five', 5],
        ['six', 6],
        ['seven', 7],
        ['eight', 8],
        ['nine', 9],
    ];
    // Notice the `?=` at the start of the regex for a lookahead and not consuming the buffer. This is necessary otherwise
    // the overlapping pattern won't be found. For instance, with an input of `sevenine`, a normal regex would match only
    // `seven` whereas we want to match `seven` and `nine`
    const digits = Array.from(line.matchAll(new RegExp(`(?=([0-9]|${replacements.map(r => r[0]).join('|')}))`, 'g')))
        .map(match => {
            const value = parseInt(match[1]);
            if (isNaN(value)) {
                return replacements.find(r => r[0] === match[1])![1] as number;
            }
            return value;
        });
    return computeCalibrationNumber(digits);
});

export const Part1 = sum(part1);
export const Part2 = sum(part2);
