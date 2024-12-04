import * as fs from 'fs';
import * as path from 'path';
const debug = require('debug')(path.basename(__filename));
import {multiply, sum} from '../util';

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.txt`), 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');

type Row = {
    parts: Part[]
    symbols: Symbol[]
}

type Part = {
    number: string
    index: number
}

type Symbol = {
    symbol: string
    index: number
}

const getAdjacentPartNumber = (symbolIndex: number, rowIndex: number, row: Row): number[] => {
    return row.parts
        .filter(part => part.index <= symbolIndex + 1 && part.index + part.number.length > symbolIndex - 1)
        .map(part => parseInt(part.number))
}

const parseRows = (lines: string[]): Row[] => {
    return lines.map(line => {
        const symbols = Array.from(line.matchAll(/[!@£$%^&*#\-_=+/\\]/g));
        const parts = Array.from(line.matchAll(/([0-9]+)/g));

        return {
            parts: parts.map(part => ({
                number: part[0],
                index: part.index
            })),
            symbols: symbols.map(match => ({
                symbol: match[0],
                index: match.index
            }))
        } as Row;
    })
}


const part1 = parseRows(rawInput)
    .reduce((parts, input, rowIndex, rows) => {
        input.symbols.forEach(symbol => {
            const partsForSymbol = [];
            if (rowIndex > 0) {
                partsForSymbol.push(...getAdjacentPartNumber(symbol.index, rowIndex - 1, rows[rowIndex - 1]));
            }
            partsForSymbol.push(...getAdjacentPartNumber(symbol.index, rowIndex, input));
            if (rowIndex < rows.length - 1) {
                partsForSymbol.push(...getAdjacentPartNumber(symbol.index, rowIndex + 1, rows[rowIndex + 1]));
            }
            debug(`==> Checking parts number for symbol "${symbol.symbol}" (index: ${symbol.index}) on row index ${rowIndex}\nParts found: ${partsForSymbol}`);
            parts.push(...partsForSymbol);
        });
        return parts;
    }, [] as number[]);

const part2 = parseRows(rawInput)
    .reduce((gearRatios, input, rowIndex, rows) => {
        input.symbols.forEach(symbol => {
            const partsForSymbol = [];
            if (rowIndex > 0) {
                partsForSymbol.push(...getAdjacentPartNumber(symbol.index, rowIndex - 1, rows[rowIndex - 1]));
            }
            partsForSymbol.push(...getAdjacentPartNumber(symbol.index, rowIndex, input));
            if (rowIndex < rows.length - 1) {
                partsForSymbol.push(...getAdjacentPartNumber(symbol.index, rowIndex + 1, rows[rowIndex + 1]));
            }

            if (partsForSymbol.length === 2) {
                debug(`==> Gear found (index: ${symbol.index}) on row index ${rowIndex}\nRatio: ${partsForSymbol}`);
                gearRatios.push(multiply(partsForSymbol));
            }
        });
        return gearRatios;
    }, [] as number[]);

export const Part1 = sum(part1);
export const Part2 = sum(part2);
