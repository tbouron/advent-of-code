import * as fs from "fs";
import * as path from "path";

const parsedInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .split('\n');

const stacks1 = [
    ['S', 'L', 'W'],
    ['J', 'T', 'N', 'Q'],
    ['S', 'C', 'H', 'F', 'J'],
    ['T', 'R', 'M', 'W', 'N', 'G', 'B'],
    ['T', 'R', 'L', 'S', 'D', 'H', 'Q', 'B'],
    ['M', 'J', 'B', 'V', 'F', 'H', 'R', 'L'],
    ['D', 'W', 'R', 'N', 'J', 'M'],
    ['B', 'Z', 'T', 'F', 'H', 'N', 'D', 'J'],
    ['H', 'L', 'Q', 'N', 'B', 'F', 'T'],
];

const stacks2 = JSON.parse(JSON.stringify(stacks1));

const instructions = parsedInput
    .map(line => {
        const matches = line.match('^move ([0-9]+) from ([0-9]+) to ([0-9]+)$');
        if (!matches) {
            return null;
        }
        return {
            count: parseInt(matches[1]),
            start: parseInt(matches[2]),
            target: parseInt(matches[3])
        };
    })
    .filter(instruction => instruction !== null);

instructions
    .forEach(instruction => {
        // @ts-ignore
        for (let i = 0; i < instruction.count; i++) {
            // @ts-ignore
            let create = stacks1[instruction.start - 1].pop();
            // @ts-ignore
            stacks1[instruction.target - 1].push(create);
        }

        // @ts-ignore
        stacks2[instruction.target - 1].push(...stacks2[instruction.start - 1].slice(-instruction.count));
        // @ts-ignore
        stacks2[instruction.start - 1].splice(-instruction.count);
    });

// @ts-ignore
export const Part1 = stacks1.map(stack => stack[stack.length - 1]).join('');
// @ts-ignore
export const Part2 = stacks2.map(stack => stack[stack.length - 1]).join('');