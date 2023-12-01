import * as fs from 'fs';
import * as path from 'path';

const parsedInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
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

const part1 = parsedInput.map(line => {
    const digits = Array.from(line.matchAll(/[0-9]/g)).map(match => parseInt(match[0]));
    return computeCalibrationNumber(digits);
});

const part2 = parsedInput.map((line, index) => {
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

export const Part1 = `The sum of all calibration number is: ${part1.reduce((sum, n) => sum + n, 0)}`;
export const Part2 = `The sum of all calibration number, including text ones, is: ${part2.reduce((sum, n) => sum + n, 0)}`;


