import * as fs from 'fs';
import * as path from 'path';
import {sum} from '../../util';

const debug = require('debug')(path.basename(__filename));

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');

function parseInstructions(input: string[], supportConditions: boolean = false) {
    let shouldCount = true;

    return input.flatMap(line => {
        let matches = (line.matchAll(/(mul\(([0-9]+)\,([0-9]+)\)|don\'t\(\)|do\(\))/g) as unknown as RegExpMatchArray[]);

        const numbers: number[] = [];
        for (const match of matches) {
            debug(`Found match ${match}`);
            if (supportConditions && match[0] === 'don\'t()') {
                shouldCount = false
            } else if (supportConditions && match[0] === 'do()') {
                shouldCount = true
            } else if (shouldCount && match[0].startsWith('mul')) {
                numbers.push(parseInt(match[2]) * parseInt(match[3]))
            }
        }
        return numbers;
    });
}

export const Part1 = sum(parseInstructions(rawInput));
export const Part2 = sum(parseInstructions(rawInput, true));