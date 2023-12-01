import * as fs from "fs";
import * as path from "path";
import Debug from 'debug'
import {multiply, sum} from "../../util";
import {performance} from "perf_hooks";

type Point = {
    type: '#' | 'o'
    row: number
    col: number
}

const debug = Debug(__filename);
const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim();
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.txt`), 'utf8')
    .trim();

function parseInput(rawInput: string) {
    return new Set(rawInput
        .split('\n')
        .flatMap(line => line.split(' -> ')
            .map(rawLine => rawLine.trim()
            .split(',')
            .map(v => parseInt(v)))
            .reduce((acc, linePoint, index, linePoints) => {
                if (index === 0) {
                    return acc;
                }
                const rowDiff = linePoint[1] - linePoints[index - 1][1];
                const colDiff = linePoint[0] - linePoints[index - 1][0];
                const max = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
                for (let i = 0; i <= max; i++) {
                    let row = rowDiff === 0
                        ? linePoints[index - 1][1]
                        : linePoints[index - 1][1] + (i * (rowDiff < 0 ? -1 : 1))
                    let col = colDiff === 0
                        ? linePoints[index - 1][0]
                        : linePoints[index - 1][0] + (i * (colDiff < 0 ? -1 : 1))
                    acc.push({
                        type: '#',
                        row: row,
                        col: col
                    });
                }
                acc.push()
                return acc;
            }, [] as Point[])));
}

function simulate(points: Point[], source: number[], infiniteVoid: boolean = true) {
    const rows = points.map(({row}) => row);
    const cols = points.map(({col}) => col);
    const minCols = Math.min(...cols);
    const maxRows = Math.max(...rows);
    const maxCols = Math.max(...cols);

    const grainsQueue = [source];

    while (grainsQueue.length > 0) {
        let grain = grainsQueue[grainsQueue.length - 1];

        // Check if the DOWN neighbour is blocking
        if (points.some(({row, col}) => row === grain[0] + 1 && col === grain[1]) || (!infiniteVoid && grain[0] === maxRows + 1)) {
            // Check if the DOWN-LEFT neighbour is blocking
            if (points.some(({row, col}) => row === grain[0] + 1 && col === grain[1] - 1) || (!infiniteVoid && grain[0] === maxRows + 1)) {
                // Check if the DOWN-RIGHT neighbour is blocking
                if (points.some(({row, col}) => row === grain[0] + 1 && col === grain[1] + 1) || (!infiniteVoid && grain[0] === maxRows + 1)) {
                    debug(`Grain reached final destination at [${grain[0]} ${grain[1]}]`);
                    // debug(`Last good grain vs grain: [${lastGoodGrain}] vs [${grain}]`);
                    points.push({
                        type: 'o',
                        row: grain[0],
                        col: grain[1]
                    });
                    // Reset to last known good position
                    grainsQueue.pop();
                } else {
                    // Otherwise, move diagonally to DOWN-RIGHT
                    grainsQueue.push([grain[0] + 1, grain[1] + 1]);
                }
            } else {
                // Otherwise, move diagonally to DOWN-LEFT
                grainsQueue.push([grain[0] + 1, grain[1] - 1]);
            }
        } else {
            // Otherwise, move DOWN
            grainsQueue.push([grain[0] + 1, grain[1]]);
        }

        // If the grain falls outside our matrix of blocking points
        if (infiniteVoid) {
            if (grain[0] > maxRows) {
                grainsQueue.length = 0;
            }
            if (grain[1] < minCols || grain[1] > maxCols) {
                grainsQueue.length = 0;
            }
        }
    }

    return points;
}

const blockingPoints = parseInput(rawInput);

const blockingPointForInfiniteVoid = simulate(Array.from(blockingPoints), [0, 500], true);
export const Part1 = blockingPointForInfiniteVoid.filter(p => p.type === 'o').length;

const blockingPointForCave = simulate(blockingPointForInfiniteVoid, [0, 500], false);
export const Part2 = blockingPointForCave.filter(p => p.type === 'o').length
