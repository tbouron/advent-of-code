import * as fs from 'fs';
import * as path from 'path';
import {expandRange, intersection, multiply, sum} from '../../util';

const debug = require('debug')(path.basename(__filename));

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');

const calculateWins = ([time, bestDistance]: number[], raceIndex: number) => {
    const betterDistances = expandRange(1, time)
        .map(holdingTime => holdingTime * (time - holdingTime))
        .filter(distance => distance > bestDistance);

    debug(`[Race ${raceIndex + 1}] There are ${betterDistances.length} possibilities of going further`);

    return betterDistances.length;
};

const part1 = rawInput
    .reduce((races, line, index, lines) => {
        if (index%2 === 0) {
            return races;
        }
        const times = lines[index - 1].replace('Time:', '')
            .trim()
            .split(/\s+/g)
            .map(s => parseInt(s.trim()));
        const distances = lines[index].replace('Distance:', '')
            .trim()
            .split(/\s+/g)
            .map(s => parseInt(s.trim()));

        times.forEach((time, index) => {
            races.push([time, distances[index]]);
        });
        return races;
    }, [] as number[][])
    .map(calculateWins);

const part2 = rawInput
    .reduce((races, line, index, lines) => {
        if (index%2 === 0) {
            return races;
        }
        const time = parseInt(lines[index - 1].replace('Time:', '')
            .trim()
            .replace(/\s+/g, ''));
        const distance = parseInt(lines[index].replace('Distance:', '')
            .trim()
            .replace(/\s+/g, ''));

        races.push([time, distance]);
        return races;
    }, [] as number[][])
    .map(calculateWins);

export const Part1 = multiply(part1);
export const Part2 = part2[0];
