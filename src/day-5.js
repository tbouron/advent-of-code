const fs = require('fs');
const path = require('path');

class Point {
    x = 0;
    y = 0;

    constructor(x, y) {
        if (typeof x !== 'number') {
            throw new Error(`X coordinate must be a number. Gave: ${x} (${typeof x})`);
        }
        if (typeof y !== 'number') {
            throw new Error(`Y coordinate must be a number. Gave: ${y} (${typeof y})`);
        }
        if (x < 0) {
            throw new Error('X coordinate must be positive');
        }
        if (y < 0) {
            throw new Error('Y coordinate must be positive');
        }
        this.x = x;
        this.y = y;
    }
}

class Line {
    start;
    end;

    constructor(start, end) {
        if (!start || !end) {
            throw new Error('start and end points must not be null');
        }
        this.start = start;
        this.end = end;
    }

    isVertical() {
        return this.start.x === this.end.x;
    }

    isHorizontal() {
        return this.start.y === this.end.y;
    }

    // i.e. is the line exactly 45 deg diagonal
    isDiagonal() {
        return Math.abs(this.end.x - this.start.x) === Math.abs(this.end.y - this.start.y);
    }
}

class Grid {
    rows = 0;
    columns = 0;
    lines = [];

    constructor(lines) {
        this.lines = lines;
        this.rows = Math.max(...lines.flatMap(line => [line.start.y, line.end.y]));
        this.columns = Math.max(...lines.flatMap(line => [line.start.x, line.end.x]));
    }

    countOverlappingPoints() {
        const grid = Array(this.rows + 1)
            .fill([])
            .map(() => Array(this.columns + 1)
                .fill(0)
                .map(() => 0));

        this.lines.map(line => {
            if (line.isDiagonal()) {
                const directionX = line.end.x > line.start.x ? 1 : -1;
                const directionY = line.end.y > line.start.y ? 1 : -1;
                for (let i = 0; i <= Math.abs(line.end.x - line.start.x); i++) {
                    grid[line.start.y + i * directionY][line.start.x + i * directionX]++;
                }
            } else {
                const startX = Math.min(line.start.x, line.end.x);
                const endX = Math.max(line.start.x, line.end.x);
                const startY = Math.min(line.start.y, line.end.y);
                const endY = Math.max(line.start.y, line.end.y);
                for (let y = startY; y <= endY; y++) {
                    for (let x = startX; x <= endX; x++) {
                        grid[y][x]++;
                    }
                }
            }
        });

        return grid.reduce((count, row) => {
            return count + row.filter(item => item >= 2).length;
        }, 0);
    }
}

const lines = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8')
    .split('\n')
    .map(l => {
        let matches = l.trim().match(/([0-9]+),([0-9]+)\s+\->\s+([0-9]+),([0-9]+)/);
        if (matches === null) {
            return null;
        }
        const start = new Point(parseInt(matches[1]), parseInt(matches[2]));
        const end = new Point(parseInt(matches[3]), parseInt(matches[4]));
        return new Line(start, end);
    });
const hAndVLines = lines.filter(line => line.isHorizontal() || line.isVertical());
// As per the puzzle description, a line will only ever be horizontal, vertical or diagonal.
// However, for the sake of the calculation, I prefer to actually filter for horizontal, vertical and true 45 deg
// diagonal lines rather than assuming the input is ok (which is a bad practice in general)
const hAndVandDLines = lines.filter(line => line.isHorizontal() || line.isVertical() || line.isDiagonal());

module.exports = {
    'Part #1': new Grid(hAndVLines).countOverlappingPoints(),
    'Part #2': new Grid(hAndVandDLines).countOverlappingPoints()
}