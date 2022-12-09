import * as fs from "fs";
import * as path from "path";

type Point = {
    row: number,
    col: number
}

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n');
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.txt`), 'utf8')
    .trim()
    .split('\n');

function moveHead(knots: Point[], direction: string) {
    switch (direction) {
        case 'U':
            knots[0].row--;
            break;
        case 'L':
            knots[0].col--;
            break;
        case 'D':
            knots[0].row++;
            break;
        case 'R':
            knots[0].col++;
            break;
    }
}

function moveKnots(knots: Point[]) {
    for (let ki = 0; ki <= knots.length - 2; ki++) {
        const head = knots[ki];
        const tail = knots[ki + 1];

        const rowOffset = Math.abs(head.row - tail.row);
        const colOffset = Math.abs(head.col - tail.col);

        // Move tail UP or DOWN
        if (tail.col === head.col && rowOffset > 1) {
            tail.row += (head.row - tail.row) >= 0 ? 1 : -1;
        }
        // Move tail LEFT or RIGHT
        if (tail.row === head.row && colOffset > 1) {
            tail.col += (head.col - tail.col) >= 0 ? 1 : -1;
        }
        // Move tail diagonally
        if ((rowOffset >= 1 && colOffset > 1) || (rowOffset > 1 && colOffset >= 1)) {
            tail.row += (head.row - tail.row) >= 0 ? 1 : -1;
            tail.col += (head.col - tail.col) >= 0 ? 1 : -1;
        }
    }
}

function createRope(numberOfKnots: number) {
    return Array(numberOfKnots).fill(0).map(v => Object.assign({}, {row: 0, col: 0}));
}

function simulateRope(knots: Point[], direction: string, length: number, set: Set<string>) {
    for (let i = 1; i <= length; i++) {
        moveHead(knots, direction);
        moveKnots(knots);

        set.add(JSON.stringify(knots[knots.length - 1]));
    }
}

const rope1 = createRope(2);
const rope2 = createRope(10);
let uniqueTailPositionsPart1 = new Set<string>([JSON.stringify(rope1[0])]);
let uniqueTailPositionsPart2 = new Set<string>([JSON.stringify(rope2[0])]);

rawInput.forEach(line => {
    const instructions = line.trim().split(' ');
    const direction = instructions[0];
    const length = parseInt(instructions[1]);

    simulateRope(rope1, direction, length, uniqueTailPositionsPart1);
    simulateRope(rope2, direction, length, uniqueTailPositionsPart2);
});

export const Part1 = uniqueTailPositionsPart1.size;
export const Part2 = uniqueTailPositionsPart2.size;
