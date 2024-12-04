import * as fs from 'fs';
import * as path from 'path';
import {intersection, sum} from '../util';

const debug = require('debug')(path.basename(__filename));

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');

const parseCard = (line: string): number[][] => {
    return line
        .split('|')
        .map(n => n.trim()
            .split(' ')
            .map(n => parseInt(n.trim()))
            .filter(n => !isNaN(n)))
}

const cache: number[][] = rawInput.reduce((cache, line, index) => {
    const parsedCard = parseCard(line.replace(/^Card\s+[0-9]+:/, ''));
    cache[index] = intersection(...parsedCard);
    return cache;
}, [] as number[][]);

const part1 = cache.map(winningNumbers => {
    return winningNumbers.reduce((points, winningNumber, index) => {
        if (index === 0) {
            points++;
        } else {
            points = points * 2;
        }
        return points;
    }, 0);
});

const part2: number[] = cache.map(winningNumbers => 1);
debug(`Initial cards: ${part2}`);
cache.forEach((winningNumbers, index) => {
    winningNumbers.forEach((winningNumber, winningNumberIndex) => {
        part2[index + winningNumberIndex + 1] += part2[index];
    });
    debug(`Round ${index + 1}: ${winningNumbers} => ${part2}`);
});

export const Part1 = sum(part1);
export const Part2 = sum(part2);
