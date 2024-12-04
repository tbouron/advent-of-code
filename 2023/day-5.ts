import * as fs from 'fs';
import * as path from 'path';
import {expandRange, intersection, sum} from '../util';

const debug = require('debug')(path.basename(__filename));

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');

type AlmanacMap = {
    [s: string]: number
}

type Mapping = {
    source: number
    destination: number
    range: number
}

// Instead of calculating all possible value, we just check that the `source` is within the range (i.e. `source` + `range`)
// of one of our mapping. If that is the case, we simply calculate the offset + `destination`. Otherwise, we return the
// `source`
const calculateTranslation = (source: number, mappings: Mapping[]) => {
    for (let index = 0; index < mappings.length; index++) {
        const mapping = mappings[index];
        if (mapping.source <= source && source <= mapping.source + mapping.range - 1) {
            return mapping.destination + source - mapping.source;
        }
    }
    return source;
}

const initialSeeds = rawInput.shift()!
    .replace('seeds:', '')
    .trim()
    .split(' ')
    .map(s => parseInt(s));

// This stored the different mappings. We can get away of using an array and dropping the mapping names as the conversion
// will happen sequentially
const mappings = rawInput.reduce((o, line) => {
    if (line.match(/^[a-z]/)) {
        o.push([]);
        return o;
    }
    const numbers = line.trim()
        .split(' ')
        .map(s => parseInt(s));

    o[o.length - 1].push({
        destination: numbers[0],
        source: numbers[1],
        range: numbers[2]
    });
    return o;
}, [] as Mapping[][]);

const part1 = initialSeeds
    .map(initialSeed => mappings.reduce((source, mapping) => calculateTranslation(source, mapping), initialSeed))
    .reduce((min, destination) => Math.min(min, destination), Number.MAX_VALUE);

// TODO: To speed up part 2: get the range and transform them as previously since the transformation is stable
//       Then, identify every overlapped ranges and split them up. The lower start range index is the answer!
const part2 = initialSeeds.reduce((min, initialSeed, initialSeedIndex, initialSeeds) => {
    if (initialSeedIndex%2 === 0) {
        return min;
    }
    const startRange = initialSeeds[initialSeedIndex - 1];
    const endRange = initialSeeds[initialSeedIndex - 1] + initialSeed;
    for (let i = startRange; i < endRange; i++) {
        const destination = mappings.reduce((source, mapping) => calculateTranslation(source, mapping), i);
        min = Math.min(min, destination);
    }
    return min;
}, Number.MAX_VALUE);

export const Part1 = part1;
export const Part2 = part2;
