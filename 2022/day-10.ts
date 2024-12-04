import * as fs from "fs";
import * as path from "path";
import {sum} from "../util";

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n');
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.txt`), 'utf8')
    .trim()
    .split('\n');

let register = 1;
let x: number[] = [];

rawInput.forEach(instruction => {
    if (instruction.trim() === 'noop') {
        x.push(register);
    } else {
        x.push(register);
        x.push(register);
        register += parseInt(instruction.trim().substring(4));
    }
});

const part1 = sum([20, 60, 100, 140, 180, 220].map(cycle => x[cycle - 1] * cycle));

const part2 = x.reduce((output, v, index) => {
    const sprite = [v, v+2];
    output += (sprite[0] <= (index%40 + 1) && (index%40 + 1) <= sprite[1]) ? '# ' : '. ';
    if ((index + 1)%40 === 0) {
        output += '\n';
    }
    return output;
}, '');

export const Part1 = part1;
export const Part2 = '\n' + part2
