import * as fs from 'fs';
import * as path from 'path';
import {multiply, sum} from '../util';

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');

const part1Contraints = {
    red: 12,
    green: 13,
    blue: 14
}

const parsedGames = rawInput.map(line => {
    const game = line.split(':');
    const draws = game[1].split(';').map(draw => {
        return draw.split(',')
            .map(cubes => {
                const match = cubes.trim().match(/([0-9]+) (\w+)/);
                if (match && match.length < 3 && match[2] !== null) {
                    return null;
                }
                return {[match![2] || '']: parseInt(match![1])};
            })
            .filter(draw => draw !== null)
            .reduce((map, draw) => Object.assign(map!, draw!), {})
    });
    return draws as {[p: string]: number}[];
});

const part1 = parsedGames.reduce((sum, draws, index) => {
    const isImpossible = draws.some(draw => {
        return Object.entries(part1Contraints).some(constraint => draw.hasOwnProperty(constraint[0]) && draw[constraint[0]] > constraint[1]);
    });
    if (!isImpossible) {
        sum += index + 1;
    }
    return sum;
}, 0);

const part2 = parsedGames.map(game => {
    const minimumCubesRequired = Object.values(game.reduce((map, draw) => {
        Object.entries(draw!).forEach(cube => {
            if (map.hasOwnProperty(cube[0])) {
                map[cube[0]] = Math.max(map[cube[0]], cube[1]);
            } else {
                map[cube[0]] = cube[1];
            }
        });
        return map;
    }, {}));
    return multiply(minimumCubesRequired);
});

export const Part1 = part1;
export const Part2 = sum(part2);
