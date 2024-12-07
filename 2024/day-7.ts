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

const normalOperators = [
    '+', '*'
];
const concatOperators = [
    '+', '*', '||'
];

const calcOperator = (sum: number, a: number, b: number, remaining: number[], operators: string[]): boolean => {
    const possibleSolutions = operators.map(op => eval(op === '||'
        ? `${a}${b}`
        : `${a} ${op} ${b}`
    ) as number);

    if (remaining.length === 0) {
        return possibleSolutions.some(ps => {
            const found = sum === ps;
            debug(`Testing ${sum} = ${ps}`);
            if (found) {
                debug(`Found solution with operators: ${sum} = ${ps}`);
            }
            return found;
        });
    }

    return possibleSolutions.some(ps => {
        const r = structuredClone(remaining);
        return calcOperator(sum, ps, r.shift()!, r, operators);
    });
}

const findValidEquations = (input: string[]) => {
    return input.map(l => {
        const value = parseInt(l.split(':')[0].trim());
        const numbers = l.split(':')[1].trim().split(' ').map(Number);

        debug(numbers, numbers.filter((n, i) => i !== 0 && i !== 1));

        let isValid = calcOperator(value, numbers[0], numbers[1], numbers.filter((n, i) => i !== 0 && i !== 1), normalOperators);

        return {value, numbers, isValid};
    });
}

const equations = findValidEquations(rawInput);

export const Part1 = sum(equations
    .filter(equation => equation.isValid)
    .map(equation => equation.value));

export const Part2 = sum(equations
    .map((equation) => {
        const {value, numbers, isValid} = equation;
        if (!isValid) {
            return {
                value,
                numbers,
                isValid: calcOperator(equation.value, numbers[0], numbers[1], numbers.filter((n, i) => i !== 0 && i !== 1), concatOperators)
            };
        }
        return equation;
    })
    .filter(equation => equation.isValid)
    .map(equation => equation.value))
