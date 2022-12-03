import * as fs from "fs";
import * as path from "path";
import {intersection, sum} from "../util";

const priorities = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
];

const parsedInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .split('\n');

const part1 = parsedInput
    .map(rucksack => {
        let items = rucksack.split('');
        return [
            items.slice(0, (items.length / 2)),
            items.slice(items.length / 2, items.length)
        ];
    })
    .map(containers => sum(intersection(containers[0], containers[1])
        .map(item => priorities.indexOf(item) + 1)));

const part2 = parsedInput
    .reduce((groups, rucksack, index) => {
        if (index % 3 === 0) {
            groups.push([]);
        }
        groups[groups.length - 1].push(rucksack.split(''));
        return groups;
    }, [] as string[][][])
    .map(group => sum(intersection(group[0], group[1], group[2])
        .map(item => priorities.indexOf(item) + 1)));

export const Part1 = `Sum of per-rucksack common items priorities: ${sum(part1)}`;
export const Part2 = `Sum of per-group common items priorities: ${sum(part2)}`;

