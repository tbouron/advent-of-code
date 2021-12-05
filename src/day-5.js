const fs = require('fs');
const path = require('path');

class Point {
    x = 0;
    y = 0;

    constructor(x, y) {
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
        if (start.x !== end.x && start.y !== end.y) {
            throw new Error(`The given points do not form an horizontal or vertical line`);
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
}

class Grid {
    rows = 0;
    columns = 0;
    lines = [];

    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
    }

    addLine(line) {
        if (line.start.x > this.columns || line.start.y > this.rows || line.end.x > this.columns || line.end.y > this.rows) {
            throw new Error(`The line ${line} does not fit into the grid bounds`);
        }
        this.lines.push(line);
    }

    getOverlapPoints() {
        const grid = Array(this.rows + 1)
            .fill([])
            .map(() => Array(this.columns + 1)
                .fill(0)
                .map(() => 0));
        this.lines.map(line => {
            if (line.isHorizontal()) {
                // console.log(`Horizontal`, line);
                for (let x = Math.min(line.start.x, line.end.x); x <= Math.max(line.start.x, line.end.x); x++) {
                    // console.log(`Point: ${x},${line.start.y} – current value: ${grid[line.start.y][x]}`);

                    grid[line.start.y][x] = grid[line.start.y][x] + 1;
                    // console.log(grid);
                }
            }
            if (line.isVertical()) {
                // console.log(`Vertical`, line);
                // console.log(startX, endX);
                for (let y = Math.min(line.start.y, line.end.y); y <= Math.max(line.start.y, line.end.y); y++) {
                    // console.log(`Point covered => ${x},${line.start.y}`);
                    grid[y][line.start.x] = grid[y][line.start.x] + 1;
                }
            }
        });

        console.log(grid);

        return grid.reduce((count, column) => {
            return count + column.filter(item => item >= 2).length;
        }, 0);
    }
}

let maxRows = 0;
let maxColumns = 0;
const grid = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8')
    .split('\n')
    .map(l => {
        let matches = l.trim().match(/([0-9]+),([0-9]+)\s+\->\s+([0-9]+),([0-9]+)/);
        if (matches === null) {
            return null;
        }
        const start = new Point(matches[1], matches[2]);
        const end = new Point(matches[3], matches[4]);
        maxRows = Math.max(matches[2], matches[4], maxRows);
        maxColumns = Math.max(matches[1], matches[3], maxColumns);
        try {
            return new Line(start, end);
        } catch (e) {
            return null;
        }
    })
    .filter(line => line !== null)
    .reduce((grid, line) => {
        grid.addLine(line);
        return grid;
    }, new Grid(maxRows, maxColumns));

module.exports = {
    'Part #1': grid.getOverlapPoints()
}