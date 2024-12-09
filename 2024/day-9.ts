import * as fs from 'fs';
import * as path from 'path';

const debug = require('debug')(path.basename(__filename));

const rawInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.txt`), 'utf8')
    .trim()
    .split('');
const rawTestInput = fs.readFileSync(path.join(__dirname, `${path.basename(__filename, '.ts')}.test.1.txt`), 'utf8')
    .trim()
    .split('');

const isFreeBlocks = (blocks: string[]) => blocks.every(b => b === '.');

const readDiskMap = (input: string[]) => {
    return input.reduce((acc, block, index) => {
        const isFileBlock = index % 2 === 0;
        const size = parseInt(block);
        const rep = Array(size).fill(isFileBlock ? (index / 2) : '.');
        if (rep.length > 0) {
            acc.push(rep);
        }
        return acc;
    }, [] as string[][]);
};

const optimizeByIndividualFileBlocks = (input: string[]): string[] => {
    const originalBlocks = structuredClone(input);
    const optimizedBlocks = structuredClone(input);

    return optimizedBlocks.map((block, index) => {
        if (originalBlocks.length - 1 < index) {
            return '.';
        }
        if (block !== '.') {
            return block;
        }

        while (originalBlocks.length > 0) {
            const rightMostOriginalBlock = originalBlocks.pop();
            if (rightMostOriginalBlock !== '.') {
                return rightMostOriginalBlock;
            }
        }

        return '.';
    }) as string[];
};

const optimizeByWholeFileBlocks = (input: string[][]): string[][] => {
    const originalBlocks = structuredClone(input);
    const fileBlocksToMove = structuredClone(input.filter(blocks => !isFreeBlocks(blocks))).reverse();

    fileBlocksToMove.forEach((fileBlockToMove) => {
        const originalIndexToReplace = originalBlocks.findIndex(block => JSON.stringify(block) === JSON.stringify(fileBlockToMove));
        const indexToReplace = originalBlocks.findIndex(block => isFreeBlocks(block) && block.length >= fileBlockToMove.length);
        if (indexToReplace > -1 && indexToReplace < originalIndexToReplace) {
            if (originalIndexToReplace > -1) {
                originalBlocks.splice(originalIndexToReplace, 1, Array(fileBlockToMove.length).fill('.'));
            }
            const blocksToReplace = [fileBlockToMove];
            const emptySpaceToFill = originalBlocks[indexToReplace].length - fileBlockToMove.length;
            if (emptySpaceToFill > 0) {
                blocksToReplace.push(Array(emptySpaceToFill).fill('.'));
            }
            originalBlocks.splice(indexToReplace, 1, ...blocksToReplace);
        }
    });

    return originalBlocks;
};

const checksum = (input: string[]) => {
    return input.reduce((checksum, block, index) => {
        return checksum + (block !== '.' ? parseInt(block) * index : 0);
    }, 0);
}

console.log('/!\\ WARNING /!\\ This puzzle is sloooow, probably brute-forcing it. Take around 40 seconds to complete.');

const blocks = readDiskMap(rawInput);

const optimizedIndividualFileBlocks = optimizeByIndividualFileBlocks(blocks.flatMap(b => b));
debug(`[Map - optimized by individual file block] => ${optimizedIndividualFileBlocks.join('')}`);
const part1 = checksum(optimizedIndividualFileBlocks);
export const Part1 = part1;

const optimizedWholeFileBlocks = optimizeByWholeFileBlocks(blocks);
debug(`[Map - optimized by whole file block]      => ${optimizedWholeFileBlocks.map(b => b.join('')).join('')}`);
const part2 = checksum(optimizedWholeFileBlocks.flatMap(b => b));
export const Part2 = part2;




