import * as fs from "fs";
import * as path from "path";
import {expandRange, intersection} from "../../util";

const parsedInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .split('\n')
    .map(line => line
        .trim()
        .split(',')
        .map(sections => sections
            .split('-')
            .map(section => parseInt(section.trim()))));

const part1 = parsedInput.filter(pairs => {
    const diffPair0 = pairs[0][1] - pairs[0][0];
    const diffPair1 = pairs[1][1] - pairs[1][0];
    const biggerPair = diffPair1 - diffPair0 > 0 ? pairs[1] : pairs[0];
    const smallerPair = diffPair1 - diffPair0 <= 0 ? pairs[1] : pairs[0];

    return smallerPair[0] >= biggerPair[0] && smallerPair[1] <= biggerPair[1];
});

const part2 = intersection(parsedInput
    .map(pairs => intersection(...pairs.map(pair => expandRange(pair[0], pair[1]))))
    .filter(overlaps => overlaps.length > 0));

export const Part1 = part1.length;
export const Part2 = part2.length;