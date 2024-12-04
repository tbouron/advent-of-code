const fs = require('fs');
const path = require('path');

class Board {
    rows = 5;
    columns = 5;
    entries = [];

    constructor(numbers) {
        if (!Array.isArray(numbers)) {
            throw new Error('The input numbers should be an array');
        }
        if (numbers.length !== this.rows * this.columns) {
            throw new Error(`The input numbers should be of size ${this.rows * this.columns}`)
        }

        this.entries = Array.from(numbers).map(number => {
            return {
                number: number,
                checked: false
            };
        });
    }

    mark(number) {
        this.entries
            .filter(entry => entry.number === number)
            .forEach(entry => entry.checked = true);
    }

    getRows() {
        return this.entries.reduce((acc, entry, index) => {
            const modulo = index % this.rows;
            const rowIndex = Math.floor(index / this.rows);
            if (modulo === 0) {
                acc.push([]);
            }
            acc[rowIndex].push(entry);
            return acc;
        }, []);
    }

    getColumns() {
        return [...Array(this.columns).keys()]
            .map(i => parseInt(i))
            .reduce((acc, columnIndex) => {
                acc.push(this.entries
                    .filter((entry, entryIndex) => entryIndex % this.columns === columnIndex));
                return acc;
            }, []);
    }

    getWinnerRows() {
        return this.getRows().filter(row => row.every(entry => entry.checked === true));
    }

    getWinnerColumns() {
        return this.getColumns().filter(column => column.every(entry => entry.checked === true));
    }

    isWinner() {
        return this.getWinnerRows().length > 0 || this.getWinnerColumns().length > 0;
    }
}

const parsedInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.js')}.txt`), 'utf8')
    .split(/\n\n/);

const sequence = parsedInput.shift()
    .split(',')
    .map(item => parseInt(item.trim()));
const boards = parsedInput.map(boardInput => new Board(boardInput
    .split('\n')
    .map(line => line.trim())
    .flatMap(line => line.split(/\s+/))
    .map(item => parseInt(item))));

let winnerBoards = [];
let firstWinnerNumber;
let lastWinnerNumber;
for (let index in sequence) {
    const number = sequence[index];
    const newWinnerBoards = boards.filter(b => !winnerBoards.includes(b)).map(board => {
        board.mark(number);
        return board;
    }).filter(board => board.isWinner());

    winnerBoards.push(...newWinnerBoards);

    if (!firstWinnerNumber && newWinnerBoards.length > 0) {
        firstWinnerNumber = number;
    }
    if (newWinnerBoards.length > 0) {
        lastWinnerNumber = number;
    }
    if (winnerBoards.length === boards.length) {
        break;
    }
}

if (winnerBoards.length === 0) {
    throw new Error('Urgh, no winner!');
}

const part1 = winnerBoards[0].entries
    .filter(entry => entry.checked === false)
    .reduce((acc, entry) => acc + entry.number, 0) * firstWinnerNumber;
const part2 = winnerBoards.pop().entries
    .filter(entry => entry.checked === false)
    .reduce((acc, entry) => acc + entry.number, 0) * lastWinnerNumber;

module.exports = {
    'Part #1': part1,
    'Part #2': part2
};