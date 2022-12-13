import * as fs from "fs";
import * as path from "path";
import Debug from 'debug'
import {multiply, sum} from "../util";

const debug = Debug(__filename);
const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim();
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.txt`), 'utf8')
    .trim();

function parsePackets(rawData: string) {
    return rawData
        .split('\n\n')
        .map(rawPair => rawPair
            .split('\n')
            .map(item => JSON.parse(item.trim())));
}
function isInRightOrder(left: number | any[], right: number | any[]): number {
    debug(`Compare ${JSON.stringify(left)} vs ${JSON.stringify(right)}`);
    if (typeof left === 'number' && typeof right === 'number') {
        return left - right;
    }
    if (Array.isArray(left) && Array.isArray(right)) {
        for (let li = 0; li < left.length; li++) {
            if (li + 1 > right.length) {
                debug('Right side ran out of items, so inputs are not in the right order');
                return 1;
            }

            let inRightOrder = isInRightOrder(left[li], right[li]);
            if (inRightOrder !== 0) {
                return inRightOrder;
            }
        }
        if (right.length > left.length) {
            debug('Left side ran out of items, so inputs are in the right order');
            return -1;
        }
        return 0;
    }
    if (typeof left === 'number') {
        debug(`Mixed types; convert left to [${left}]`);
        return isInRightOrder([left], right);
    }
    if (typeof right === 'number') {
        debug(`Mixed types; convert right to [${right}]`);
        return isInRightOrder(left, [right]);
    }
    return 0;
}

const packets = parsePackets(rawInput);

const part1 = packets.reduce((indexes, pair, index, pairs) => {
    debug(`==== Pair ${index + 1}`);
    let number = isInRightOrder(pair[0], pair[1]);
    debug(`${number < 0 ? 'Left' : 'Right'} side is smalled, so inputs are ${number < 0 ? 'in the right order' : 'not in the right order'}`);
    if (number < 0) {
        indexes.push(index + 1);
    }
    return indexes;
}, []);

export const Part1 = sum(part1);

const part2 = packets.flatMap(p => p);
part2.push([[2]]);
part2.push([[6]]);
part2.sort((a, b) => isInRightOrder(a, b));

export const Part2 = multiply(['[[2]]', '[[6]]'].map(decoderKey => part2.findIndex(p => JSON.stringify(p) === decoderKey) + 1));