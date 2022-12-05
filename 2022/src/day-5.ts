import * as fs from "fs";
import * as path from "path";
import {transpose} from "../util";

const instructionRegex = /^move ([0-9]+) from ([0-9]+) to ([0-9]+)$/

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .split('\n');

// Parse instructions
const rawInstructions = rawInput
    .filter(line => Array.isArray(line.match(instructionRegex)))
    .filter(line => line.trim() !== '')

// Parse stacks
const rawStack = rawInput
    .filter(line => !Array.isArray(line.match(instructionRegex)))
    .filter(line => line.trim() !== '')
    .reverse()
    .filter(line => line.replace(/\d/gi, '').trim())
    .map(line => line.split(''));
// Transform stacks input into a readable format:
// [
//   ['A', 'B', 'C' ],
//   ['D', 'E' ]
// ]
const stack1 = transpose(rawStack)
    .filter(stack => !Array.isArray(stack.join('').trim().match(/^[\[\]]*$/gi)))
    .map(stack => stack.filter(create => create.trim() !== ''));
// Make a copy for part 2
const stack2: string[][] = JSON.parse(JSON.stringify(stack1));

// Execute!
rawInstructions
    .map(line => {
        const matches = line.match('^move ([0-9]+) from ([0-9]+) to ([0-9]+)$');
        if (!Array.isArray(matches)) {
            return null;
        }
        return {
            count: parseInt(matches[1]),
            start: parseInt(matches[2]),
            target: parseInt(matches[3])
        };
    })
    .forEach(instruction => {
        if (instruction === null) {
            return;
        }
        for (let i = 0; i < instruction.count; i++) {
            const create = stack1[instruction.start - 1].pop();
            if (create) {
                stack1[instruction.target - 1].push(create);
            }
        }

        stack2[instruction.target - 1].push(...stack2[instruction.start - 1].slice(-instruction.count));
        stack2[instruction.start - 1].splice(-instruction.count);
    });

export const Part1 = stack1.map(stack => stack[stack.length - 1]).join('');
export const Part2 = stack2.map(stack => stack[stack.length - 1]).join('');