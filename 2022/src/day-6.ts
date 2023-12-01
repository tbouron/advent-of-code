import * as fs from "fs";
import * as path from "path";
import {hasDuplicateValues} from "../../util";

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim();

function findStartMarker(length = 4) {
    for (let i = 0; i < rawInput.length - length - 1; i++) {
        const packet = rawInput.slice(i, length + i);

        if (hasDuplicateValues(packet.split(''))) {
            return i + length;
        }
    }
    return -1;
}

export const Part1 = findStartMarker(4);
export const Part2 = findStartMarker(14);