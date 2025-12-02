import * as fs from 'fs';
import * as path from 'path';

const debug = require('debug')(path.basename(__filename));

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.1.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');

const findInvalidIds= (input: string[], findPatternsRepeatingMoreThanOnce = false): number => {
    const regex = new RegExp(`^(.+)\\1${findPatternsRepeatingMoreThanOnce ? '+' : ''}$`, 'g');

    return input
        // This explodes the ranges into the actual list of IDs
        .flatMap(l => l.split(',')
            .filter(r => r.trim() !== '')
            .flatMap(range => {
                const [lowerBound, upperBound] = range.split('-').map(id => parseInt(id.trim()));
                const delta = upperBound - lowerBound + 1;

                // For each id, checks if it is invalid
                return Array<number>(delta).fill(lowerBound)
                    .map((baseValue, index) => baseValue + index)
                    .filter(id => {
                        const idString = id.toString();

                        const isMatching = regex.test(idString);
                        if (isMatching) {
                            debug(`ID ${id} is invalid.`);
                        }
                        return isMatching;
                    })
            }))
        .reduce((sum, id) => sum + id, 0);
}

export const Part1 = findInvalidIds(rawInput, false);
export const Part2 = findInvalidIds(rawInput, true);
