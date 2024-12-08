import * as fs from 'fs';
import * as path from 'path';
import {Matrix} from '../util';

const debug = require('debug')(path.basename(__filename));

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(l => l.split(''));
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.1.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(l => l.split(''));

const findAntiNodesForPositions = (matrix: Matrix<string>, positions: { row: number, col: number }[], withHarmonics: boolean) => {
    return positions.flatMap((position, index, all) => {
        const otherPositions = all.filter((position, i) => i !== index);

        return otherPositions.flatMap(p => {
            const diffRow = position.row - p.row;
            const diffCol = position.col - p.col;

            const an = [];
            let count = 1;
            while (true) {
                const row = position.row + diffRow * count;
                const col = position.col + diffCol * count;
                try {
                    matrix.validate(row, col);
                    an.push({row, col});
                    count++;
                    if (!withHarmonics) {
                        break;
                    }
                } catch (e) {
                    break;
                }
            }
            if (withHarmonics) {
                an.push(position, p);
            }
            return an;
        });
    });
};

const findAllAntinodes = (matrix: Matrix<string>, antennaPositions: {[key: string]: { row: number, col: number }[]}, withHarmonics: boolean)=> {
    return new Set(Object.entries(antennaPositions)
        .flatMap(([antenna, positions]) => {
            const antinodes = findAntiNodesForPositions(matrix, positions, withHarmonics);
            debug(`Antinodes for antenna "${antenna}" ${withHarmonics ? 'with' : 'without'} harmonics | Total: ${antinodes.length} => ${JSON.stringify(antinodes)}`);
            return antinodes;
        })
        .map(an => JSON.stringify(an)));
}

const matrix = new Matrix(rawInput);
const antennaPositions = matrix.search('[a-zA-Z0-9]');

export const Part1 = findAllAntinodes(matrix, antennaPositions, false).size;
export const Part2 = findAllAntinodes(matrix, antennaPositions, true).size;
