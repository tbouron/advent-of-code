import * as fs from 'fs';
import * as path from 'path';

const debug = require('debug')(path.basename(__filename));

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '')

const findPassword = (input: string[]): {position: number, passwordPart1: number, passwordPart2: number} => {
    const startPosition = 50;
    const numberOFClicks = 100;
    debug(`The dial starts by pointing at ${startPosition}`);

    return input.reduce((acc, line, index) => {
        const match = line.match(/(R|L)([0-9]+)/);
        if (match === null) {
            debug(`Failed to parse line: ${line}`);
            return acc;
        }

        const rawDistance = parseInt(match[2]);
        const fullCircles = Math.floor(rawDistance / numberOFClicks);
        const distance = rawDistance - numberOFClicks * fullCircles;

        let newPosition = acc.position + distance * (match[1] === 'R' ? 1 : -1);

        let passesThroughZero = fullCircles;
        if (newPosition < 0) {
            newPosition = numberOFClicks - Math.abs(newPosition);
            if (acc.position > 0) {
                passesThroughZero += 1;
            }
        }
        if (newPosition > numberOFClicks) {
            passesThroughZero += 1;
        }

        acc.position = newPosition % numberOFClicks;

        if (acc.position === 0) {
            acc.passwordPart1 += 1;
            passesThroughZero += 1;
        }

        acc.passwordPart2 += passesThroughZero;

        debug(`The dial is rotated ${line} to point at ${acc.position}${passesThroughZero > 0 ? `; during this rotation, it points at 0 [${passesThroughZero} times]` : '.'}`);

        return acc;
    }, {
        position: startPosition,
        passwordPart1: 0,
        passwordPart2: 0,
    });
}

export const Part1 = findPassword(rawInput).passwordPart1;
export const Part2 = findPassword(rawInput).passwordPart2;

