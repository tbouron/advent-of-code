import * as fs from 'fs';
import * as path from 'path';
import {sum} from '../util';

const debug = require('debug')(path.basename(__filename));

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.1.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');

const parseRules = (rules: string[][]) => {
    return rules.reduce((acc, rule) => {
        if (!acc[rule[0]]) {
            acc[rule[0]] = [];
        }
        acc[rule[0]].push(rule[1]);
        return acc;
    }, {} as { [key: string]: string[] });
};

const parseInput = (input: string[]) => {
    return {
        rules: parseRules(input.filter(l => l.includes('|')).map(l => l.split('|'))),
        instructions: input.filter(l => l.includes(',')).map(l => l.split(','))
    };
};

const countMiddle = (input: string[], processOnlyIncorrectUpdated: boolean = false) => {
    const {rules, instructions} = parseInput(input);

    return sum(instructions.filter(instruction => {
        let isValid = instruction.every((page, index, pages) => {
            if (index === 0) {
                return true;
            }
            return !rules[page]?.includes(pages[index - 1]);
        });

        debug(`Instructions [${instruction}] is ${!isValid ? 'NOT ' : ''}valid`);

        return processOnlyIncorrectUpdated ? !isValid : isValid;
    }).map(instruction => instruction.sort((a, b) => {
        const shouldBeBefore = rules[a]?.includes(b) || false;
        return shouldBeBefore ? -1 : 0;
    })).map(instruction => parseInt(instruction[Math.floor(instruction.length / 2)])));
}

export const Part1 = countMiddle(rawInput);
export const Part2 = countMiddle(rawInput, true);