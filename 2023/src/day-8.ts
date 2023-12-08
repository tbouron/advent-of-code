import * as fs from 'fs';
import * as path from 'path';
import {expandRange, intersection, lcm, multiply, sum} from '../../util';

const debug = require('debug')(path.basename(__filename));

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');

type Node = {
    L: string
    R: string
}

const instructions = rawInput.shift()!.split('');
const nodes: { [id: string]: Node } = rawInput.reduce((map, line) => {
    const parts = line.split('=');
    const destination = parts[1].trim().replace('(', '').replace(')', '').split(',').map(s => s.trim());
    map[parts[0].trim()] = {
        L: destination[0],
        R: destination[1]
    };
    return map;
}, {} as { [id: string]: Node });

let stepsPart1 = 0
let startNodePart1 = 'AAA';
const targetNodePart1 = 'ZZZ';
while (startNodePart1 !== 'ZZZ') {
    let destinationNode = nodes[startNodePart1][instructions[stepsPart1 % instructions.length] as keyof Node]
    debug(`Step #${stepsPart1 + 1}: [${startNodePart1}] => [${destinationNode}}`);
    startNodePart1 = destinationNode;
    if (destinationNode === targetNodePart1) {
        debug('Target found!')
    }
    stepsPart1++;
}

const minimumStepsPart2 = Object.keys(nodes)
    .filter(node => node.endsWith('A'))
    .map(startNodePart2 => {
        let destinationNode;
        let startNode = startNodePart2;
        let stepsPart2 = 0;
        while (!startNode.endsWith('Z')) {
            destinationNode = nodes[startNode][instructions[stepsPart2 % instructions.length] as keyof Node];
            debug(`Step #${stepsPart2 + 1}: [${startNode}] => [${destinationNode}}`);
            startNode = destinationNode;
            if (destinationNode.endsWith('Z')) {
                debug('Target found!')
            }
            stepsPart2++;
        }
        return stepsPart2;
    });

export const Part1 = stepsPart1;
export const Part2 = lcm(minimumStepsPart2);