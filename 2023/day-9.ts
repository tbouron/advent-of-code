import * as fs from 'fs';
import * as path from 'path';
import {expandRange, intersection, lcm, multiply, sum} from '../util';

const debug = require('debug')(path.basename(__filename));

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.1.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');

const computeDiff = (numbers: number[]) => {
    return numbers.reduce((arr, n, index, numbers) => {
        if (index === 0) {
            return arr;
        }
        arr.push(n - numbers[index - 1]);
        return arr
    }, [] as number[]);
}

const history = rawInput.map(line => {
    const numbers = line.trim().split(/\s+/).map(s => parseInt(s));
    return numbers;
})

const results = history.map(history => {
    let starts = [history[0]];
    let ends = [history[history.length - 1]];
    while (history.some(n => n !== 0)) {
        history = computeDiff(history);
        starts.push(history[0]);
        ends.push(history[history.length - 1]);
    }

    const part2: number[] = [];

    starts.reverse().forEach((s, index) => {
        part2.push(index === 0 ? s : (part2[index - 1] - s) * -1);
    });

    return {
        part1: sum(ends),
        part2: part2.pop()!
    };
});

export const Part1 = sum(results.map(r => r.part1));
export const Part2 = sum(results.map(r => r.part2));
