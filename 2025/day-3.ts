import * as fs from 'fs';
import * as path from 'path';
import {sum} from "../util";

type Cell = {
    pack: string;
    joltage: number;
    index: number;
}
const debug = require('debug')(path.basename(__filename));

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.1.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');

const biggestBatteryPack = (packs: string[], cellsToTurnOn: number): number => {
    return sum(packs.map(pack => {
        let packJoltage = '';
        const cells = pack.split('').map(c => parseInt(c));

        let maxJotageIndex = 0;
        for (let i = 0; i < cellsToTurnOn; i++) {
            let maxJoltage = 0;
            let offset = cellsToTurnOn - i - 1;
            for (let j = maxJotageIndex; j < cells.length - offset; j++) {
                if (maxJoltage < cells[j]) {
                    maxJoltage = cells[j];
                    maxJotageIndex = j;
                }
            }
            cells.splice(maxJotageIndex, 1);
            packJoltage += `${maxJoltage}`;
        }

        debug(`Biggest joltage for pack "${pack}" with ${cellsToTurnOn} cells => ${packJoltage}`);

        return parseInt(packJoltage)
    }));
}

export const Part1 = biggestBatteryPack(rawInput, 2);
export const Part2 = biggestBatteryPack(rawInput, 12);
