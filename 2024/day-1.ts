import * as fs from 'fs';
import * as path from 'path';
import {sum} from '../util';

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '')

const calcColumns = (input: string[]) => {
    return input
        .reduce((acc, line) => {
            let strings = line.split(/[ ]+/);
            acc[0].push(parseInt(strings[0]));
            acc[1].push(parseInt(strings[1]));
            return acc;
        }, [[], []] as Array<Array<number>>)
        .map(cols => cols.sort());
}

const part1 = (input: string[]) => {
    let columns = calcColumns(input);

    const distances: number[] = [];
    for (let i = 0; i < columns[0].length; i++) {
        distances.push(Math.abs(columns[0][i] - columns[1][i]));
    }

    return sum(distances);
}

const part2 = (input: string[]) => {
    let columns = calcColumns(input);

    return sum(columns[0].map(id => id * columns[1].filter(value => value === id).length))
}

export const Part1 = part1(rawInput);
export const Part2 = part2(rawInput);

