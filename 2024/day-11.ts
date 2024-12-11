import * as fs from 'fs';
import * as path from 'path';
import {sum} from "../util";

const debug = require('debug')(path.basename(__filename));

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split(' ');
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.1.txt`), 'utf8')
    .trim()
    .split(' ');

// We iterate for how many blinks asked. However, instead of building the array on each iteration, we increment/decrement
// a dictionary for how many times we are seen a specific stone. This allows us to be fast, and we can sum at the end
// all the number of seen stones to be the answer
const blinkFor = (iteration: number, stones: { [key: string]: number }) => {
    Array(iteration).fill(0).forEach((v, i) => {
        Object.entries(stones).forEach(([stone, size]) => {
            let transformedStonesToProcess = [];
            // Transform stone, as explained in https://adventofcode.com/2024/day/11
            // We have an array since one operation produces 2 numbers
            if (stone === '0') {
                transformedStonesToProcess.push('1')
            } else if (stone.length % 2 === 0) {
                transformedStonesToProcess.push(parseInt(stone.slice(0, stone.length / 2)).toString(), parseInt(stone.slice(stone.length / 2)).toString());
            } else {
                transformedStonesToProcess.push((parseInt(stone) * 2024).toString());
            }

            // We are processing the stone identified by the number `stone`. So we need to decrease the current counter
            // of the current size, i.e. seen current stone
            stones[stone] -= size;

            // For each stone transform, we add that to the dictionary, then increase the counter by the number of seen stone
            transformedStonesToProcess.forEach(keyToProcess => {
                if (!stones[keyToProcess]) {
                    stones[keyToProcess] = 0;
                }
                stones[keyToProcess] += size;
            });

            // To clean things up, we remove the counters that are at 0
            if (stones[stone] === 0) {
                delete stones[stone];
            }

        });
        debug(`#${i + 1} => `, stones);
    });
    return stones;
}

const stones = rawInput.reduce((map, value) => {
    if (!map[value]) {
        map[value] = 0;
    }
    map[value]++;
    return map;
}, {} as { [key: string]: number });

export const Part1 = () => {
    const newStones = blinkFor(25, structuredClone(stones));

    return sum(Object.values(newStones));
}

export const Part2 = () => {
    const newStones = blinkFor(75, structuredClone(stones));

    return sum(Object.values(newStones));
}

